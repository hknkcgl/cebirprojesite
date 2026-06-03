# GitHub Pages Deployment Guide

## Deploying Your 3D Portfolio Website

This website features an interactive 3D logo that works on GitHub Pages without CORS issues thanks to the embedded model approach.

### How It Works

1. The 3D model (`your-logo-file.glb`) is embedded as a data URI in `js/logo-model-datauri.js`
2. The `logo-3d.js` script loads the model using this embedded data URI instead of making an external file request
3. This eliminates CORS issues when loading the 3D model

### Deployment Steps

1. Make sure all your files are in your GitHub repository
2. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Select source (usually your main branch)
   - GitHub Pages will automatically serve your site

### Updating Your 3D Model

If you want to update your 3D model:

1. Replace `images/your-logo-file.glb` with your new model
2. Run the conversion script:
   ```bash
   node js/convert-model.js
   ```
3. Commit the updated `js/logo-model-datauri.js` file to your repository

### Notes

- The embedded model data URI is approximately 713 KB (as of the generated file)
- This approach works for models up to a few MB in size
- For larger models, consider using a CDN or different optimization techniques

### Troubleshooting

If the 3D model doesn't appear:

1. Check the browser console for errors
2. Verify that `js/logo-model-datauri.js` contains a valid data URI
3. Make sure your GitHub Pages site is enabled and serving the correct branch

The site should work both locally and when deployed to GitHub Pages without requiring a special server setup.