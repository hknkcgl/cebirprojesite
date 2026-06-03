// Static model loader for GitHub Pages deployment
// This file is used when deployed to avoid CORS issues

class StaticModelLoader {
    constructor() {
        // Try using the embedded model first
        this.useEmbeddedModel = typeof logoModelDataUri !== 'undefined';
        this.loader = new THREE.GLTFLoader();
    }

    loadModel(onSuccess, onError) {
        if (this.useEmbeddedModel && typeof logoModelDataUri !== 'undefined') {
            // Load using the embedded data URI
            fetch(logoModelDataUri)
                .then(response => response.arrayBuffer())
                .then(data => {
                    this.loader.parse(data, '', onSuccess, onError);
                })
                .catch(error => {
                    console.error('Error fetching embedded model:', error);
                    // Fallback to file loading
                    this.loadModelFromFile(onSuccess, onError);
                });
        } else {
            // Fallback to loading from file
            this.loadModelFromFile(onSuccess, onError);
        }
    }

    loadModelFromFile(onSuccess, onError) {
        this.loader.load(
            'images/your-logo-file.glb',
            onSuccess,
            undefined, // Progress callback
            (error) => {
                console.error('Error loading model from file:', error);
                onError(error);
            }
        );
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StaticModelLoader;
}