// Premium Featured Sections JavaScript
class PremiumFeaturedManager {
    constructor() {
        this.droneScene = null;
        this.podcastScene = null;
        this.cubeRotation = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.initThreeJSScenes();
        this.initInteractiveCube();
        this.initVideoPlayer();
        this.init3DVideoWeb();
        this.initDroneVideoShowcase();
        this.initPodcastAudioVisualizer();
        this.initAudioVisualizer();
        this.initGaugeAnimations();
        this.initScrollAnimations();
    }

    // Three.js Background Scenes
    initThreeJSScenes() {
        // this.initDroneScene(); // Removed - container no longer exists
        this.initPodcastScene();
    }

    initDroneScene() {
        // const container = document.getElementById('drone-threejs-scene');
        // if (!container) return;

        // Scene setup
        // this.droneScene = new THREE.Scene();
        // const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        // const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        // renderer.setSize(container.offsetWidth, container.offsetHeight);
        // renderer.setClearColor(0x000000, 0);
        // container.appendChild(renderer.domElement);

        // Create geometric particles
        // const geometry = new THREE.BufferGeometry();
        // const particles = 2000;
        // const positions = new Float32Array(particles * 3);
        
        // for (let i = 0; i < particles * 3; i += 3) {
        //     positions[i] = (Math.random() - 0.5) * 100;
        //     positions[i + 1] = (Math.random() - 0.5) * 100;
        //     positions[i + 2] = (Math.random() - 0.5) * 100;
        // }
        
        // geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // const material = new THREE.PointsMaterial({
        //     color: 0x6366f1,
        //     size: 2,
        //     transparent: true,
        //     opacity: 0.6
        // });
        
        // const points = new THREE.Points(geometry, material);
        // this.droneScene.add(points);

        // Add rotating wireframe cubes
        // const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        // const cubeMaterial = new THREE.MeshBasicMaterial({
        //     color: 0x06b6d4,
        //     wireframe: true,
        //     transparent: true,
        //     opacity: 0.3
        // });

        // for (let i = 0; i < 5; i++) {
        //     const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        //     cube.position.set(
        //         (Math.random() - 0.5) * 50,
        //         (Math.random() - 0.5) * 50,
        //         (Math.random() - 0.5) * 50
        //     );
        //     cube.rotation.set(
        //         Math.random() * Math.PI,
        //         Math.random() * Math.PI,
        //         Math.random() * Math.PI
        //     );
        //     this.droneScene.add(cube);
        // }

        // camera.position.z = 50;

        // Animation loop
        // const animate = () => {
        //     requestAnimationFrame(animate);
            
        //     points.rotation.x += 0.001;
        //     points.rotation.y += 0.002;
            
        //     this.droneScene.children.forEach((child, index) => {
        //         if (child instanceof THREE.Mesh) {
        //             child.rotation.x += 0.01;
        //             child.rotation.y += 0.01;
        //             child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        //         }
        //     });
            
        //     renderer.render(this.droneScene, camera);
        // };
        // animate();

        // Handle resize
        // window.addEventListener('resize', () => {
        //     camera.aspect = container.offsetWidth / container.offsetHeight;
        //     camera.updateProjectionMatrix();
        //     renderer.setSize(container.offsetWidth, container.offsetHeight);
        // });
    }

    initPodcastScene() {
        const container = document.getElementById('podcast-threejs-scene');
        if (!container) return;

        // Scene setup
        this.podcastScene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create audio wave visualization
        const waveGeometry = new THREE.RingGeometry(5, 25, 32);
        
        for (let i = 0; i < 8; i++) {
            const waveMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.8 + i * 0.02, 0.8, 0.5),
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            wave.position.z = i * -2;
            wave.scale.setScalar(1 + i * 0.2);
            this.podcastScene.add(wave);
        }

