import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const inputPath = path.join(__dirname, '../public/profile.jpg')
const outputDir = path.join(__dirname, '../public')

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('Generating favicons from profile picture...')

// Generate multiple favicon sizes for different use cases
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
]

async function generateFavicons() {
  for (const { size, name } of sizes) {
    const outputPath = path.join(outputDir, name)

    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
      })
      .png()
      .toFile(outputPath)

    console.log(`✓ Generated ${name} (${size}x${size})`)
  }

  // Generate the default favicon.ico using the 32x32 version
  const faviconPath = path.join(outputDir, 'favicon.ico')
  await sharp(inputPath)
    .resize(32, 32, {
      fit: 'cover',
      position: 'center',
    })
    .png()
    .toFile(faviconPath)

  console.log('✓ Generated favicon.ico')
  console.log('\n✅ All favicons generated successfully!')
}

generateFavicons().catch((error) => {
  console.error('Error generating favicons:', error)
  process.exit(1)
})
