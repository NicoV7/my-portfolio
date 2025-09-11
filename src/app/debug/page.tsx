'use client'

import { useState } from 'react'
import Image from 'next/image'
import AnimatedBackground from '../components/AnimatedBackground'

export default function DebugPage() {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const [gifLoaded, setGifLoaded] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)
  const [gifError, setGifError] = useState(false)

  const thumbnailUrl = '/projects/thumbnails/taskmanager-thumb.png'
  const gifUrl = '/projects/gifs/taskmanager-demo-test.png'

  console.log('🔧 Debug Page URLs:', { thumbnailUrl, gifUrl })

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 night:bg-black transition-colors duration-300">
      <AnimatedBackground variant="code" intensity="subtle" />
      <div className="relative z-10 container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Loading Debug</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Thumbnail Test */}
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Thumbnail Test</h2>
          <div className="mb-4">
            <p className="text-sm mb-2"><strong>URL:</strong> {thumbnailUrl}</p>
            <p className="text-sm mb-2">
              <strong>Status:</strong> 
              <span className={thumbnailLoaded ? 'text-green-600' : thumbnailError ? 'text-red-600' : 'text-yellow-600'}>
                {thumbnailLoaded ? ' ✅ Loaded' : thumbnailError ? ' ❌ Error' : ' ⏳ Loading...'}
              </span>
            </p>
            <a href={thumbnailUrl} target="_blank" className="text-blue-600 hover:underline text-sm">
              🔗 Test direct link
            </a>
          </div>
          
          <div className="bg-gray-100 p-4 rounded h-48 flex items-center justify-center">
            <Image
              src={thumbnailUrl}
              alt="Thumbnail test"
              width={300}
              height={200}
              className="max-w-full max-h-full object-contain"
              onLoad={() => {
                console.log('✅ Thumbnail loaded successfully')
                setThumbnailLoaded(true)
              }}
              onError={(e) => {
                console.error('❌ Thumbnail failed to load:', e)
                setThumbnailError(true)
              }}
            />
          </div>
        </div>

        {/* GIF Test */}
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">GIF Test (Same as ProjectCard)</h2>
          <div className="mb-4">
            <p className="text-sm mb-2"><strong>URL:</strong> {gifUrl}</p>
            <p className="text-sm mb-2">
              <strong>Status:</strong> 
              <span className={gifLoaded ? 'text-green-600' : gifError ? 'text-red-600' : 'text-yellow-600'}>
                {gifLoaded ? ' ✅ Loaded' : gifError ? ' ❌ Error' : ' ⏳ Loading...'}
              </span>
            </p>
            <a href={gifUrl} target="_blank" className="text-blue-600 hover:underline text-sm">
              🔗 Test direct link
            </a>
          </div>
          
          <div className="bg-gray-100 p-4 rounded h-48 flex items-center justify-center">
            <Image
              src={gifUrl}
              alt="GIF test"
              width={300}
              height={200}
              className="max-w-full max-h-full object-contain"
              onLoad={() => {
                console.log('✅ GIF loaded successfully')
                setGifLoaded(true)
              }}
              onError={(e) => {
                console.error('❌ GIF failed to load:', e)
                setGifError(true)
              }}
            />
          </div>
        </div>
      </div>

      {/* Project Card Test */}
      <div className="mt-8 border-2 border-blue-300 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Project Card Debug</h2>
        <p className="text-sm text-gray-600 mb-4">
          This shows exactly what the ProjectCard component should render:
        </p>
        
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-xs font-mono mb-2">
            Project has NO previewMedia, so it should render the thumbnail image
          </p>
          <p className="text-xs font-mono mb-4">
            Expected img src: {thumbnailUrl}
          </p>
          
          <div className="w-64 h-48 bg-white rounded border overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt="AI Task Manager thumbnail"
              width={256}
              height={192}
              className="w-full h-full object-cover"
              onLoad={() => console.log('✅ ProjectCard-style thumbnail loaded')}
              onError={() => console.log('❌ ProjectCard-style thumbnail failed')}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-500">
        <p>📝 Open browser dev tools (F12) to see console logs</p>
        <p>🌐 Visit: http://localhost:3004/debug</p>
      </div>
      </div>
    </div>
  )
}