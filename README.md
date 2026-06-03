# 3D Portfolio Website

## Running the Website

To run this website with the 3D model properly loaded, you need to serve the files through a local server due to CORS restrictions when loading 3D models.

### Method 1: Using the Python Server (Recommended)

1. Navigate to the project directory in your terminal
2. Run the server using Python:
   ```bash
   python3 server.py
   ```
3. Open your browser and go to `http://localhost:8000`

### Method 2: Using Python's Built-in Server (Alternative)

If you don't want to use the provided server script, you can use Python's built-in server:

For Python 3.x:
```bash
python3 -m http.server 8000
```

Then open your browser and go to `http://localhost:8000`

### Stopping the Server

To stop the server, press `Ctrl+C` in the terminal where it's running.

## About

This 3D portfolio website features an interactive 3D logo using Three.js and GLTFLoader.