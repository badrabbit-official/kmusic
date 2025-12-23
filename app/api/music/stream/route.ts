import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const MUSIC_DIR = join(process.cwd(), 'data');

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileParam = searchParams.get('file');
  
  if (!fileParam) {
    return NextResponse.json(
      { error: 'File parameter is required' },
      { status: 400 }
    );
  }

  try {
    const filePath = join(MUSIC_DIR, decodeURIComponent(fileParam));
    
    // Security check: ensure file is within MUSIC_DIR
    if (!filePath.startsWith(MUSIC_DIR)) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 403 }
      );
    }

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const stats = await stat(filePath);
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    const contentTypeMap: Record<string, string> = {
      '.mp3': 'audio/mpeg',
      '.ogg': 'audio/ogg',
      '.opus': 'audio/ogg; codecs=opus',
      '.flac': 'audio/flac',
      '.m4a': 'audio/mp4',
      '.wav': 'audio/wav',
    };
    
    const contentType = contentTypeMap[ext] || 'audio/mpeg';
    
    // Support range requests for streaming
    const range = request.headers.get('range');
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunkSize = (end - start) + 1;
      const chunk = fileBuffer.slice(start, end + 1);
      
      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Length': stats.size.toString(),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to stream file' },
      { status: 500 }
    );
  }
}

