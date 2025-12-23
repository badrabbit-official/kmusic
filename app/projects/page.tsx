'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Code, Gamepad2, Globe, Cpu, Database, Zap } from 'lucide-react';

const projects = [
  {
    id: 'cyberpunk-scroller',
    title: 'CYBERPUNK SCROLLER',
    category: 'GAME',
    description: '2D платформер в стиле киберпанк с динамичным геймплеем и пиксельной графикой',
    tech: ['Unity', 'C#', 'Pixel Art'],
    color: { border: '#00ff64', glow: 'rgba(0,255,100,0.3)', text: '#00ff64' },
    icon: Gamepad2,
    link: '/game',
    featured: true
  },
  {
    id: 'neural-interface',
    title: 'NEURAL INTERFACE',
    category: 'WEB APP',
    description: 'AI-powered веб-приложение с обработкой данных в реальном времени',
    tech: ['React', 'TypeScript', 'AI/ML'],
    color: { border: '#00d4ff', glow: 'rgba(0,212,255,0.3)', text: '#00d4ff' },
    icon: Cpu,
    link: '#',
    featured: false
  },
  {
    id: 'quantum-database',
    title: 'QUANTUM DATABASE',
    category: 'BACKEND',
    description: 'Высокопроизводительная система баз данных с квантовым шифрованием',
    tech: ['Node.js', 'PostgreSQL', 'Blockchain'],
    color: { border: '#ff6b00', glow: 'rgba(255,107,0,0.3)', text: '#ff6b00' },
    icon: Database,
    link: '#',
    featured: false
  },
  {
    id: 'holographic-ui',
    title: 'HOLOGRAPHIC UI',
    category: 'FRONTEND',
    description: '3D интерактивный интерфейс с возможностями дополненной реальности',
    tech: ['Three.js', 'WebGL', 'AR'],
    color: { border: '#00ff64', glow: 'rgba(0,255,100,0.3)', text: '#00ff64' },
    icon: Globe,
    link: '#',
    featured: false
  },
  {
    id: 'cyber-terminal',
    title: 'CYBER TERMINAL',
    category: 'TOOL',
    description: 'Терминал для управления системой с расширенными возможностями',
    tech: ['Next.js', 'TypeScript', 'WebSocket'],
    color: { border: '#00d4ff', glow: 'rgba(0,212,255,0.3)', text: '#00d4ff' },
    icon: Code,
    link: '#',
    featured: false
  },
  {
    id: 'energy-core',
    title: 'ENERGY CORE',
    category: 'SYSTEM',
    description: 'Система мониторинга энергопотребления с визуализацией данных',
    tech: ['Python', 'React', 'D3.js'],
    color: { border: '#ff6b00', glow: 'rgba(255,107,0,0.3)', text: '#ff6b00' },
    icon: Zap,
    link: '#',
    featured: false
  }
];

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,100,0.05),transparent_50%)]" />
      </div>

      {/* Grid Overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,100,0.02)_50%)] bg-[length:100%_4px] animate-[scanline_8s_linear_infinite]" />
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md bg-black/40 border-b-2 border-lime-500/30"
          style={{ boxShadow: '0 0 20px rgba(0,255,100,0.1)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-xl sm:text-2xl font-bold font-mono cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-orbitron), monospace',
                    color: '#00ff64',
                    textShadow: '0 0 10px rgba(0,255,100,0.5)'
                  }}
                >
                  {'[PORTFOLIO.EXE]'}
                </motion.div>
              </Link>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-lime-400 font-mono text-sm border-2 px-4 py-2"
                  style={{
                    borderColor: '#00ff64',
                    boxShadow: '0 0 10px rgba(0,255,100,0.2)'
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  [BACK]
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Header */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center mb-16"
            >
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 font-mono"
                style={{
                  fontFamily: 'var(--font-orbitron), monospace',
                  color: '#00ff64',
                  textShadow: '0 0 20px rgba(0,255,100,0.6), 0 0 40px rgba(0,255,100,0.4)'
                }}
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0,255,100,0.6), 0 0 40px rgba(0,255,100,0.4)',
                    '0 0 30px rgba(0,255,100,0.9), 0 0 60px rgba(0,255,100,0.6)',
                    '0 0 20px rgba(0,255,100,0.6), 0 0 40px rgba(0,255,100,0.4)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                [PROJECTS]
              </motion.h1>
              <p className="text-gray-300 text-lg sm:text-xl font-mono max-w-2xl mx-auto">
                Коллекция проектов в киберпанк стиле
              </p>
            </motion.div>

            {/* Featured Project */}
            {projects.filter(p => p.featured).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-16"
              >
                <Link href={project.link}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -10 }}
                    className="relative group cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                      style={{ background: `linear-gradient(135deg, ${project.color.border}, transparent)` }}
                    />
                    <div
                      className="relative p-8 md:p-12 border-2 bg-black/80 backdrop-blur-sm"
                      style={{
                        borderColor: project.color.border,
                        boxShadow: `0 0 30px ${project.color.glow}`
                      }}
                    >
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: project.color.border }} />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: project.color.border }} />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: project.color.border }} />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: project.color.border }} />
                      
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-shrink-0">
                          <div
                            className="w-24 h-24 border-2 flex items-center justify-center"
                            style={{ borderColor: project.color.border }}
                          >
                            <project.icon className="w-12 h-12" style={{ color: project.color.text }} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <span
                              className="px-3 py-1 border text-xs font-mono"
                              style={{
                                borderColor: project.color.border,
                                color: project.color.text
                              }}
                            >
                              {project.category}
                            </span>
                            <span className="text-lime-400 text-xs font-mono">[FEATURED]</span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">{project.title}</h2>
                          <p className="text-gray-300 mb-6 text-lg">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 bg-black/50 text-xs border font-mono"
                                style={{
                                  borderColor: project.color.border,
                                  color: project.color.text
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <motion.div
                            className="inline-flex items-center gap-2 font-mono"
                            style={{ color: project.color.text }}
                            whileHover={{ x: 5 }}
                          >
                            [VIEW_PROJECT] <Sparkles className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => !p.featured).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link href={project.link}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="relative group cursor-pointer h-full"
                    >
                      <div
                        className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        style={{ background: `linear-gradient(135deg, ${project.color.border}, transparent)` }}
                      />
                      <div
                        className="relative p-6 border-2 bg-black/80 backdrop-blur-sm h-full"
                        style={{
                          borderColor: project.color.border,
                          boxShadow: `0 0 20px ${project.color.glow}`
                        }}
                      >
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: project.color.border }} />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: project.color.border }} />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: project.color.border }} />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: project.color.border }} />
                        
                        <div className={`w-12 h-12 mb-4 flex items-center justify-center border-2`} style={{ borderColor: project.color.border }}>
                          <project.icon className="w-6 h-6" style={{ color: project.color.text }} />
                        </div>
                        <div className="mb-2">
                          <span
                            className="px-2 py-1 border text-xs font-mono"
                            style={{
                              borderColor: project.color.border,
                              color: project.color.text
                            }}
                          >
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-mono">{project.title}</h3>
                        <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-black/50 text-xs border font-mono"
                              style={{
                                borderColor: project.color.border,
                                color: project.color.text
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <motion.div
                          className="flex items-center gap-2 font-mono text-sm"
                          style={{ color: project.color.text }}
                          whileHover={{ x: 5 }}
                        >
                          [VIEW] <ArrowLeft className="w-4 h-4 rotate-180" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-lime-500/30 mt-20">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400 font-mono text-sm" style={{ fontFamily: 'var(--font-orbitron), monospace' }}>
              © 2024 [CYBERPUNK_PORTFOLIO.EXE] PROJECTS MODULE
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

