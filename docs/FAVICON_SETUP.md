# Favicon Setup Guide

## Overview

The application uses your professional profile picture (`public/profile.jpg`) to generate all required favicon formats automatically.

## Generated Files

When you run `npm run generate-favicon`, the following files are created in the `public/` directory:

### Browser Favicons
- **favicon.ico** (32×32) - Default browser icon
- **favicon-16x16.png** - Small browser icon
- **favicon-32x32.png** - Standard browser icon

### Mobile/PWA Icons
- **apple-touch-icon.png** (180×180) - iOS home screen icon
- **android-chrome-192x192.png** - Android standard icon
- **android-chrome-512x512.png** - Android high-res icon

### Manifest File
- **site.webmanifest** - PWA configuration with theme colors

## How It Works

### Generation Script
Location: `scripts/generate-favicon.mjs`

The script uses the **sharp** library (already included with Next.js) to:
1. Read your profile picture
2. Resize to various dimensions
3. Apply proper cropping (center-focused)
4. Generate PNG files for all sizes
5. Create favicon.ico for legacy browser support

### Integration
Location: `src/app/layout.tsx`

```typescript
export function generateMetadata(): Metadata {
  return {
    title: 'Abdoulaye Sow - Resume',
    description: 'SAFe SPC6 Certified Trainer and enterprise Agile Transformation Leader',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  }
}
```

## Usage

### Generate Favicons
```bash
npm run generate-favicon
```

### When to Regenerate
- After updating `public/profile.jpg`
- When deploying to a new domain
- If favicon appears blurry or incorrect

### Update Profile Picture
1. Replace `public/profile.jpg` with your new photo
2. Run `npm run generate-favicon`
3. Refresh browser (hard refresh: Ctrl+F5)
4. Check result in browser tab

## Image Requirements

### Source Image (`profile.jpg`)
- **Format**: JPG, PNG, or WebP
- **Minimum size**: 512×512px (recommended 1024×1024px)
- **Aspect ratio**: Square (1:1)
- **Content**: Face/head should be centered
- **Quality**: High resolution for best results

### Cropping Strategy
The script uses **center-focused cropping**:
- Automatically centers on the middle of the image
- Maintains aspect ratio
- Uses 'cover' fit (fills entire square)

If your face is off-center in the source image, consider:
1. Pre-cropping the source image to center your face
2. Modifying the script's `position` parameter

## Troubleshooting

### Favicon Not Updating
1. **Hard refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache**: Check DevTools > Application > Storage
3. **Restart dev server**: `npm run dev`
4. **Check file exists**: Verify files in `public/` directory

### Blurry Favicon
- Source image too small → Use at least 512×512px
- Re-run generation script after updating source

### Wrong Cropping
Edit `scripts/generate-favicon.mjs`:
```javascript
await sharp(inputPath)
  .resize(size, size, {
    fit: 'cover',
    position: 'top', // Change: 'center', 'top', 'bottom', 'left', 'right'
  })
```

### Missing Files
If files don't generate:
1. Check `public/profile.jpg` exists
2. Verify sharp is installed: `npm list sharp`
3. Check for errors in script output
4. Manually create `public/` directory if needed

## Browser Support

### Modern Browsers
- ✅ Chrome/Edge (all icon sizes)
- ✅ Firefox (all icon sizes)
- ✅ Safari (including apple-touch-icon)
- ✅ Opera (all icon sizes)

### Mobile Browsers
- ✅ iOS Safari (apple-touch-icon)
- ✅ Chrome Mobile (android-chrome icons)
- ✅ Firefox Mobile
- ✅ Samsung Internet

### Legacy Browsers
- ✅ IE11 (favicon.ico fallback)
- ✅ Old Android browsers (PNG fallback)

## PWA Configuration

### Manifest (`site.webmanifest`)
```json
{
  "name": "Abdoulaye Sow - Resume",
  "short_name": "AS Resume",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#1e3a5f",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

### Theme Colors
- **theme_color**: `#1e3a5f` (Navy - matches resume header)
- **background_color**: `#ffffff` (White)

Update these in `site.webmanifest` if you change your color scheme.

## Deployment

### Vercel/Netlify
Favicons are automatically included in the build:
- All files in `public/` are copied to root
- No additional configuration needed
- Served with proper cache headers

### Custom Hosting
Ensure all files are in the web root:
```
/favicon.ico
/favicon-16x16.png
/favicon-32x32.png
/apple-touch-icon.png
/android-chrome-192x192.png
/android-chrome-512x512.png
/site.webmanifest
```

### CDN Configuration
Set proper cache headers:
```
Cache-Control: public, max-age=31536000, immutable
```

## Advanced Customization

### Custom Sizes
Edit `scripts/generate-favicon.mjs`:
```javascript
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 64, name: 'favicon-64x64.png' }, // Add custom size
  // ... more sizes
]
```

### Different Source Image
Change the input path:
```javascript
const inputPath = path.join(__dirname, '../public/custom-favicon.jpg')
```

### Format Conversion
Change output format (e.g., WebP):
```javascript
await sharp(inputPath)
  .resize(size, size)
  .webp({ quality: 90 })
  .toFile(outputPath)
```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run generate-favicon` | Generate all favicon files |
| `npm run dev` | Start dev server (favicons auto-loaded) |
| `npm run build` | Build includes favicons |

## Best Practices

1. ✅ Use high-quality source image (1024×1024px minimum)
2. ✅ Keep face/logo centered in source image
3. ✅ Regenerate favicons when updating profile picture
4. ✅ Test in multiple browsers after generation
5. ✅ Hard refresh browser to see changes
6. ✅ Commit generated files to Git
7. ✅ Verify favicons appear correctly on all devices

---

**Last Updated**: 2026-02-07
