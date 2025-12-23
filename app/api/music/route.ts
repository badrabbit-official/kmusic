import { NextResponse } from 'next/server';
import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { parseFile } from 'music-metadata';

const MUSIC_DIR = join(process.cwd(), 'data');
const METADATA_FILE = join(MUSIC_DIR, 'music-metadata.json');
const SUPPORTED_FORMATS = ['.mp3', '.ogg', '.opus', '.flac', '.m4a', '.wav'];

export interface MusicFile {
  id: string;
  filename: string;
  path: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  format: string;
  size: number;
  cover?: string;
  genre?: string;
}

interface MetadataEntry {
  filename: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  duration?: number;
  genre?: string;
}

async function loadMetadata(): Promise<Map<string, MetadataEntry>> {
  const metadataMap = new Map<string, MetadataEntry>();
  
  if (existsSync(METADATA_FILE)) {
    try {
      const content = await readFile(METADATA_FILE, 'utf-8');
      const metadata: MetadataEntry[] = JSON.parse(content);
      
      metadata.forEach(entry => {
        metadataMap.set(entry.filename, entry);
      });
    } catch (error) {
      // Return empty map if metadata file can't be loaded
    }
  }
  
  return metadataMap;
}

async function scanMusicDirectory(dir: string, basePath: string = '', metadataMap: Map<string, MetadataEntry>): Promise<MusicFile[]> {
  const files: MusicFile[] = [];
  
  if (!existsSync(dir)) {
    return files;
  }

  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        const subFiles = await scanMusicDirectory(fullPath, relativePath, metadataMap);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = entry.name.toLowerCase().substring(entry.name.lastIndexOf('.'));
        if (SUPPORTED_FORMATS.includes(ext)) {
          try {
            const stats = await stat(fullPath);
            
            // Get metadata from JSON file first, then fallback to file metadata
            const jsonMetadata = metadataMap.get(entry.name);
            let metadata: any = {};
            
            if (!jsonMetadata) {
              try {
                metadata = await parseFile(fullPath);
              } catch (e) {
                // If metadata parsing fails, use filename - silently continue
              }
            }

            const title = jsonMetadata?.title || 
                         metadata.common?.title || 
                         entry.name.replace(/\.[^/.]+$/, '');
            const artist = jsonMetadata?.artist || 
                          metadata.common?.artist || 
                          metadata.common?.albumartist || 
                          'Unknown Artist';
            const album = jsonMetadata?.album || metadata.common?.album;
            const duration = jsonMetadata?.duration || 
                            (metadata.format?.duration ? Math.round(metadata.format.duration) : undefined);
            const cover = jsonMetadata?.cover;
            const genre = jsonMetadata?.genre || metadata.common?.genre?.[0];

            files.push({
              id: relativePath.replace(/[^a-zA-Z0-9]/g, '_'),
              filename: entry.name,
              path: `/api/music/stream?file=${encodeURIComponent(relativePath)}`,
              title,
              artist,
              album,
              duration,
              format: ext.substring(1),
              size: stats.size,
              cover,
              genre,
            });
          } catch (error) {
            // Skip files that can't be processed
          }
        }
      }
    }
  } catch (error) {
    // Return empty array on error
  }
  
  return files;
}

export async function GET() {
  try {
    const metadataMap = await loadMetadata();
    const musicFiles = await scanMusicDirectory(MUSIC_DIR, '', metadataMap);
    return NextResponse.json({ 
      success: true, 
      files: musicFiles,
      count: musicFiles.length 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to scan music directory' },
      { status: 500 }
    );
  }
}