        // Add floating spheres
        for (let i = 0; i < 20; i++) {
            const sphereGeometry = new THREE.SphereGeometry(0.5, 8, 6);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.8, 0.7, 0.6),
                transparent: true,
                opacity: 0.4
            });
            
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60
            );
            this.podcastScene.add(sphere);
        }

        camera.position.z = 30;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            this.podcastScene.children.forEach((child, index) => {
                if (child.geometry instanceof THREE.RingGeometry) {
                    child.rotation.z += 0.005 * (index + 1);
                    child.scale.setScalar(1 + Math.sin(time + index) * 0.1);
                } else if (child.geometry instanceof THREE.SphereGeometry) {
                    child.position.y += Math.sin(time + index) * 0.02;
                    child.rotation.x += 0.01;
                    child.rotation.y += 0.01;
                }
            });
            
            renderer.render(this.podcastScene, camera);
        };
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }

    // Interactive 3D Cube
    initInteractiveCube() {
        const cube = document.getElementById('interactive-cube');
        if (!cube) return;

        let isDragging = false;
        let startX, startY;

        const handleMouseDown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            cube.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            this.cubeRotation.y += deltaX * 0.5;
            this.cubeRotation.x -= deltaY * 0.5;
            
            cube.style.transform = `rotateX(${this.cubeRotation.x}deg) rotateY(${this.cubeRotation.y}deg)`;
            
            startX = e.clientX;
            startY = e.clientY;
        };

        const handleMouseUp = () => {
            isDragging = false;
            cube.style.cursor = 'grab';
        };

        cube.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Control buttons
        const controls = document.querySelectorAll('.glass-btn');
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                
                switch (action) {
                    case 'rotate':
                        this.animateCubeRotation();
                        break;
                    case 'zoom':
                        this.animateCubeZoom();
                        break;
                    case 'reset':
                        this.resetCube();
                        break;
                }
            });
        });
    }

    animateCubeRotation() {
        const cube = document.getElementById('interactive-cube');
        if (!cube) return;

        this.cubeRotation.y += 720;
        cube.style.transition = 'transform 2s ease-in-out';
        cube.style.transform = `rotateX(${this.cubeRotation.x}deg) rotateY(${this.cubeRotation.y}deg)`;
        
        setTimeout(() => {
            cube.style.transition = '';
        }, 2000);
    }

    animateCubeZoom() {
        const cube = document.getElementById('interactive-cube');
        if (!cube) return;

        cube.style.transition = 'transform 1s ease-in-out';
        cube.style.transform = `rotateX(${this.cubeRotation.x}deg) rotateY(${this.cubeRotation.y}deg) scale(1.3)`;
        
        setTimeout(() => {
            cube.style.transform = `rotateX(${this.cubeRotation.x}deg) rotateY(${this.cubeRotation.y}deg) scale(1)`;
        }, 1000);
        
        setTimeout(() => {
            cube.style.transition = '';
        }, 2000);
    }

    resetCube() {
        const cube = document.getElementById('interactive-cube');
        if (!cube) return;

        this.cubeRotation = { x: 0, y: 0 };
        cube.style.transition = 'transform 1s ease-in-out';
        cube.style.transform = 'rotateX(0deg) rotateY(0deg)';
        
        setTimeout(() => {
            cube.style.transition = '';
        }, 1000);
    }

    // Video Player
    initVideoPlayer() {
        const videoPlayer = document.getElementById('drone-video-player');
        const videoTabs = document.querySelectorAll('.video-tab');
        const videoTitle = document.getElementById('video-title');
        const videoDescription = document.getElementById('video-description');

        if (!videoPlayer || !videoTabs.length) return;

        const videoData = {
            urban_scanning: {
                src: 'videos/urban_scanning.mp4',
                title: 'Urban Drone Survey',
                description: 'Advanced aerial photogrammetry capturing urban environments'
            },
            point_cloud_generation: {
                src: 'videos/point_cloud_generation.mp4',
                title: 'Point Cloud Generation',
                description: 'Dense 3D reconstruction from aerial imagery'
            },
            'nerf-demo2': {
                src: 'videos/nerf-demo2.mp4',
                title: 'Scanning Process Demo',
                description: 'End-to-end workflow demonstration'
            }
        };

        videoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const videoKey = tab.dataset.video;
                const data = videoData[videoKey];
                
                if (!data) return;

                // Update active tab
                videoTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update video source
                videoPlayer.src = data.src;
                videoTitle.textContent = data.title;
                videoDescription.textContent = data.description;

                // Add fade effect
                videoPlayer.style.opacity = '0';
                setTimeout(() => {
                    videoPlayer.style.opacity = '1';
                }, 150);
            });
        });
    }

    // 3D Video Web
    init3DVideoWeb() {
        const container = document.getElementById('video-3d-scene');
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Video data
        const videoData = [
            {
                src: 'videos/urban_scanning.mp4',
                title: 'Urban Drone Survey',
                position: { x: -4, y: 2, z: 0 },
                rotation: { x: 0, y: 0.2, z: 0 }
            },
            {
                src: 'videos/point_cloud_generation.mp4',
                title: 'Point Cloud Generation',
                position: { x: 4, y: 0, z: -2 },
                rotation: { x: 0, y: -0.2, z: 0 }
            },
            {
                src: 'videos/nerf-demo2.mp4',
                title: 'Scanning Process Demo',
                position: { x: 0, y: -2, z: 2 },
                rotation: { x: 0.1, y: 0, z: 0 }
            }
        ];

        // Create video textures and screens
        const videoScreens = [];
        const videos = [];
        const connections = [];

        videoData.forEach((data, index) => {
            // Create video element
            const video = document.createElement('video');
            video.src = data.src;
            video.loop = true;
            video.muted = true;
            video.crossOrigin = 'anonymous';
            video.playsInline = true;
            videos.push(video);

            // Create video texture
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBFormat;

            // Create screen geometry and material
            const screenGeometry = new THREE.PlaneGeometry(3, 2);
            const screenMaterial = new THREE.MeshBasicMaterial({ 
                map: videoTexture,
                transparent: true,
                opacity: 0.9
            });

            // Create screen mesh
            const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
            screenMesh.position.set(data.position.x, data.position.y, data.position.z);
            screenMesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            
            // Add glow effect
            const glowGeometry = new THREE.PlaneGeometry(3.2, 2.2);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x6366f1,
                transparent: true,
                opacity: 0.2
            });
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            glowMesh.position.copy(screenMesh.position);
            glowMesh.position.z -= 0.01;
            glowMesh.rotation.copy(screenMesh.rotation);

            scene.add(screenMesh);
            scene.add(glowMesh);
            videoScreens.push({ mesh: screenMesh, glow: glowMesh, video: video, data: data });
        });

        // Create thread connections between screens
        const createConnection = (pos1, pos2, color = 0x06b6d4) => {
            const points = [];
            const segments = 20;
            
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = pos1.x + (pos2.x - pos1.x) * t;
                const y = pos1.y + (pos2.y - pos1.y) * t + Math.sin(t * Math.PI) * 0.5;
                const z = pos1.z + (pos2.z - pos1.z) * t;
                points.push(new THREE.Vector3(x, y, z));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.6
            });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            return line;
        };

        // Create connections between all screens
        for (let i = 0; i < videoScreens.length; i++) {
            for (let j = i + 1; j < videoScreens.length; j++) {
                const connection = createConnection(
                    videoScreens[i].mesh.position,
                    videoScreens[j].mesh.position,
                    0x6366f1
                );
                connections.push(connection);
            }
        }

        // Add floating particles
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            particlePositions[i] = (Math.random() - 0.5) * 20;
            particlePositions[i + 1] = (Math.random() - 0.5) * 20;
            particlePositions[i + 2] = (Math.random() - 0.5) * 20;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x06b6d4,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Position camera
        camera.position.set(0, 0, 8);
        camera.lookAt(0, 0, 0);

        // Animation controls
        let isRotating = false;
        let rotationSpeed = 0.01;
        let zoomLevel = 1;
        let targetZoom = 1;
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            // Rotate screens if enabled
            if (isRotating) {
                videoScreens.forEach((screen, index) => {
                    screen.mesh.rotation.y += rotationSpeed * (index + 1);
                    screen.glow.rotation.y = screen.mesh.rotation.y;
                });
            }
            
            // Animate particles
            particles.rotation.y += 0.002;
            
            // Animate connections
            connections.forEach((connection, index) => {
                connection.material.opacity = 0.6 + Math.sin(time + index) * 0.2;
            });
            
            // Smooth zoom
            zoomLevel += (targetZoom - zoomLevel) * 0.1;
            camera.position.setLength(8 / zoomLevel);
            
            // Float effect for screens
            videoScreens.forEach((screen, index) => {
                screen.mesh.position.y = screen.data.position.y + Math.sin(time + index) * 0.1;
                screen.glow.position.copy(screen.mesh.position);
                screen.glow.position.z -= 0.01;
            });
            
            renderer.render(scene, camera);
        };
        animate();

        // Control handlers
        const controls = container.parentElement.querySelector('.video-3d-controls');
        if (controls) {
            controls.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]')?.dataset.action;
                
                switch (action) {
                    case 'rotate-web':
                        isRotating = !isRotating;
                        e.target.closest('button').classList.toggle('active', isRotating);
                        break;
                    case 'zoom-web':
                        targetZoom = targetZoom === 1 ? 1.5 : 1;
                        break;
                    case 'play-all':
                        videos.forEach(video => {
                            if (video.paused) {
                                video.play().catch(console.error);
                            } else {
                                video.pause();
                            }
                        });
                        break;
                    case 'reset-web':
                        isRotating = false;
                        targetZoom = 1;
                        videoScreens.forEach((screen, index) => {
                            screen.mesh.rotation.set(
                                screen.data.rotation.x,
                                screen.data.rotation.y,
                                screen.data.rotation.z
                            );
                            screen.glow.rotation.copy(screen.mesh.rotation);
                        });
                        controls.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                        break;
                }
            });
        }

        // Video info interaction
        const videoInfoItems = container.parentElement.querySelectorAll('.video-info-item');
        videoInfoItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Update active state
                videoInfoItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Focus on selected screen
                if (videoScreens[index]) {
                    const screen = videoScreens[index];
                    const targetPos = screen.mesh.position.clone();
                    targetPos.z += 3;
                    
                    // Animate camera to focus on screen
                    const startPos = camera.position.clone();
                    const duration = 1000;
                    const startTime = Date.now();
                    
                    const animateCamera = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        
                        camera.position.lerpVectors(startPos, targetPos, easeProgress);
                        camera.lookAt(screen.mesh.position);
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateCamera);
                        }
                    };
                    animateCamera();
                }
            });
        });

        // Mouse interaction
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        
        container.addEventListener('mousemove', (event) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(videoScreens.map(s => s.mesh));
            
            // Reset all screens
            videoScreens.forEach(screen => {
                screen.mesh.scale.set(1, 1, 1);
                screen.glow.material.opacity = 0.2;
            });
            
            // Highlight hovered screen
            if (intersects.length > 0) {
                const hoveredScreen = videoScreens.find(s => s.mesh === intersects[0].object);
                if (hoveredScreen) {
                    hoveredScreen.mesh.scale.set(1.1, 1.1, 1.1);
                    hoveredScreen.glow.material.opacity = 0.4;
                }
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });

        // Store references for cleanup
        this.video3DScene = { scene, camera, renderer, videos, videoScreens, connections };
    }

    // 3D Video Web Showcase for Drone Section
    initDroneVideoShowcase() {
        const container = document.getElementById('drone-3d-viewport');
        if (!container) {
            console.log('Drone 3D viewport container not found');
            return;
        }

        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded');
            return;
        }

        // Check if GLTFLoader is available
        if (!THREE.GLTFLoader) {
            console.error('GLTFLoader is not available. Some 3D features may not work.');
        }

        try {
            // Scene setup
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a1a);
            
            const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Set up canvas for interaction
            renderer.domElement.style.cursor = 'grab';
            renderer.domElement.style.touchAction = 'none';
            renderer.domElement.tabIndex = 0; // Make it focusable
            
            container.appendChild(renderer.domElement);

            console.log('✓ Three.js scene initialized successfully');
            console.log('✓ Canvas size:', renderer.domElement.width, 'x', renderer.domElement.height);
            console.log('✓ Canvas added to container:', container.className);

        // Video data configuration
        const videoData = [
            {
                src: 'videos/urban_scanning.mp4',
                title: 'Urban Drone Survey',
                position: { x: -4, y: 2, z: 0 },
                rotation: { x: 0, y: 0.2, z: 0 },
                id: 'urban_scanning'
            },
            {
                src: 'videos/point_cloud_generation.mp4',
                title: 'Point Cloud Generation',
                position: { x: 4, y: -1, z: -2 },
                rotation: { x: 0, y: -0.3, z: 0 },
                id: 'point_cloud_generation'
            },
            {
                src: 'videos/nerf-demo2.mp4',
                title: 'Scanning Process Demo',
                position: { x: 0, y: -3, z: 2 },
                rotation: { x: 0.1, y: 0, z: 0 },
                id: 'nerf_demo'
            }
        ];

        // Create video screens and store references
        const videoScreens = [];
        const videoElements = [];
        const connectionLines = [];

        videoData.forEach((data, index) => {
            // Create video element
            const video = document.createElement('video');
            video.src = data.src;
            video.crossOrigin = 'anonymous';
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.autoplay = false; // Don't autoplay initially
            video.style.display = 'none';
            document.body.appendChild(video);
            videoElements.push(video);
            
            // Start video playback with better error handling
            video.addEventListener('loadeddata', () => {
                console.log('Video loaded successfully:', data.src);
                // Start playing the first video only
                if (index === 0) {
                    video.play().catch(e => {
                        console.log('Video autoplay prevented:', e);
                    });
                }
            });
            
            video.addEventListener('loadedmetadata', () => {
                console.log('Video metadata loaded:', data.src);
            });
            
            video.addEventListener('canplaythrough', () => {
                console.log('Video can play through:', data.src);
            });
            
            video.addEventListener('error', (e) => {
                console.error('Video loading error:', data.src, e);
            });
            
            // Force video to start loading
            video.load();

            // Create video texture
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBFormat;
            videoTexture.flipY = true; // Fix upside down videos
            videoTexture.needsUpdate = true;

            // Create screen geometry and material
            const screenGeometry = new THREE.PlaneGeometry(3, 2);
            const screenMaterial = new THREE.MeshBasicMaterial({ 
                map: videoTexture,
                side: THREE.DoubleSide
            });
            
            // Create screen mesh
            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            screen.position.set(data.position.x, data.position.y, data.position.z);
            screen.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            screen.userData = { 
                videoElement: video, 
                videoData: data,
                index: index,
                videoTexture: videoTexture
            };

            // Add subtle glow effect
            const glowGeometry = new THREE.PlaneGeometry(3.2, 2.2);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x6366f1,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(screen.position);
            glow.rotation.copy(screen.rotation);
            glow.position.z -= 0.01;

            scene.add(glow);
            scene.add(screen);
            videoScreens.push(screen);

            // Create screen border
            const borderGeometry = new THREE.EdgesGeometry(screenGeometry);
            const borderMaterial = new THREE.LineBasicMaterial({ 
                color: 0x6366f1,
                linewidth: 2
            });
            const border = new THREE.LineSegments(borderGeometry, borderMaterial);
            border.position.copy(screen.position);
            border.rotation.copy(screen.rotation);
            scene.add(border);
        });

        // Create connection threads between screens
        for (let i = 0; i < videoScreens.length; i++) {
            for (let j = i + 1; j < videoScreens.length; j++) {
                const points = [
                    videoScreens[i].position.clone(),
                    videoScreens[j].position.clone()
                ];
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({ 
                    color: 0x06b6d4, 
                    transparent: true, 
                    opacity: 0.6,
                    linewidth: 1
                });
                
                const line = new THREE.Line(geometry, material);
                scene.add(line);
                connectionLines.push(line);
            }
        }

        // Add ambient lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // Removed floating particles to prevent visual clutter

        // Camera positioning
        camera.position.set(0, 0, 8);
        camera.lookAt(0, 0, 0);

        // Initialize OrbitControls - wait for DOM to be ready
        let controls;
        
        // Debug logging
        console.log('THREE.OrbitControls available:', typeof THREE.OrbitControls);
        console.log('Renderer DOM element:', renderer.domElement);
        
        // Create OrbitControls
        if (THREE.OrbitControls) {
            try {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                
                // Basic settings
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                controls.enableZoom = true;
                controls.enableRotate = true;
                controls.enablePan = false;
                
                // Auto rotation
                controls.autoRotate = true;
                controls.autoRotateSpeed = 1.0;
                
                // Distance limits
                controls.minDistance = 5;
                controls.maxDistance = 20;
                
                // Rotation limits
                controls.minPolarAngle = 0; // radians
                controls.maxPolarAngle = Math.PI; // radians
                
                // Mouse sensitivity
                controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                
                // Set target
                controls.target.set(0, 0, 0);
                controls.update();
                
                console.log('✓ OrbitControls initialized successfully');
                console.log('✓ Controls enabled rotation:', controls.enableRotate);
                console.log('✓ Controls enabled zoom:', controls.enableZoom);
                console.log('✓ Renderer domElement:', renderer.domElement.tagName);
                
                // Test controls immediately
                setTimeout(() => {
                    if (controls) {
                        console.log('✓ OrbitControls still active after 1 second');
                        console.log('✓ Auto rotate:', controls.autoRotate);
                        console.log('✓ Camera position:', camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2));
                    }
                }, 1000);
                
            } catch (error) {
                console.error('✗ Error creating OrbitControls:', error);
                controls = null;
            }
        } else {
            console.error('✗ THREE.OrbitControls not found!');
            console.log('Available THREE properties:', Object.keys(THREE));
        }

        // Raycaster for click interactions
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onMouseClick(event) {
            // Don't process clicks if user was dragging
            if (isDragging) {
                console.log('✗ Click ignored - user was dragging');
                return;
            }
            
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(videoScreens);

            if (intersects.length > 0) {
                // Prevent OrbitControls from interfering with video clicks
                event.stopPropagation();
                event.preventDefault();
                
                const clickedScreen = intersects[0].object;
                const video = clickedScreen.userData.videoElement;
                const videoData = clickedScreen.userData.videoData;
                
                console.log('✓ Video screen clicked:', videoData.title);
                
                // Stop all other videos
                videoElements.forEach(v => {
                    if (v !== video) {
                        v.pause();
                    }
                });
                
                // Toggle video play/pause
                if (video.paused) {
                    video.play().then(() => {
                        console.log('✓ Video playing:', videoData.title);
                        if (controls) controls.autoRotate = false; // Stop auto rotation when video plays
                    }).catch(e => {
                        console.error('✗ Error playing video:', e);
                    });
                } else {
                    video.pause();
                    console.log('✓ Video paused:', videoData.title);
                    if (controls) controls.autoRotate = true;
                }

                // Update info panel
                updateInfoPanel(videoData.id);
                
                // Enhanced click effect with animation
                const originalScale = { x: 1.05, y: 1.05, z: 1.05 }; // Start from hover scale
                clickedScreen.scale.set(1.15, 1.15, 1.15);
                
                // Animate back to hover scale
                setTimeout(() => {
                    clickedScreen.scale.set(originalScale.x, originalScale.y, originalScale.z);
                }, 150);
                
                // Visual feedback with emissive color
                clickedScreen.material.emissive.setHex(0x6666ff);
                setTimeout(() => {
                    clickedScreen.material.emissive.setHex(0x4444ff);
                }, 100);
            } else {
                console.log('✓ Click on empty space - controls should work');
            }
        }

        function updateInfoPanel(videoId) {
            const infoCards = document.querySelectorAll('.info-card');
            infoCards.forEach(card => {
                card.classList.remove('active');
                if (card.dataset.video === videoId) {
                    card.classList.add('active');
                }
            });
        }

        // Mouse interaction state
        let isMouseDown = false;
        let isDragging = false;
        let mouseDownTime = 0;
        
        // Add event listeners
        renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        renderer.domElement.addEventListener('mousemove', onMouseMove, false);
        renderer.domElement.addEventListener('mouseup', onMouseUp, false);
        renderer.domElement.addEventListener('click', onMouseClick, false);
        
        function onMouseDown(event) {
            isMouseDown = true;
            isDragging = false;
            mouseDownTime = Date.now();
            renderer.domElement.style.cursor = 'grabbing';
            
            console.log('✓ Mouse down detected');
        }
        
        function onMouseMove(event) {
            if (isMouseDown) {
                isDragging = true;
            }
            
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(videoScreens);

            // Reset all screens to default state
            videoScreens.forEach(screen => {
                screen.material.emissive.setHex(0x000000);
                // Reset scale if not the hovered screen
                if (intersects.length === 0 || intersects[0].object !== screen) {
                    screen.scale.set(1, 1, 1);
                }
            });

            if (intersects.length > 0) {
                const hoveredScreen = intersects[0].object;
                const videoData = hoveredScreen.userData.videoData;
                
                // Enhanced hover effects
                hoveredScreen.material.emissive.setHex(0x4444ff);
                hoveredScreen.scale.set(1.05, 1.05, 1.05);
                
                // Change cursor only if not dragging
                if (!isMouseDown) {
                    renderer.domElement.style.cursor = 'pointer';
                }
                
                // Stop auto rotation when hovering
                if (controls) {
                    controls.autoRotate = false;
                }
                
                // Update info panel
                updateInfoPanel(videoData.id);
            } else {
                if (!isMouseDown) {
                    renderer.domElement.style.cursor = 'grab';
                }
                
                // Resume auto rotation when not hovering
                if (controls) {
                    controls.autoRotate = true;
                }
            }
        }
        
        function onMouseUp(event) {
            isMouseDown = false;
            renderer.domElement.style.cursor = 'grab';
            
            console.log('✓ Mouse up detected, isDragging:', isDragging);
            
            // Small delay to prevent accidental clicks when dragging
            setTimeout(() => {
                isDragging = false;
            }, 100);
        }

        // Animation loop
        const clock = new THREE.Clock();
        let isAnimating = false;
        
        function animate() {
            if (isAnimating) return;
            isAnimating = true;
            
            requestAnimationFrame(() => {
                isAnimating = false;
                animate();
            });
            
            const elapsedTime = clock.getElapsedTime();
            
            // Removed particles animation
            
            // Update video textures
            videoScreens.forEach((screen) => {
                if (screen.userData.videoTexture && screen.userData.videoElement) {
                    const video = screen.userData.videoElement;
                    if (video.readyState >= video.HAVE_CURRENT_DATA) {
                        screen.userData.videoTexture.needsUpdate = true;
                    }
                }
            });
            
            // Animate connection lines opacity
            connectionLines.forEach((line, index) => {
                line.material.opacity = 0.3 + Math.sin(elapsedTime * 2 + index) * 0.3;
            });
            
            // Gentle floating animation for screens
            videoScreens.forEach((screen, index) => {
                const originalY = videoData[index].position.y;
                screen.position.y = originalY + Math.sin(elapsedTime * 1.5 + index * 2) * 0.1;
                screen.rotation.y = videoData[index].rotation.y + Math.sin(elapsedTime * 0.8 + index) * 0.02;
            });
            
            // Update controls
            if (controls) {
                controls.update();
            }
            
            renderer.render(scene, camera);
        }

        // Handle window resize
        function handleResize() {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        window.addEventListener('resize', handleResize, false);

        // Hide loading screen and start animation
        setTimeout(() => {
            const loadingEl = container.querySelector('.viewport-loading');
            if (loadingEl) {
                loadingEl.style.opacity = '0';
                setTimeout(() => loadingEl.style.display = 'none', 500);
            }
            animate();
        }, 1000);

        // Info card click handlers
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.dataset.video;
                const screen = videoScreens.find(s => s.userData.videoData.id === videoId);
                
                if (screen) {
                    const video = screen.userData.videoElement;
                    
                    // Focus camera on selected screen
                    const targetPosition = screen.position.clone();
                    targetPosition.z += 5;
                    
                    // Smooth camera transition
                    const startPosition = camera.position.clone();
                    const startTime = Date.now();
                    const duration = 1500;
                    
                    function animateCamera() {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        
                        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
                        camera.lookAt(screen.position);
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateCamera);
                        }
                    }
                    
                    animateCamera();
                    
                    // Play video
                    if (video.paused) {
                        video.play();
                    }
                    
                    updateInfoPanel(videoId);
                }
            });
        });

        // Store references for cleanup
        this.droneShowcase = {
            scene,
            camera,
            renderer,
            controls,
            videoElements,
            cleanup: () => {
                videoElements.forEach(video => {
                    video.pause();
                    video.remove();
                });
                renderer.dispose();
                window.removeEventListener('resize', handleResize);
            }
        };

        } catch (error) {
            console.error('Error initializing drone 3D showcase:', error);
            // Hide loading screen on error
            const loadingEl = container.querySelector('.viewport-loading');
            if (loadingEl) {
                loadingEl.innerHTML = '<div style="color: #ff4444;">Failed to load 3D experience</div>';
            }
        }
    }

    // Podcast Audio Visualizer Background
    initPodcastAudioVisualizer() {
        const container = document.getElementById('podcast-threejs-scene');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create audio wave visualization
        const waveGeometry = new THREE.RingGeometry(1, 8, 32);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0x9333ea,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        const waves = [];
        for (let i = 0; i < 5; i++) {
            const wave = new THREE.Mesh(waveGeometry, waveMaterial.clone());
            wave.position.z = i * -2;
            wave.material.opacity = 0.5 - i * 0.1;
            scene.add(wave);
            waves.push(wave);
        }

        // Add floating musical notes
        const noteCount = 50;
        const noteGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const noteMaterial = new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            transparent: true,
            opacity: 0.6
        });

        const notes = [];
        for (let i = 0; i < noteCount; i++) {
            const note = new THREE.Mesh(noteGeometry, noteMaterial);
            note.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );
            scene.add(note);
            notes.push(note);
        }

        camera.position.z = 15;

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            
            const elapsedTime = clock.getElapsedTime();
            
            // Animate waves
            waves.forEach((wave, index) => {
                wave.rotation.z = elapsedTime * 0.3 + index * 0.5;
                wave.scale.setScalar(1 + Math.sin(elapsedTime * 2 + index) * 0.1);
            });
            
            // Animate notes
            notes.forEach((note, index) => {
                note.position.y += Math.sin(elapsedTime * 2 + index) * 0.02;
                note.rotation.x = elapsedTime * 0.5 + index;
                note.rotation.y = elapsedTime * 0.3 + index;
            });
            
            renderer.render(scene, camera);
        }

        animate();

        this.podcastVisualizer = {
            scene,
            camera,
            renderer,
            cleanup: () => {
                renderer.dispose();
            }
        };
    }

    // Audio Visualizer
    initAudioVisualizer() {
        const canvas = document.getElementById('audio-canvas');
        const modeButtons = document.querySelectorAll('.viz-mode-btn');
        const controlButtons = document.querySelectorAll('.viz-control-btn');

        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let currentMode = 'waveform';
        let animationId;
        let isPlaying = false;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mode switching
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
            });
        });

        // Control buttons
        controlButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                
                switch (action) {
                    case 'play':
                        this.startAudioVisualization(ctx, currentMode);
                        isPlaying = true;
                        break;
                    case 'pause':
                        isPlaying = false;
                        break;
                    case 'stop':
                        this.stopAudioVisualization();
                        isPlaying = false;
                        break;
                }
            });
        });

        // Start with demo visualization
        this.startAudioVisualization(ctx, currentMode);
    }

    startAudioVisualization(ctx, mode) {
        const canvas = ctx.canvas;
        let time = 0;

        const animate = () => {
            time += 0.02;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            switch (mode) {
                case 'waveform':
                    this.drawWaveform(ctx, time);
                    break;
                case 'frequency':
                    this.drawFrequency(ctx, time);
                    break;
                case '3d':
                    this.draw3DSpectrum(ctx, time);
                    break;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    drawWaveform(ctx, time) {
        const canvas = ctx.canvas;
        const centerY = canvas.height / 2;
        const amplitude = 50;
        
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
            const frequency = 0.01;
            const y = centerY + Math.sin((x * frequency) + time) * amplitude * 
                      Math.sin(time * 2) * (1 + Math.sin(x * 0.01 + time * 3) * 0.5);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Add secondary waves
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
            const frequency = 0.02;
            const y = centerY + Math.sin((x * frequency) + time * 1.5) * amplitude * 0.7 * 
                      Math.cos(time * 1.5);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    drawFrequency(ctx, time) {
        const canvas = ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const rings = 5;
        
        for (let i = 0; i < rings; i++) {
            const radius = (i + 1) * 30 + Math.sin(time + i) * 10;
            const opacity = 1 - (i / rings);
            
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Add pulsing center
        const centerRadius = 10 + Math.sin(time * 3) * 5;
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    draw3DSpectrum(ctx, time) {
        const canvas = ctx.canvas;
        const bars = 64;
        const barWidth = canvas.width / bars;
        
        for (let i = 0; i < bars; i++) {
            const height = Math.abs(Math.sin(time + i * 0.1)) * canvas.height * 0.8;
            const x = i * barWidth;
            const hue = (i / bars) * 360 + time * 50;
            
            ctx.fillStyle = `hsl(${hue % 360}, 70%, 50%)`;
            ctx.fillRect(x, canvas.height - height, barWidth - 2, height);
            
            // Add 3D effect
            ctx.fillStyle = `hsl(${hue % 360}, 70%, 30%)`;
            ctx.fillRect(x + 2, canvas.height - height + 2, barWidth - 4, height - 2);
        }
    }

    stopAudioVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    // Gauge Animations
    initGaugeAnimations() {
        const gauges = document.querySelectorAll('.metric-gauge');
        
        const animateGauges = () => {
            gauges.forEach((gauge, index) => {
                const fill = gauge.querySelector('.gauge-fill');
                const percentage = parseInt(fill.dataset.percentage);
                
                setTimeout(() => {
                    fill.style.background = `conic-gradient(
                        from 0deg,
                        rgba(99, 102, 241, 0.8) 0%,
                        rgba(99, 102, 241, 0.8) ${percentage}%,
                        rgba(17, 24, 39, 0.95) ${percentage}%,
                        rgba(17, 24, 39, 0.95) 100%
                    )`;
                    fill.style.transition = 'background 2s ease-out';
                }, index * 300);
            });
        };

        // Trigger animation when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateGauges();
                    observer.unobserve(entry.target);
                }
            });
        });

        gauges.forEach(gauge => observer.observe(gauge));
    }

    // Scroll Animations
    initScrollAnimations() {
        const cards = document.querySelectorAll('.floating-glass-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all scripts are loaded
    setTimeout(() => {
        new PremiumFeaturedManager();
    }, 500);
}); 