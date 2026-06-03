# Error Fixes & Bug Resolutions

## 3D Model Orientation Alignment (X-Y Plane Fix)
- **Bug**: The 3D model representing the logo on the left side of the screen was lying flat on the X-Z plane (as exported from Blender) instead of standing upright on the X-Y plane. The user saw the bottom of the logo instead of its front face.
- **Cause**: Blender uses Z as the "up" axis and Y as the "depth" axis, whereas Three.js uses Y as the "up" axis and Z as the "depth" axis. Additionally, the scroll-based animation in `js/logo-3d.js` directly manipulated `this.model.rotation.x`, `y`, and `z` in the `animate` loop, which overwrote any static base rotation applied to the model upon load.
- **Solution**: 
  1. Introduced a container `THREE.Group` called `this.pivot` to wrap the loaded model.
  2. Applied a static base rotation of `Math.PI / 2` (+90 degrees) around the X-axis to `this.model` to map the model's Blender Z-axis (height/length) to Three.js Y-axis (vertical) and Blender Y-axis (thickness) to Three.js Z-axis (depth).
  3. Configured the centering bounds calculation to occur after applying the base rotation, keeping the model perfectly centered inside `this.pivot`.
  4. Modified the `animate()` function to apply the scroll-based interpolation rotations to `this.pivot` instead of `this.model`. This preserves the static base orientation of the model while allowing interactive scroll rotation to function correctly.

## 3D Model Scaling Adjustment (2x Size)
- **Adjustment**: The 3D model scale has been doubled to enhance visibility and detail.
- **Solution**: Replaced the hardcoded scaling factor `3` with a configurable `this.baseScale = 6` property in the [Logo3D](file:///Users/hakankocaoglu/Documents/Yaz%C4%B1l%C4%B1m/cebirwebsite/js/logo-3d.js#L3) constructor and applied it during model loading in [logo-3d.js](file:///Users/hakankocaoglu/Documents/Yaz%C4%B1l%C4%B1m/cebirwebsite/js/logo-3d.js).

## 3D Canvas Transparency & Background Layering Fix
- **Bug**: Background elements (floating logos and code snippets) were disappearing or getting clipped abruptly behind an invisible block when passing behind the 3D model.
- **Cause**: The Three.js scene background color was set to opaque white (`this.scene.background = new THREE.Color(0xffffff)`), which overrode the WebGLRenderer's `alpha: true` (transparent background) configuration, rendering a solid 250x250px white box over the website's background.
- **Solution**: Commented out the `this.scene.background` configuration in [logo-3d.js](file:///Users/hakankocaoglu/Documents/Yaz%C4%B1l%C4%B1m/cebirwebsite/js/logo-3d.js) to allow the canvas to render with full transparency. This enables background elements (with CSS `z-index: 1`) to naturally pass behind the 3D model container (with CSS `z-index: 999`) and remain visible.

