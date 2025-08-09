'use client'

import { useState, useCallback } from 'react'

export default function FileUpload() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.endsWith('.html')) {
      setMessage('Please upload an HTML file')
      return
    }

    try {
      setIsConverting(true)
      setMessage('Converting HTML to PDF...')
      
      const formData = new FormData()
      formData.append('htmlFile', file)
      
      const response = await fetch('/api/convert-pdf', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Conversion failed')
      }
      
      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace('.html', '.pdf')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      setMessage(`PDF "${file.name.replace('.html', '.pdf')}" has been generated and downloaded successfully!`)
      
    } catch (error) {
      console.error('Error converting HTML to PDF:', error)
      setMessage('Error converting HTML to PDF: ' + (error as Error).message)
    } finally {
      setIsConverting(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-900/20' 
            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <div className="mb-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-lg font-medium text-gray-200">
              Drop your HTML file here, or{' '}
              <span className="text-blue-400 hover:text-blue-300">click to browse</span>
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".html"
              onChange={handleFileInputChange}
              disabled={isConverting}
            />
          </label>
        </div>
        
        <p className="text-sm text-gray-400">
          Upload an HTML file to convert it to PDF using Puppeteer
        </p>
      </div>

      {isConverting && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-600">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Converting with Puppeteer...
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-6 p-4 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-900/30 text-red-300 border border-red-700' 
            : 'bg-green-900/30 text-green-300 border border-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
