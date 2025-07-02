# Debangsha Sarkar - AI & Machine Learning Portfolio

A cutting-edge portfolio website showcasing expertise in AI, Machine Learning, and 3D reconstruction technologies. Built with advanced Three.js effects and featuring an immersive space theme with comprehensive image and video galleries.

## ✨ Enhanced Features

### 🌌 **Immersive Space Theme**
- **Multi-layered Star Field**: 2000+ animated stars with realistic distribution
- **Nebula Clouds**: Dynamic, color-shifting nebula effects with floating motion
- **Galaxy Spiral**: Animated spiral galaxy with depth-based brightness
- **Cosmic Dust**: Subtle particle effects creating atmospheric depth
- **Dynamic Lighting**: Multiple colored point lights creating space ambiance
- **Mouse-responsive Gradients**: Background colors shift based on cursor movement

### 👤 **3D Headscan Hero Section**
- **Interactive 3D Model**: Real-time rendered headscan with professional lighting
- **Mouse Controls**: Hover and move mouse to rotate the model interactively
- **Auto-rotation**: Smooth automatic rotation when not interacting
- **Professional Lighting**: Multi-light setup with key, fill, and rim lighting
- **Floating Animation**: Subtle breathing-like motion for lifelike appearance
- **Responsive Design**: Adapts to different screen sizes with mobile optimization
- **Loading States**: Professional loading spinner with progress indication

### 📸 **Professional Media Galleries**
- **Image Galleries**: Click-to-expand full-screen image viewing
- **Video Players**: Enhanced video controls with custom overlays
- **Responsive Design**: Adaptive layouts for all screen sizes
- **Modal Viewing**: Full-screen image modal with keyboard navigation
- **Hover Effects**: Smooth animations and scaling effects
- **Error Handling**: Graceful fallbacks for missing media files

### 🎮 **Interactive Elements**
- **3D Card Tilt Effects**: Advanced mouse tracking with perspective transforms
- **Cosmic Explosion**: Multi-layered particle explosions on interaction
- **Glitch Text Effects**: Hover-triggered glitch animations on titles
- **Floating Cursor**: Smooth-following gradient cursor with glow effects
- **Parallax Scrolling**: Multi-speed parallax for depth perception
- **Staggered Animations**: Sequential reveal animations for content sections

## 📁 **Adding Your Images and Videos**

### **Directory Structure**
```
website/
├── images/           ← Place ALL your images here
│   ├── drone-scanning-1.jpg
│   ├── drone-scanning-2.jpg
│   ├── drone-video-poster.jpg
│   ├── nerf-1.jpg
│   ├── nerf-2.jpg
│   ├── nerf-video-poster.jpg
│   ├── research-1.jpg
│   ├── research-2.jpg
│   ├── research-3.jpg
│   ├── podcast-1.jpg
│   ├── speaking-1.jpg
│   └── podcast-video-poster.jpg
├── videos/           ← Place ALL your videos here
│   ├── drone-scanning-demo.mp4
│   ├── nerf-demo.mp4
│   └── podcast-highlights.mp4
├── index.html
├── style.css
├── script.js
└── README.md
```

### **🖼️ Image Guidelines**

#### **Recommended Image Specifications:**
- **Resolution**: 1920x1080 (Full HD) or higher
- **Format**: JPG (for photos), PNG (for graphics with transparency)
- **File Size**: Under 2MB each for optimal loading
- **Aspect Ratio**: 16:9 for video posters, flexible for project images

#### **Current Image Placeholders to Replace:**

**Drone Scanning Project:**
- `images/drone-scanning-1.jpg` - Aerial view of city/urban area
- `images/drone-scanning-2.jpg` - Point cloud visualization or 3D reconstruction
- `images/drone-video-poster.jpg` - Video thumbnail for drone footage

**NeRF Project:**
- `images/nerf-1.jpg` - NeRF scene reconstruction example
- `images/nerf-2.jpg` - Virtual production setup or Unreal Engine screenshot
- `images/nerf-video-poster.jpg` - Video thumbnail for NeRF demo

**Research Project:**
- `images/research-1.jpg` - Algorithm performance graphs/charts
- `images/research-2.jpg` - Conference presentation photo
- `images/research-3.jpg` - Data visualization or research results

**Podcast Project:**
- `images/podcast-1.jpg` - Podcast recording setup
- `images/speaking-1.jpg` - Conference or presentation photo
- `images/podcast-video-poster.jpg` - Video thumbnail for podcast highlights

### **🎬 Video Guidelines**

#### **Recommended Video Specifications:**
- **Resolution**: 1920x1080 (1080p) minimum
- **Format**: MP4 (H.264 codec for best browser compatibility)
- **Duration**: 30 seconds to 3 minutes (optimal for web viewing)
- **File Size**: Under 50MB each for smooth streaming
- **Frame Rate**: 30fps or 60fps

#### **Current Video Placeholders to Replace:**

**Drone Scanning Demo:**
- `videos/drone-scanning-demo.mp4` - Time-lapse or highlight reel of drone scanning process

**NeRF Demo:**
- `videos/nerf-demo.mp4` - Real-time NeRF rendering or virtual production demo

**Podcast Highlights:**
- `videos/podcast-highlights.mp4` - Best moments compilation from your podcast

### **🗿 3D Headscan Model**

#### **Current Model File:**
- `asset/debangsha_head.glb` - Your personal 3D headscan model

