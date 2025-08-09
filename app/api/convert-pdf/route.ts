import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer'
import puppeteerCore from 'puppeteer-core'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('htmlFile') as File
    
    if (!file || !file.name.endsWith('.html')) {
      return NextResponse.json(
        { error: 'Please upload a valid HTML file' },
        { status: 400 }
      )
    }

    const htmlContent = await file.text()
    
    // Launch Chromium - use serverless on Linux or when forced, fallback to local Chrome on Windows
    const isServerless = !!(process.env.NETLIFY || process.env.VERCEL || process.env.AWS_REGION)
    const isLinux = process.platform === 'linux'
    const useServerlessChromium = isServerless && isLinux

    let browser
    
    if (useServerlessChromium) {
      // Serverless Linux - use @sparticuz/chromium-min
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      })
    } else if (isServerless && !isLinux) {
      // Serverless non-Linux (local testing) - use puppeteer-core with system Chrome
      const executablePath = process.platform === 'win32' 
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      
      browser = await puppeteerCore.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    } else {
      // Local development - use full puppeteer
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    }
    
    const page = await browser.newPage()
    
    // Set the HTML content directly (instead of loading from file)
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    
    // Generate PDF with same options as your script
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      }
    })
    
    await browser.close()
    
    // Return PDF as downloadable file
    const fileName = file.name.replace('.html', '.pdf')
    
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
    
  } catch (error) {
    console.error('Error converting HTML to PDF:', error)
    console.error('Platform:', process.platform)
    console.error('Environment:', { 
      NETLIFY: process.env.NETLIFY,
      NODE_VERSION: process.version,
      isServerless: !!(process.env.NETLIFY || process.env.VERCEL || process.env.AWS_REGION)
    })
    return NextResponse.json(
      { 
        error: 'Failed to convert HTML to PDF',
        details: error instanceof Error ? error.message : String(error),
        platform: process.platform
      },
      { status: 500 }
    )
  }
}
