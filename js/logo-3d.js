
// 3D Logo with scroll-based random rotation
class Logo3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.pivot = null;
        this.baseRotation = { x: Math.PI / 2, y: 0, z: 0 };
        this.baseScale = 6; // Base size multiplier (doubled from 3 to 6 for 2x size)
        this.container = null;
        this.canvas = null;
        this.scrollY = 0;
        this.rotationSpeed = { x: 0, y: 0, z: 0 };
        this.targetRotation = { x: 0, y: 0, z: 0 };
        this.currentRotation = { x: 0, y: 0, z: 0 };
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // Get container and canvas
        this.container = document.getElementById('logo-3d-container');
        this.canvas = document.getElementById('logo-3d-canvas');
        
        if (!this.canvas) {
            console.error('3D canvas not found');
            return;
        }

        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        // Keep the scene background transparent so floating background elements are visible behind the model
        // this.scene.background = new THREE.Color(0xffffff);
        this.scene.fog = new THREE.Fog(0xffffff, 10, 20);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-1, -1, -1);
        this.scene.add(backLight);

        // Create pivot group and add to scene
        this.pivot = new THREE.Group();
        this.scene.add(this.pivot);

        // Load the 3D model (using the embedded GLB data)
        this.loadModel(logoModelDataUri);

        // Set up event listeners
        this.setupEventListeners();

        // Start animation loop
        this.animate();

        // Mark as initialized
        this.isInitialized = true;
    }

    createPlaceholderModel() {
        // Create a placeholder geometry (you can replace this with a GLB loader)
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff7f00, // Orange color matching your theme
            metalness: 0.7,
            roughness: 0.3
        });
        
        this.model = new THREE.Mesh(geometry, material);
        this.pivot.add(this.model);
    }

    loadModel(modelPath) {
        // If you want to load a GLB file, use this function instead
        // Check if GLTFLoader is available
        if (!THREE.GLTFLoader) {
            console.error('THREE.GLTFLoader is not available. Please ensure GLTFLoader.js is properly loaded.');
            // Fallback to placeholder model
            this.createPlaceholderModel();
            return;
        }
        
        const loader = new THREE.GLTFLoader();
        
        // Check if the modelPath is a data URI (starts with "data:")
        if (modelPath.startsWith('data:')) {
            // For data URIs, we can't use the standard loader.load method
            // We need to fetch the data and parse it
            fetch(modelPath)
                .then(response => response.arrayBuffer())
                .then(data => {
                    loader.parse(data, '', (gltf) => {
                        console.log('3D model loaded successfully from data URI');
                        // Remove placeholder model if exists
                        if (this.model) {
                            this.pivot.remove(this.model);
                        }
                        
                        // Add loaded model to pivot
                        this.model = gltf.scene;
                        
                        // Apply static base rotation to stand it upright on X-Y plane
                        this.model.rotation.x = this.baseRotation.x;
                        this.model.rotation.y = this.baseRotation.y;
                        this.model.rotation.z = this.baseRotation.z;
                        
                        this.pivot.add(this.model);
                        
                        // Center the model relative to pivot
                        const box = new THREE.Box3().setFromObject(this.model);
                        const center = box.getCenter(new THREE.Vector3());
                        this.model.position.sub(center);
                        
                        // Scale the model to fit in view
                        const size = box.getSize(new THREE.Vector3()).length();
                        const scale = this.baseScale / size;
                        this.model.scale.setScalar(scale);
                    }, (error) => {
                        console.error('Error parsing 3D model:', error);
                        console.warn('Falling back to placeholder model');
                        this.createPlaceholderModel();
                    });
                })
                .catch(error => {
                    console.error('Error fetching 3D model:', error);
                    console.warn('Falling back to placeholder model');
                    this.createPlaceholderModel();
                });
        } else {
            // Original method for loading from a file path
            loader.load(
                modelPath,
                (gltf) => {
                    console.log('3D model loaded successfully:', modelPath);
                    // Remove placeholder model if exists
                    if (this.model) {
                        this.pivot.remove(this.model);
                    }
                    
                    // Add loaded model to pivot
                    this.model = gltf.scene;
                    
                    // Apply static base rotation to stand it upright on X-Y plane
                    this.model.rotation.x = this.baseRotation.x;
                    this.model.rotation.y = this.baseRotation.y;
                    this.model.rotation.z = this.baseRotation.z;
                    
                    this.pivot.add(this.model);
                    
                    // Center the model relative to pivot
                    const box = new THREE.Box3().setFromObject(this.model);
                    const center = box.getCenter(new THREE.Vector3());
                    this.model.position.sub(center);
                    
                    // Scale the model to fit in view
                    const size = box.getSize(new THREE.Vector3()).length();
                    const scale = this.baseScale / size;
                    this.model.scale.setScalar(scale);
                },
                (progress) => {
                    // Progress callback (optional)
                    console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error('Error loading 3D model:', error);
                    console.warn('Falling back to placeholder model');
                    // Fallback to placeholder model
                    this.createPlaceholderModel();
                }
            );
        }
    }

    setupEventListeners() {
        // Listen for scroll events to change rotation
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Initialize scroll position
        this.handleScroll();
    }

    handleScroll() {
        // Get current scroll position
        this.scrollY = window.scrollY;
        
        // Generate new target rotation based on scroll position
        // Use different coefficients for each axis to create more interesting movement
        this.targetRotation.x = Math.sin(this.scrollY * 0.01) * 0.5;
        this.targetRotation.y = Math.cos(this.scrollY * 0.007) * 0.8;
        this.targetRotation.z = Math.sin(this.scrollY * 0.005) * 0.3;
    }

    onWindowResize() {
        if (!this.canvas) return;
        
        // Update camera aspect ratio
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        if (this.model && this.pivot) {
            // Smoothly interpolate rotation towards target
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
            this.currentRotation.z += (this.targetRotation.z - this.currentRotation.z) * 0.05;
            
            // Apply rotation to pivot
            this.pivot.rotation.x = this.currentRotation.x;
            this.pivot.rotation.y = this.currentRotation.y;
            this.pivot.rotation.z = this.currentRotation.z;
        }
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the 3D logo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const logo3d = new Logo3D();
    
    // Use the embedded model
    logo3d.loadModel(logoModelDataUri); // Load embedded model
});