#### **3D Model Specifications:**
- **Format**: GLTF/GLB (recommended for web optimization)
- **File Size**: Under 10MB for optimal loading
- **Polygon Count**: 10k-50k triangles (balanced quality/performance)
- **Textures**: 1024x1024 or 2048x2048 resolution
- **Optimization**: Use tools like Blender or online GLTF optimizers

#### **How to Replace Your Headscan:**
1. **Export your 3D model** as GLTF (.gltf) or GLB (.glb) format
2. **Optimize the model** using tools like:
   - [GLTF-Transform](https://gltf-transform.donmccurdy.com/)
   - [Blender GLTF Export](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
   - [Three.js Editor](https://threejs.org/editor/)
3. **Replace the file**: Copy your new model to `asset/debangsha_head.glb`
4. **Test locally**: Make sure the model loads and displays correctly

**💡 Pro Tip**: If you don't have a 3D headscan, you can use any 3D model (avatar, character, or object) that represents you!

### **📝 How to Add New Media**

#### **Step 1: Prepare Your Files**
1. **Optimize Images**: Use tools like TinyPNG or ImageOptim to reduce file sizes
2. **Compress Videos**: Use HandBrake or similar tools to optimize for web
3. **Name Files**: Use descriptive, lowercase names with hyphens (e.g., `city-scan-result.jpg`)

#### **Step 2: Place Files in Correct Directories**
- **Images**: Copy all image files to the `images/` folder
- **Videos**: Copy all video files to the `videos/` folder
- **Posters**: For each video, create a poster image (video thumbnail) in the `images/` folder

#### **Step 3: Update HTML (if adding new projects)**
If you want to add more projects beyond the current 4, edit the `index.html` file in the Projects section.

## 🚀 **Quick Start Guide**

### **For Complete Beginners:**

1. **Download the Files**: Get all the website files to your computer
2. **Create Media Folders**: The `images/` and `videos/` folders should already exist
3. **Add Your Content**: 
   - Drag your images into the `images/` folder
   - Drag your videos into the `videos/` folder
   - Use the exact filenames listed above
4. **Test Locally**: 
   - Open `index.html` in your browser, or
   - Run `python -m http.server 8001` in the folder and visit `http://localhost:8001`
5. **Deploy**: Upload all files to your hosting platform (Vercel, Netlify, GitHub Pages, etc.)

## 🎯 **Content Strategy for Your Media**

### **🏗️ Drone Scanning Content Ideas:**
- **Before/After**: Raw drone footage vs. processed 3D models
- **Process Documentation**: Step-by-step reconstruction workflow
- **Scale Demonstrations**: Massive city scans with detail zooms
- **Accuracy Showcases**: Side-by-side comparisons with ground truth

### **🎬 NeRF/Virtual Production:**
- **Real-time Rendering**: Live NeRF generation and manipulation
- **Production Setup**: Behind-the-scenes of virtual production workflows
- **Quality Comparisons**: Traditional vs. NeRF-based approaches
- **Interactive Demos**: User-controlled NeRF navigation

### **📊 Research Documentation:**
- **Algorithm Visualizations**: Animated explanations of your active learning approach
- **Performance Graphs**: Clear charts showing improvement over traditional methods
- **Conference Moments**: Professional photos from presentations
- **Collaboration**: Team photos and research environment shots

## 🌟 **Best Practices**

### **📐 Image Composition:**
- **Rule of Thirds**: Position key elements along grid lines
- **High Contrast**: Ensure clear visibility against dark backgrounds
- **Professional Quality**: Use good lighting and sharp focus
- **Consistent Style**: Maintain visual consistency across your portfolio

### **🎥 Video Production:**
- **Stable Footage**: Use tripods or stabilizers for smooth video
- **Clear Audio**: Ensure good sound quality for demos and explanations
- **Engaging Intros**: Hook viewers in the first 5 seconds
- **Call to Action**: End with clear next steps for viewers

### **⚡ Performance Optimization:**
- **Image Compression**: Balance quality with file size
- **Video Streaming**: Consider progressive download for larger files
- **Lazy Loading**: Load media only when visible
- **Responsive Images**: Serve appropriate sizes for different devices

## 🎬 Cinematic Video Showcase

The portfolio features a stunning full-screen video showcase with cinematic effects:

### Video Features
- **Auto-playing background video** with professional overlay content
- **Video Card Animation**: The video is contained in a rounded rectangular card that moves in a mesmerizing spiral pattern (inspired by Khaby Lame's portfolio)
- **Interactive Controls**: Play/pause button with visual state indicators
- **Real-time Progress Bar**: Shows video playback progress
- **Keyboard Controls**: 
  - Spacebar: Play/pause
  - Arrow keys: Seek forward/backward 10 seconds
  - **'S' key**: Cycle through spiral animation modes
- **Touch-friendly** controls for mobile devices

### Spiral Animation Modes
The video card includes three spiral animation modes:
1. **Default Mode**: Smooth 15-second spiral movement with subtle scaling and rotation
2. **Dramatic Mode**: Enhanced 20-second orbital motion with brightness effects
3. **Gentle Mode**: Subtle 25-second floating motion for minimal distraction

**Pro Tip**: Double-click the video card or press 'S' to cycle through different spiral modes!

---

**🎨 Your portfolio is now ready to showcase your incredible AI and 3D reconstruction work through compelling visuals!**

Simply add your images and videos to the respective folders, and your portfolio will automatically display them with professional styling, smooth animations, and interactive features. The space theme perfectly complements your cutting-edge work in AI and computer vision, creating an engaging experience that will impress potential clients, collaborators, and employers.

**Need help?** The website gracefully handles missing images (they won't show broken links), so you can start with just a few key images and add more over time as you build your visual portfolio. 