import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

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
    
    // Launch Puppeteer (using the same logic as your convert-to-pdf.js)
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
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
    return NextResponse.json(
      { error: 'Failed to convert HTML to PDF' },
      { status: 500 }
    )
  }
}
