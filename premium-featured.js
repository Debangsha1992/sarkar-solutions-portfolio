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
        this.initAudioVisualizer();
        this.initGaugeAnimations();
        this.initScrollAnimations();
    }

    // Three.js Background Scenes
    initThreeJSScenes() {
        this.initDroneScene();
        this.initPodcastScene();
    }

    initDroneScene() {
        const container = document.getElementById('drone-threejs-scene');
        if (!container) return;

        // Scene setup
        this.droneScene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create geometric particles
        const geometry = new THREE.BufferGeometry();
        const particles = 2000;
        const positions = new Float32Array(particles * 3);
        
        for (let i = 0; i < particles * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 2,
            transparent: true,
            opacity: 0.6
        });
        
        const points = new THREE.Points(geometry, material);
        this.droneScene.add(points);

        // Add rotating wireframe cubes
        const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        for (let i = 0; i < 5; i++) {
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            this.droneScene.add(cube);
        }

        camera.position.z = 50;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            points.rotation.x += 0.001;
            points.rotation.y += 0.002;
            
            this.droneScene.children.forEach((child, index) => {
                if (child instanceof THREE.Mesh) {
                    child.rotation.x += 0.01;
                    child.rotation.y += 0.01;
                    child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
                }
            });
            
            renderer.render(this.droneScene, camera);
        };
        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
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
    new PremiumFeaturedManager();
}); 