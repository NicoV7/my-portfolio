# Project Assets Organization

This directory contains all assets for portfolio projects, organized for easy maintenance and optimal loading.

## Folder Structure

```
public/projects/
├── thumbnails/          # Project thumbnail images (displayed in project cards)
├── screenshots/         # Gallery images and detailed screenshots  
├── videos/             # Demo videos (MP4 format recommended)
├── gifs/               # Animated previews (GIF format)
└── README.md           # This documentation file
```

## Usage Guidelines

### Thumbnails (`/thumbnails/`)
- Main project preview images
- Recommended size: 400x300px or 16:9 aspect ratio  
- Format: PNG or JPG
- Naming: `{project-slug}-thumb.{ext}`

### Screenshots (`/screenshots/`)
- Detailed project screenshots for galleries
- High-resolution images showcasing features
- Format: PNG for UI screenshots, JPG for photos
- Naming: `{project-slug}-{description}.{ext}`

### Videos (`/videos/`)
- Project demo videos
- Format: MP4 (H.264 encoding recommended)
- Keep file sizes reasonable (<10MB when possible)
- Naming: `{project-slug}-demo.mp4`

### GIFs (`/gifs/`)
- Short animated previews for project cards
- Optimize for web (use tools like GIMP or online optimizers)
- Keep under 2MB when possible
- Naming: `{project-slug}-demo.gif`

## Example Project Data

```typescript
{
  thumbnailImage: '/projects/thumbnails/my-project-thumb.png',
  images: [
    {
      url: '/projects/thumbnails/my-project-thumb.png',
      alt: 'Project thumbnail',
      type: 'thumbnail'
    },
    {
      url: '/projects/screenshots/my-project-dashboard.png',
      alt: 'Dashboard screenshot',
      type: 'gallery'
    }
  ],
  previewMedia: {
    url: '/projects/gifs/my-project-demo.gif',
    type: 'gif',
    fallbackImage: '/projects/thumbnails/my-project-thumb.png'
  }
}
```

## Optimization Tips

1. **Compress images** before adding them to reduce bundle size
2. **Use WebP format** when possible for better compression
3. **Provide fallback images** for all video/GIF content
4. **Use consistent naming** for easier maintenance
5. **Test on mobile** to ensure images load properly