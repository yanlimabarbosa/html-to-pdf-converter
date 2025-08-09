import FileUpload from '@/components/FileUpload'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            HTML to PDF Converter
          </h1>
          <p className="text-lg text-gray-300 mb-2">
            Convert your HTML files to PDF using Puppeteer
          </p>
          <p className="text-sm text-gray-400">
            Powered by Next.js • Same logic as your convert-to-pdf.js script
          </p>
        </div>
        
        <FileUpload />
        
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-semibold text-white mb-2">Upload HTML</h3>
              <p className="text-sm text-gray-300">
                Drag & drop or click to select your HTML file
              </p>
            </div>
            {/* <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-white mb-2">Puppeteer Processing</h3>
              <p className="text-sm text-gray-300">
                Server-side conversion with the same settings as your script
              </p>
            </div> */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <div className="text-2xl mb-2">📄</div>
              <h3 className="font-semibold text-white mb-2">Download PDF</h3>
              <p className="text-sm text-gray-300">
                Get your converted PDF file automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
