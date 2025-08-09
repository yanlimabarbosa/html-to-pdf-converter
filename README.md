# HTML to PDF Converter

A modern web application that converts HTML files to PDF using Puppeteer with a clean dark theme interface.

## Live Demo
- Deployed on Netlify: https://html-to-pdf-converter-online.netlify.app/

<div align="center">
  <img width="1632" height="1109" alt="image" src="https://github.com/user-attachments/assets/9b73f14d-7ea7-436f-aeb1-111f21777d23" />
</div>

## Features

- 📁 **Drag & Drop Upload**: Drag your HTML file or click to browse
- ⚡ **Puppeteer Processing**: Server-side conversion with high-quality output
- 📄 **Automatic Download**: PDF downloads instantly after conversion
- 🌙 **Dark Theme**: Professional, modern UI
- 🚀 **Fast & Reliable**: Built with Next.js and TypeScript

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## How it Works

1. Upload an HTML file using drag & drop or file selector  
2. The server converts it to PDF using Puppeteer (A4, printBackground, zero margins)  
3. The generated PDF is downloaded automatically

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Puppeteer
- React
