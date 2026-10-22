# Panorama Viewer Application

This is a React application that displays interactive 360° panoramic images on a map interface.

Live: https://geo-panorama-viewer.vercel.app

![Panorama viewer demo](docs/demo.gif)

## Features

- Interactive map with location markers
- Navigation between multiple panorama images
- Export markers as GeoJSON


## Running the Application Locally

1. Clone or download the repository
2. Navigate to the project directory:
   ```bash
   cd geo-panorama-viewer
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

5. Open your browser and visit `http://localhost:5173`

## Configuring Image URLs

### Method 1: Place Images in the Public Folder (Recommended)

1. Place your equirectangular 360° images in the `public` folder
2. Update the image paths in `src/App.jsx`:
   ```javascript
     const panoramas = [
    {
      id: 1,
      title: "Mountain Vista",
      url: "/image.png",
      lat: 40.7128,
      lng: -74.006,
      description: "Mountain landscape",
    },
     // ... more panoramas
   ];
   ```

## Replacing Placeholder Paths with Local Server URLs

If you want to serve images from a local server instead of the public folder:

1. Place your images in a separate directory (e.g., `images` folder in project root)
2. Update the Vite configuration in `vite.config.js` to serve static files:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import { resolve } from 'path'

   export default defineConfig({
     plugins: [react()],
     server: {
       cors: true
     },
     build: {
       outDir: 'dist'
     }
   })
   ```

3. Access images using the local server URL:
   ```javascript
   // If serving images from an 'images' folder
   const imageUrl = 'http://localhost:5173/images/your-image.jpg';
   ```

## Project Structure

```
my-react-app/
├── public/                 # Static assets (images, icons, etc.)
├── src/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── ...                # Other source files
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json           # Project dependencies and scripts
└── README.md              # This file
```

## Dependencies

- React 18+
- Vite
- Leaflet (for map visualization)

## Troubleshooting

1. **Images not loading**: 
   - Ensure image files are placed in the `public` folder
   - Check that file paths in the code match actual file names
   - Verify images are in a supported format (JPG, PNG)

2. **Map markers not visible**:
   - Check browser console for JavaScript errors
   - Ensure internet connection for loading map tiles

## Exporting Markers

Click the "Export Markers as GeoJSON" button to download a GeoJSON file. This file can be used in GIS applications or mapping tools.
