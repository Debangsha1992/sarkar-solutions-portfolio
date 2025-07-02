// Three.js Scene Setup
let scene, camera, renderer, particles, particleSystem;
let nebulaClouds = [];
let starField, galaxySpiral, cosmicDust;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Enhanced space effects
let shaderMaterial, uniforms;
let clock = new THREE.Clock();

// Enhanced Three.js initialization with space effects
function initThree() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0008);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create enhanced space effects
    createStarField();
    createNebulaCloud();
    createGalaxySpiral();
    createCosmicDust();
    createParticles();
    
    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x4040ff, 0.3);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x6366f1, 1, 1000);
    pointLight1.position.set(300, 200, 300);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.8, 800);
    pointLight2.position.set(-300, -200, 200);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x06b6d4, 0.6, 600);
    pointLight3.position.set(200, -300, -200);
    scene.add(pointLight3);
    
    // Animation loop
    animate();
}

function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Positions in a large sphere
        const radius = Math.random() * 800 + 200;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Star colors (blue to white spectrum)
        const colorChoice = Math.random();
        if (colorChoice < 0.6) {
            // Blue-white stars
            colors[i3] = 0.8 + Math.random() * 0.2;
            colors[i3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i3 + 2] = 1.0;
        } else if (colorChoice < 0.8) {
            // Purple stars
            colors[i3] = 0.6 + Math.random() * 0.4;
            colors[i3 + 1] = 0.3 + Math.random() * 0.3;
            colors[i3 + 2] = 1.0;
        } else {
            // Cyan stars
            colors[i3] = 0.0;
            colors[i3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i3 + 2] = 1.0;
        }
        
        sizes[i] = Math.random() * 3 + 1;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

function createNebulaCloud() {
    // Create multiple nebula clouds
    for (let n = 0; n < 3; n++) {
        const cloudGeometry = new THREE.BufferGeometry();
        const cloudCount = 500;
        const positions = new Float32Array(cloudCount * 3);
        const colors = new Float32Array(cloudCount * 3);
        const sizes = new Float32Array(cloudCount);
        
        // Cloud center
        const centerX = (Math.random() - 0.5) * 600;
        const centerY = (Math.random() - 0.5) * 400;
        const centerZ = (Math.random() - 0.5) * 400;
        
        for (let i = 0; i < cloudCount; i++) {
            const i3 = i * 3;
            
            // Gaussian distribution for cloud-like appearance
            const spread = 100;
            positions[i3] = centerX + (Math.random() - 0.5) * spread;
            positions[i3 + 1] = centerY + (Math.random() - 0.5) * spread;
            positions[i3 + 2] = centerZ + (Math.random() - 0.5) * spread;
            
            // Nebula colors (purple/blue/cyan)
            const nebulaColors = [
                [0.4, 0.1, 0.8], // Purple
                [0.1, 0.3, 0.9], // Blue
                [0.0, 0.6, 0.8]  // Cyan
            ];
            
            const colorChoice = nebulaColors[n % nebulaColors.length];
            colors[i3] = colorChoice[0] + Math.random() * 0.2;
            colors[i3 + 1] = colorChoice[1] + Math.random() * 0.2;
            colors[i3 + 2] = colorChoice[2] + Math.random() * 0.2;
            
            sizes[i] = Math.random() * 8 + 2;
        }
        
        cloudGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        cloudGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        cloudGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const cloudMaterial = new THREE.PointsMaterial({
            size: 5,
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const nebula = new THREE.Points(cloudGeometry, cloudMaterial);
        nebulaClouds.push(nebula);
        scene.add(nebula);
    }
}

function createGalaxySpiral() {
    const spiralGeometry = new THREE.BufferGeometry();
    const spiralCount = 1500;
    const positions = new Float32Array(spiralCount * 3);
    const colors = new Float32Array(spiralCount * 3);
    
    for (let i = 0; i < spiralCount; i++) {
        const i3 = i * 3;
        
        // Spiral parameters
        const t = (i / spiralCount) * Math.PI * 4;
        const radius = (i / spiralCount) * 300 + 50;
        const height = Math.sin(t * 0.5) * 20;
        
        positions[i3] = Math.cos(t) * radius;
        positions[i3 + 1] = height;
        positions[i3 + 2] = Math.sin(t) * radius;
        
        // Galaxy colors (center bright, edges dim)
        const distanceFromCenter = radius / 350;
        const brightness = 1 - distanceFromCenter * 0.7;
        
        colors[i3] = 0.3 + brightness * 0.4;     // R
        colors[i3 + 1] = 0.5 + brightness * 0.3; // G
        colors[i3 + 2] = 0.9 + brightness * 0.1; // B
    }
    
    spiralGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    spiralGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const spiralMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    galaxySpiral = new THREE.Points(spiralGeometry, spiralMaterial);
    galaxySpiral.position.set(200, 100, -300);
    scene.add(galaxySpiral);
}

function createCosmicDust() {
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 3000;
    const positions = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);
    
    for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        
        positions[i3] = (Math.random() - 0.5) * 1500;
        positions[i3 + 1] = (Math.random() - 0.5) * 1500;
        positions[i3 + 2] = (Math.random() - 0.5) * 1500;
        
        // Cosmic dust colors (very subtle)
        colors[i3] = 0.1 + Math.random() * 0.1;
        colors[i3 + 1] = 0.1 + Math.random() * 0.2;
        colors[i3 + 2] = 0.2 + Math.random() * 0.2;
    }
    
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const dustMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    cosmicDust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(cosmicDust);
}

function createParticles() {
    const particleCount = 800;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];
    
    const colorPalette = [
        new THREE.Color(0x6366f1), // Primary
        new THREE.Color(0x8b5cf6), // Secondary
        new THREE.Color(0x06b6d4), // Accent
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Positions
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 1000;
        
        // Velocities for floating motion
        velocities.push({
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: (Math.random() - 0.5) * 0.3
        });
        
        // Colors
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.userData = { velocities };
    scene.add(particleSystem);
}

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Animate particle system with floating motion
    if (particleSystem && particleSystem.userData.velocities) {
        const positions = particleSystem.geometry.attributes.position.array;
        const velocities = particleSystem.userData.velocities;
        
        for (let i = 0; i < velocities.length; i++) {
            const i3 = i * 3;
            
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;
            positions[i3 + 2] += velocities[i].z;
            
            // Boundary checks
            if (Math.abs(positions[i3]) > 1000) velocities[i].x *= -1;
            if (Math.abs(positions[i3 + 1]) > 1000) velocities[i].y *= -1;
            if (Math.abs(positions[i3 + 2]) > 500) velocities[i].z *= -1;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.rotation.y += 0.0005;
    }
    
    // Animate star field
    if (starField) {
        starField.rotation.y += 0.0002;
        starField.rotation.x += 0.0001;
    }
    
    // Animate nebula clouds
    nebulaClouds.forEach((nebula, index) => {
        nebula.rotation.y += 0.001 * (index + 1);
        nebula.rotation.z += 0.0005 * (index + 1);
        
        // Subtle floating motion
        nebula.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.1;
    });
    
    // Animate galaxy spiral
    if (galaxySpiral) {
        galaxySpiral.rotation.y += 0.002;
        galaxySpiral.rotation.x += 0.001;
    }
    
    // Animate cosmic dust
    if (cosmicDust) {
        cosmicDust.rotation.y -= 0.0003;
        cosmicDust.rotation.x += 0.0002;
    }
    
    // Mouse interaction with more subtle movement
    const targetX = mouseX * 0.0005;
    const targetY = mouseY * 0.0005;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
}

// Mouse movement
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

// Enhanced Loading Screen
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progress = document.getElementById('progress');
        this.currentProgress = 0;
        this.targetProgress = 0;
        
        this.init();
    }
    
    init() {
        // Simulate loading progress
        this.simulateLoading();
        
        // Hide loading screen when complete
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1500); // Increased for dramatic effect
        });
    }
    
    simulateLoading() {
        const interval = setInterval(() => {
            this.targetProgress += Math.random() * 12;
            if (this.targetProgress >= 100) {
                this.targetProgress = 100;
                clearInterval(interval);
            }
            this.updateProgress();
        }, 150);
    }
    
    updateProgress() {
        this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;
        this.progress.style.width = `${this.currentProgress}%`;
    }
    
    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 800);
    }
}

// Enhanced Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observers = [];
        this.init();
    }
    
    init() {
        this.createObservers();
        this.initNavScroll();
        this.initParallaxEffects();
    }
    
    createObservers() {
        // Enhanced Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Add staggered animation for skill cards
                    if (entry.target.classList.contains('skill-card')) {
                        const cards = document.querySelectorAll('.skill-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('animate');
                            }, index * 150);
                        });
                    }
                    
                    // Add staggered animation for timeline items
                    if (entry.target.classList.contains('timeline-item')) {
                        const items = document.querySelectorAll('.timeline-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('animate');
                            }, index * 200);
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements with data-scroll attribute
        document.querySelectorAll('[data-scroll="true"]').forEach(el => {
            observer.observe(el);
        });
        
        this.observers.push(observer);
    }
    
    initParallaxEffects() {
        // Enhanced parallax scrolling
        window.addEventListener('scroll', utils.throttle(() => {
            const scrolled = window.pageYOffset;
            
            // Parallax for hero content only
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Removed parallax for section headers to keep them stable
            // Section headers will now remain in their fixed positions
        }, 16));
    }
    
    initNavScroll() {
        const nav = document.querySelector('.nav');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', utils.throttle(() => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class for background
            if (currentScrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            // Enhanced hide/show nav on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
                nav.style.opacity = '0.95';
            } else {
                nav.style.transform = 'translateY(0)';
                nav.style.opacity = '1';
            }
            
            lastScrollY = currentScrollY;
        }, 16));
    }
}

// Enhanced Navigation
class Navigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateActiveLink();
        this.initSmoothScrolling();
    }
    
    bindEvents() {
        // Mobile menu toggle with enhanced animation
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
            
            // Add body class to prevent scroll when menu is open
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', utils.throttle(() => {
            this.updateActiveLink();
        }, 100));
    }
    
    initSmoothScrolling() {
        // Enhanced smooth scrolling with easing
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            
            if (link) {
                if (scrollPos >= top && scrollPos < bottom) {
                    this.navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
}

// Enhanced Contact Form
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.addInputEffects();
        }
    }
    
    addInputEffects() {
        // Enhanced input focus effects
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Add floating label effect
            input.addEventListener('input', () => {
                if (input.value) {
                    input.parentElement.classList.add('has-value');
                } else {
                    input.parentElement.classList.remove('has-value');
                }
            });
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state with enhanced animation
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading-spinner small"></span> Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        try {
            // Simulate form submission with realistic delay
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // Show success message with animation
            this.showMessage('Message sent successfully! 🚀 I\'ll get back to you soon.', 'success');
            this.form.reset();
            
            // Reset has-value classes
            const formGroups = this.form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('has-value', 'focused');
            });
            
        } catch (error) {
            // Show error message
            this.showMessage('Failed to send message. Please try reaching out via LinkedIn. 📧', 'error');
        } finally {
            // Reset button with animation
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }, 500);
        }
    }
    
    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.innerHTML = message;
        
        this.form.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Enhanced Interactive Elements
class InteractiveElements {
    constructor() {
        this.init();
    }
    
    init() {
        this.initAdvancedHoverEffects();
        this.initStartExperience();
        this.initMouseTracker();
        this.initTextEffects();
        this.initVideoInteractions();
        this.initDroneVideoShowcase();
        this.initPodcastVideoShowcase();
    }
    
    initAdvancedHoverEffects() {
        // Enhanced 3D tilt effect for cards
        const cards = document.querySelectorAll('.skill-card, .project-card, .timeline-content');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            });
        });
    }
    
    initMouseTracker() {
        // Enhanced mouse tracking for background elements
        document.addEventListener('mousemove', utils.throttle((e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 100;
            const y = (clientY / window.innerHeight) * 100;
            
            // Move background gradients based on mouse
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        }, 16));
    }
    
    initVideoInteractions() {
        // Enhanced video player interactions
        const videoContainers = document.querySelectorAll('.video-container');
        
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            const overlay = container.querySelector('.video-overlay');
            const playButton = container.querySelector('.play-button');
            
            if (video && overlay && playButton) {
                // Play/pause on overlay click
                overlay.addEventListener('click', () => {
                    if (video.paused) {
                        video.play();
                        overlay.style.opacity = '0';
                        playButton.textContent = '⏸';
                    } else {
                        video.pause();
                        overlay.style.opacity = '1';
                        playButton.textContent = '▶';
                    }
                });
                
                // Update overlay on video events
                video.addEventListener('play', () => {
                    overlay.style.opacity = '0';
                    playButton.textContent = '⏸';
                });
                
                video.addEventListener('pause', () => {
                    overlay.style.opacity = '1';
                    playButton.textContent = '▶';
                });
                
                video.addEventListener('ended', () => {
                    overlay.style.opacity = '1';
                    playButton.textContent = '▶';
                });
                
                // Enhanced hover effect for video containers
                container.addEventListener('mouseenter', () => {
                    container.style.transform = 'scale(1.02)';
                    container.style.transition = 'transform 0.3s ease';
                });
                
                container.addEventListener('mouseleave', () => {
                    container.style.transform = 'scale(1)';
                });
            }
        });
        
        // Image gallery interactions
        const mediaItems = document.querySelectorAll('.media-item');
        mediaItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                // Add click-to-expand functionality
                img.addEventListener('click', () => {
                    this.openImageModal(img.src, img.alt);
                });
                
                img.style.cursor = 'pointer';
            }
        });
    }
    
    openImageModal(src, alt) {
        // Create modal for full-size image viewing
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <img src="${src}" alt="${alt}" class="modal-image">
                    <div class="modal-caption">${alt}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        const closeModal = () => {
            modal.classList.add('closing');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal();
            }
        });
        
        // Keyboard support
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        
        document.addEventListener('keydown', handleKeydown);
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    initTextEffects() {
        // Enhanced typing effect for hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            this.addGlitchEffect(heroTitle);
        }
        
        // Add data attributes for glowing text effect
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            title.setAttribute('data-text', title.textContent);
        });
    }
    
    addGlitchEffect(element) {
        let isGlitching = false;
        
        element.addEventListener('mouseenter', () => {
            if (!isGlitching) {
                isGlitching = true;
                element.classList.add('glitch');
                
                setTimeout(() => {
                    element.classList.remove('glitch');
                    isGlitching = false;
                }, 600);
            }
        });
    }
    
    initStartExperience() {
        const startBtn = document.getElementById('start-experience');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Enhanced particle explosion effect
                this.createCosmicExplosion();
                
                // Smooth scroll to about section with enhanced timing
                setTimeout(() => {
                    document.getElementById('about').scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 800);
            });
        }
    }
    
    createCosmicExplosion() {
        // Enhanced cosmic explosion with multiple layers
        const explosionLayers = 3;
        
        for (let layer = 0; layer < explosionLayers; layer++) {
            setTimeout(() => {
                this.createExplosionLayer(layer);
            }, layer * 200);
        }
    }
    
    createExplosionLayer(layerIndex) {
        const explosionParticles = new THREE.BufferGeometry();
        const particleCount = 300;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = [];
        
        const layerColors = [
            [0.4, 0.3, 1.0],   // Blue
            [0.8, 0.2, 0.9],   // Purple  
            [0.2, 0.8, 1.0]    // Cyan
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = 0;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = 0;
            
            const speed = (Math.random() + 0.5) * (15 + layerIndex * 5);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            velocities.push({
                x: Math.sin(phi) * Math.cos(theta) * speed,
                y: Math.sin(phi) * Math.sin(theta) * speed,
                z: Math.cos(phi) * speed
            });
            
            const color = layerColors[layerIndex % layerColors.length];
            colors[i3] = color[0] + Math.random() * 0.2;
            colors[i3 + 1] = color[1] + Math.random() * 0.2;
            colors[i3 + 2] = color[2] + Math.random() * 0.2;
        }
        
        explosionParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        explosionParticles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const explosionMaterial = new THREE.PointsMaterial({
            size: 6 + layerIndex * 2,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        const explosionSystem = new THREE.Points(explosionParticles, explosionMaterial);
        scene.add(explosionSystem);
        
        // Animate explosion
        let frame = 0;
        const maxFrames = 80;
        
        const animateExplosion = () => {
            if (frame < maxFrames) {
                const positions = explosionSystem.geometry.attributes.position.array;
                
                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    positions[i3] += velocities[i].x;
                    positions[i3 + 1] += velocities[i].y;
                    positions[i3 + 2] += velocities[i].z;
                    
                    // Add gravity effect
                    velocities[i].y -= 0.2;
                }
                
                explosionSystem.geometry.attributes.position.needsUpdate = true;
                explosionMaterial.opacity = 1 - (frame / maxFrames);
                
                frame++;
                requestAnimationFrame(animateExplosion);
            } else {
                scene.remove(explosionSystem);
            }
        };
        
        animateExplosion();
    }
    
    initDroneVideoShowcase() {
        // Enhanced drone video showcase controls
        const showcaseVideo = document.querySelector('.showcase-video');
        const videoCard = document.querySelector('.video-card');
        const videoToggle = document.getElementById('video-toggle');
        const progressLine = document.getElementById('video-progress-line');
        const controlText = videoToggle?.querySelector('.control-text');
        const controlIcon = videoToggle?.querySelector('.control-icon');
        const videoContainer = document.querySelector('.video-showcase-container');
        
        if (showcaseVideo && videoToggle && videoCard) {
            // Enhanced mouse interaction for video card
            this.initVideoCardMouseInteraction(videoCard);
            
            // Video play/pause control with spiral animation
            videoToggle.addEventListener('click', () => {
                if (showcaseVideo.paused) {
                    showcaseVideo.play();
                    controlText.textContent = 'Pause';
                    controlIcon.textContent = '⏸';
                    videoToggle.classList.add('playing');
                    videoContainer.classList.remove('paused');
                } else {
                    showcaseVideo.pause();
                    controlText.textContent = 'Play';
                    controlIcon.textContent = '▶';
                    videoToggle.classList.remove('playing');
                    videoContainer.classList.add('paused');
                }
            });
            
            // Enhanced spiral effects - add different animation modes for the card
            let spiralMode = 'default'; // 'default', 'dramatic', 'gentle'
            
            // Add spiral mode toggle (optional - can be triggered by double-click)
            videoCard.addEventListener('dblclick', (e) => {
                e.preventDefault();
                
                // Cycle through spiral modes
                videoCard.classList.remove('dramatic-spiral', 'gentle-spiral');
                
                switch(spiralMode) {
                    case 'default':
                        spiralMode = 'dramatic';
                        videoCard.classList.add('dramatic-spiral');
                        console.log('Switched to dramatic spiral mode');
                        break;
                    case 'dramatic':
                        spiralMode = 'gentle';
                        videoCard.classList.add('gentle-spiral');
                        console.log('Switched to gentle spiral mode');
                        break;
                    case 'gentle':
                        spiralMode = 'default';
                        console.log('Switched to default spiral mode');
                        break;
                }
                
                // Show mode indicator
                this.showSpiralModeIndicator(spiralMode);
            });
            
            // Video progress tracking
            showcaseVideo.addEventListener('timeupdate', () => {
                if (progressLine && showcaseVideo.duration) {
                    const progress = (showcaseVideo.currentTime / showcaseVideo.duration) * 100;
                    progressLine.style.width = `${progress}%`;
                }
            });
            
            // Reset progress when video ends (for looping videos)
            showcaseVideo.addEventListener('ended', () => {
                if (progressLine) {
                    progressLine.style.width = '0%';
                }
            });
            
            // Handle video loading states
            showcaseVideo.addEventListener('loadstart', () => {
                console.log('Drone video loading started...');
            });
            
            showcaseVideo.addEventListener('canplay', () => {
                console.log('Drone video ready to play');
                // Ensure animation starts when video is ready
                videoContainer.classList.remove('paused');
            });
            
            showcaseVideo.addEventListener('error', (e) => {
                console.error('Drone video error:', e);
                // Hide the entire video showcase if video fails to load
                const videoShowcase = document.querySelector('.drone-video-showcase');
                if (videoShowcase) {
                    videoShowcase.style.display = 'none';
                }
            });
            
            // Intersection Observer for video showcase
            const showcaseObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add enhanced animation when video section comes into view
                        entry.target.classList.add('in-view');
                        
                        // Ensure video is playing when in view (if not manually paused)
                        if (!showcaseVideo.paused && showcaseVideo.readyState >= 2) {
                            showcaseVideo.play().catch(e => console.log('Auto-play prevented:', e));
                        }
                    }
                });
            }, {
                threshold: 0.5
            });
            
            const videoShowcaseSection = document.querySelector('.drone-video-showcase');
            if (videoShowcaseSection) {
                showcaseObserver.observe(videoShowcaseSection);
            }
            
            // Keyboard controls for video
            document.addEventListener('keydown', (e) => {
                // Only work when video showcase is in viewport
                const rect = showcaseVideo.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isInView) {
                    switch(e.code) {
                        case 'Space':
                            e.preventDefault();
                            videoToggle.click();
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            showcaseVideo.currentTime = Math.max(0, showcaseVideo.currentTime - 10);
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            showcaseVideo.currentTime = Math.min(showcaseVideo.duration, showcaseVideo.currentTime + 10);
                            break;
                        case 'KeyS':
                            e.preventDefault();
                            // Toggle spiral mode with 'S' key
                            const event = new Event('dblclick');
                            videoCard.dispatchEvent(event);
                            break;
                    }
                }
            });
            
            // Touch/click on video to pause/play (mobile-friendly)
            showcaseVideo.addEventListener('click', (e) => {
                e.preventDefault();
                videoToggle.click();
            });
            
            // Handle mobile autoplay restrictions
            const handleFirstUserInteraction = () => {
                showcaseVideo.play().catch(e => {
                    console.log('Auto-play still prevented after user interaction:', e);
                });
                document.removeEventListener('touchstart', handleFirstUserInteraction);
                document.removeEventListener('click', handleFirstUserInteraction);
            };
            
            document.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
            document.addEventListener('click', handleFirstUserInteraction, { once: true });
        }
    }
    
    initPodcastVideoShowcase() {
        // Enhanced podcast video showcase controls
        const showcaseVideos = document.querySelectorAll('#podcast-showcase .showcase-video');
        const videoCards = document.querySelectorAll('#podcast-showcase .video-card');
        const videoToggle = document.getElementById('podcast-video-toggle');
        const progressLine = document.getElementById('podcast-video-progress-line');
        const controlText = videoToggle?.querySelector('.control-text');
        const controlIcon = videoToggle?.querySelector('.control-icon');
        const videoContainer = document.querySelector('#podcast-showcase .video-showcase-container');
        
        // Get the specific podcast video (second showcase video)
        const podcastVideo = showcaseVideos[showcaseVideos.length - 1];
        const podcastVideoCard = videoCards[videoCards.length - 1];
        
        if (podcastVideo && videoToggle && podcastVideoCard) {
            // Enhanced mouse interaction for podcast video card with purple glow
            this.initPodcastVideoCardMouseInteraction(podcastVideoCard);
            
            // Video play/pause control with spiral animation
            videoToggle.addEventListener('click', () => {
                if (podcastVideo.paused) {
                    podcastVideo.play();
                    controlText.textContent = 'Pause';
                    controlIcon.textContent = '⏸';
                    videoToggle.classList.add('playing');
                    videoContainer.classList.remove('paused');
                } else {
                    podcastVideo.pause();
                    controlText.textContent = 'Play';
                    controlIcon.textContent = '▶';
                    videoToggle.classList.remove('playing');
                    videoContainer.classList.add('paused');
                }
            });
            
            // Enhanced spiral effects - add different animation modes for the card
            let spiralMode = 'default';
            
            // Add spiral mode toggle (optional - can be triggered by double-click)
            podcastVideoCard.addEventListener('dblclick', (e) => {
                e.preventDefault();
                
                // Cycle through spiral modes
                podcastVideoCard.classList.remove('dramatic-spiral', 'gentle-spiral');
                
                switch(spiralMode) {
                    case 'default':
                        spiralMode = 'dramatic';
                        podcastVideoCard.classList.add('dramatic-spiral');
                        console.log('Podcast: Switched to dramatic spiral mode');
                        break;
                    case 'dramatic':
                        spiralMode = 'gentle';
                        podcastVideoCard.classList.add('gentle-spiral');
                        console.log('Podcast: Switched to gentle spiral mode');
                        break;
                    case 'gentle':
                        spiralMode = 'default';
                        console.log('Podcast: Switched to default spiral mode');
                        break;
                }
                
                // Show mode indicator
                this.showPodcastSpiralModeIndicator(spiralMode);
            });
            
            // Video progress tracking
            podcastVideo.addEventListener('timeupdate', () => {
                if (progressLine && podcastVideo.duration) {
                    const progress = (podcastVideo.currentTime / podcastVideo.duration) * 100;
                    progressLine.style.width = `${progress}%`;
                }
            });
            
            // Reset progress when video ends (for looping videos)
            podcastVideo.addEventListener('ended', () => {
                if (progressLine) {
                    progressLine.style.width = '0%';
                }
            });
            
            // Handle video loading states
            podcastVideo.addEventListener('loadstart', () => {
                console.log('Podcast video loading started...');
            });
            
            podcastVideo.addEventListener('canplay', () => {
                console.log('Podcast video ready to play');
                // Ensure animation starts when video is ready
                videoContainer.classList.remove('paused');
            });
            
            podcastVideo.addEventListener('error', (e) => {
                console.error('Podcast video error:', e);
                // Hide the entire video showcase if video fails to load
                const videoShowcase = document.querySelector('#podcast-showcase');
                if (videoShowcase) {
                    videoShowcase.style.display = 'none';
                }
            });
            
            // Touch/click on video to pause/play (mobile-friendly)
            podcastVideo.addEventListener('click', (e) => {
                e.preventDefault();
                videoToggle.click();
            });
        }
    }
    
    initVideoCardMouseInteraction(videoCard) {
        let currentTransform = '';
        let isMouseOver = false;
        
        // Mouse enter - start interactive mode
        videoCard.addEventListener('mouseenter', () => {
            isMouseOver = true;
            videoCard.style.transition = 'transform 0.1s ease';
        });
        
        // Mouse move - 3D tilt effect
        videoCard.addEventListener('mousemove', (e) => {
            if (!isMouseOver) return;
            
            const rect = videoCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation values (more subtle for video)
            const rotateX = (y - centerY) / centerY * 8; // Max 8 degrees
            const rotateY = (centerX - x) / centerX * 8; // Max 8 degrees
            
            // Calculate scale and translate values for depth
            const scale = 1.02;
            const translateZ = 20;
            
            // Apply transform while preserving any existing spiral animation
            const interactiveTransform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(${scale}) 
                translateZ(${translateZ}px)
            `;
            
            videoCard.style.transform = interactiveTransform;
            
            // Add subtle glow effect based on mouse position
            const glowIntensity = Math.min(Math.abs(rotateX) + Math.abs(rotateY), 10) / 10;
            const glowOpacity = 0.3 + (glowIntensity * 0.3);
            videoCard.style.boxShadow = `
                0 ${20 + glowIntensity * 20}px ${40 + glowIntensity * 40}px rgba(99, 102, 241, ${glowOpacity}),
                0 0 ${30 + glowIntensity * 50}px rgba(99, 102, 241, ${glowOpacity * 0.5})
            `;
        });
        
        // Mouse leave - return to original state
        videoCard.addEventListener('mouseleave', () => {
            isMouseOver = false;
            videoCard.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
            
            // Reset to original transform (keeping spiral animation)
            videoCard.style.transform = '';
            videoCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            
            // Restore original transition after reset
            setTimeout(() => {
                videoCard.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            }, 400);
        });
        
        // Click effect - pulse animation
        videoCard.addEventListener('click', (e) => {
            // Don't interfere with video controls
            if (e.target.tagName.toLowerCase() === 'video') return;
            
            // Create pulse effect
            videoCard.style.transform = 'scale(0.98)';
            videoCard.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                videoCard.style.transform = isMouseOver ? 
                    videoCard.style.transform : '';
                videoCard.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            }, 100);
        });
        
        // Enhanced magnetic cursor effect
        const showcaseSection = document.querySelector('.drone-video-showcase');
        if (showcaseSection) {
            showcaseSection.addEventListener('mousemove', (e) => {
                const rect = videoCard.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                
                const distanceX = e.clientX - cardCenterX;
                const distanceY = e.clientY - cardCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                // Magnetic effect when cursor is near the card
                if (distance < 200 && !isMouseOver) {
                    const magnetStrength = Math.max(0, (200 - distance) / 200) * 0.3;
                    const magnetX = (distanceX / distance) * magnetStrength * 10;
                    const magnetY = (distanceY / distance) * magnetStrength * 10;
                    
                    videoCard.style.transform = `translate(${magnetX}px, ${magnetY}px) scale(${1 + magnetStrength * 0.02})`;
                } else if (!isMouseOver) {
                    videoCard.style.transform = '';
                }
            });
        }
    }
    
    showSpiralModeIndicator(mode) {
        // Show spiral mode indicator
        const indicator = document.createElement('div');
        indicator.className = 'spiral-mode-indicator';
        indicator.textContent = `Spiral Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
        
        const videoShowcase = document.querySelector('.drone-video-showcase');
        videoShowcase.appendChild(indicator);
        
        // Animate in
        setTimeout(() => {
            indicator.classList.add('show');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.remove();
                }
            }, 300);
        }, 2000);
    }
    
    initPodcastVideoCardMouseInteraction(videoCard) {
        let currentTransform = '';
        let isMouseOver = false;
        
        // Mouse enter - start interactive mode
        videoCard.addEventListener('mouseenter', () => {
            isMouseOver = true;
            videoCard.style.transition = 'transform 0.1s ease';
        });
        
        // Mouse move - 3D tilt effect with purple glow
        videoCard.addEventListener('mousemove', (e) => {
            if (!isMouseOver) return;
            
            const rect = videoCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation values (more subtle for video)
            const rotateX = (y - centerY) / centerY * 8; // Max 8 degrees
            const rotateY = (centerX - x) / centerX * 8; // Max 8 degrees
            
            // Calculate scale and translate values for depth
            const scale = 1.02;
            const translateZ = 20;
            
            // Apply transform while preserving any existing spiral animation
            const interactiveTransform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(${scale}) 
                translateZ(${translateZ}px)
            `;
            
            videoCard.style.transform = interactiveTransform;
            
            // Add purple glow effect based on mouse position
            const glowIntensity = Math.min(Math.abs(rotateX) + Math.abs(rotateY), 10) / 10;
            const glowOpacity = 0.3 + (glowIntensity * 0.3);
            videoCard.style.boxShadow = `
                0 ${20 + glowIntensity * 20}px ${40 + glowIntensity * 40}px rgba(147, 51, 234, ${glowOpacity}),
                0 0 ${30 + glowIntensity * 50}px rgba(147, 51, 234, ${glowOpacity * 0.5})
            `;
        });
        
        // Mouse leave - return to original state
        videoCard.addEventListener('mouseleave', () => {
            isMouseOver = false;
            videoCard.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
            
            // Reset to original transform (keeping spiral animation)
            videoCard.style.transform = '';
            videoCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            
            // Restore original transition after reset
            setTimeout(() => {
                videoCard.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            }, 400);
        });
        
        // Click effect - pulse animation
        videoCard.addEventListener('click', (e) => {
            // Don't interfere with video controls
            if (e.target.tagName.toLowerCase() === 'video') return;
            
            // Create pulse effect
            videoCard.style.transform = 'scale(0.98)';
            videoCard.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                videoCard.style.transform = isMouseOver ? 
                    videoCard.style.transform : '';
                videoCard.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            }, 100);
        });
    }
    
    showPodcastSpiralModeIndicator(mode) {
        // Show spiral mode indicator for podcast
        const indicator = document.createElement('div');
        indicator.className = 'spiral-mode-indicator';
        indicator.textContent = `Podcast Spiral Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
        
        const videoShowcase = document.querySelector('#podcast-showcase');
        videoShowcase.appendChild(indicator);
        
        // Animate in
        setTimeout(() => {
            indicator.classList.add('show');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.remove();
                }
            }, 300);
        }, 2000);
    }
}

// Enhanced Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.fps = 60;
        this.isOptimized = false;
        this.init();
    }
    
    init() {
        // Enhanced mobile optimization
        if (window.innerWidth < 768) {
            this.optimizeForMobile();
        }
        
        // Advanced FPS monitoring
        this.monitorFPS();
        this.monitorMemory();
    }
    
    optimizeForMobile() {
        if (particleSystem) {
            // Reduce particle count significantly on mobile
            const geometry = particleSystem.geometry;
            const positions = geometry.attributes.position.array;
            
            const newPositions = new Float32Array(positions.length / 3);
            for (let i = 0; i < newPositions.length; i++) {
                newPositions[i] = positions[i * 3];
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
        }
        
        // Reduce visual effects on mobile
        if (starField) starField.visible = false;
        if (galaxySpiral) galaxySpiral.visible = false;
        nebulaClouds.forEach(cloud => cloud.visible = false);
        
        this.isOptimized = true;
    }
    
    monitorFPS() {
        let lastTime = performance.now();
        let frames = 0;
        
        const checkFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                this.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                // Dynamic quality adjustment
                if (this.fps < 30 && !this.isOptimized) {
                    this.adaptiveOptimization();
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        checkFPS();
    }
    
    monitorMemory() {
        if (performance.memory) {
            setInterval(() => {
                const memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
                
                if (memoryUsage > 100 && !this.isOptimized) {
                    console.warn('High memory usage detected, optimizing...');
                    this.adaptiveOptimization();
                }
            }, 5000);
        }
    }
    
    adaptiveOptimization() {
        // Reduce particle counts
        if (particleSystem) {
            particleSystem.material.size *= 0.8;
        }
        
        // Reduce nebula opacity
        nebulaClouds.forEach(cloud => {
            cloud.material.opacity *= 0.5;
        });
        
        // Reduce cosmic dust
        if (cosmicDust) {
            cosmicDust.material.opacity *= 0.7;
        }
        
        this.isOptimized = true;
        console.log('Performance optimization applied');
    }
}

// Enhanced utility functions
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    lerp: (start, end, factor) => {
        return start + (end - start) * factor;
    },
    
    random: (min, max) => {
        return Math.random() * (max - min) + min;
    },
    
    easeOutCubic: (t) => {
        return 1 - Math.pow(1 - t, 3);
    },
    
    easeInOutCubic: (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded successfully');
    
    // Initialize Three.js first
    initThree();
    
    // Initialize all components
    const loadingManager = new LoadingManager();
    const scrollAnimations = new ScrollAnimations();
    const navigation = new Navigation();
    const interactiveElements = new InteractiveElements();
    const contactForm = new ContactForm();
    const pokemonCarousel = new PokemonCardsCarousel();
    const timelineHeadscan = new TimelineHeadScanViewer();
    
    // Initialize premium project sections
    initializePremiumProjects();
    
    // Start the loading sequence
    loadingManager.init();
});

// Pokemon Cards Carousel
class PokemonCardsCarousel {
    constructor() {
        this.currentIndex = 0;
        this.cards = [];
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.container = document.getElementById('cards-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.indicators = document.querySelectorAll('.indicator');
        this.cards = document.querySelectorAll('.pokemon-card');
        
        if (!this.container || this.cards.length === 0) return;
        
        this.setupEventListeners();
        this.setupMouseTracking();
        this.updateCards();
        this.startAutoPlay();
        this.showCardInfo();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevCard());
        this.nextBtn?.addEventListener('click', () => this.nextCard());
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToCard(index));
        });
        
        // Touch/swipe support
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    setupMouseTracking() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.resetCard(card));
        });
    }
    
    handleMouseMove(e, card) {
        if (!card.classList.contains('active')) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate percentages for holographic effect
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        // Calculate rotation based on mouse position for holographic hue rotation
        const rotateValue = ((x + y) / (rect.width + rect.height)) * 360;
        
        // Enhanced holographic effect with multiple properties
        card.style.setProperty('--x', `${xPercent}`);
        card.style.setProperty('--y', `${yPercent}`);
        card.style.setProperty('--rotate', `${rotateValue}`);
        
        // 3D tilt effect with enhanced movement
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        
        // Apply enhanced transform with perspective
        card.style.transform = `
            perspective(1000px) 
            translateY(-15px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale(1.05)
        `;
        
        // Add shimmer effect to card elements
        this.addShimmerEffect(card, xPercent, yPercent);
    }
    
    addShimmerEffect(card, xPercent, yPercent) {
        // Add shimmer to card image
        const image = card.querySelector('.profile-image');
        if (image) {
            const shimmerX = (xPercent - 50) * 0.5;
            const shimmerY = (yPercent - 50) * 0.5;
            image.style.transform = `translate(${shimmerX}px, ${shimmerY}px) scale(1.1)`;
        }
        
        // Add glow effect to card frame
        const frame = card.querySelector('.card-image-frame');
        if (frame) {
            const glowIntensity = Math.min((Math.abs(xPercent - 50) + Math.abs(yPercent - 50)) / 50, 1);
            frame.style.boxShadow = `
                0 10px 25px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 0 ${30 + glowIntensity * 20}px rgba(99, 102, 241, ${0.3 + glowIntensity * 0.3})
            `;
        }
    }

    resetCard(card) {
        card.style.removeProperty('--x');
        card.style.removeProperty('--y');
        card.style.removeProperty('--rotate');
        
        if (card.classList.contains('active')) {
            card.style.transform = '';
        }
        
        // Reset shimmer effects
        const image = card.querySelector('.profile-image');
        if (image) {
            image.style.transform = '';
        }
        
        const frame = card.querySelector('.card-image-frame');
        if (frame) {
            frame.style.boxShadow = '';
        }
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextCard();
            } else {
                this.prevCard();
            }
        }
    }
    
    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prevCard();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextCard();
        }
    }
    
    prevCard() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateCards();
        this.resetAutoPlay();
    }
    
    nextCard() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateCards();
        this.resetAutoPlay();
    }
    
    goToCard(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateCards();
        this.resetAutoPlay();
    }
    
    updateCards() {
        this.isAnimating = true;
        
        this.cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentIndex) {
                card.classList.add('active');
            } else if (index === (this.currentIndex - 1 + this.cards.length) % this.cards.length) {
                card.classList.add('prev');
            } else if (index === (this.currentIndex + 1) % this.cards.length) {
                card.classList.add('next');
            }
        });
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.nextCard();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.startAutoPlay();
    }
    
    showCardInfo() {
        // Show card info after a delay
        setTimeout(() => {
            const cardInfo = document.querySelector('.card-info');
            if (cardInfo) {
                cardInfo.classList.add('show');
            }
        }, 1000);
    }
}

// Timeline HeadScan Viewer (moved from hero section)
class TimelineHeadScanViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.isLoaded = false;
        this.container = null;
        
        this.init();
    }
    
    init() {
        this.container = document.getElementById('timeline-3d-model');
        if (!this.container) return;
        
        this.setupScene();
        this.setupLights();
        this.loadModel();
        this.addEventListeners();
        this.animate();
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            50,
            this.container.offsetWidth / this.container.offsetHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 2);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x6366f1, 0.4);
        fillLight.position.set(-3, 2, 1);
        this.scene.add(fillLight);
        
        // Accent light
        const accentLight = new THREE.PointLight(0x06b6d4, 0.6, 10);
        accentLight.position.set(0, 3, 2);
        this.scene.add(accentLight);
    }
    
    loadModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'asset/debangsha_head.glb',
            (gltf) => this.onModelLoaded(gltf),
            (progress) => this.onProgress(progress),
            (error) => this.onError(error)
        );
    }
    
    onModelLoaded(gltf) {
        this.model = gltf.scene;
        
        // Scale and position the model
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Scale to fit nicely in the timeline card
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.8 / maxDim;
        this.model.scale.setScalar(scale);
        this.model.userData.originalScale = scale;
        
        // Center the model
        this.model.position.sub(center.multiplyScalar(scale));
        this.model.position.y -= 0.05;
        
        // Rotate 180 degrees to show the front of the head
        this.model.rotation.y = Math.PI;
        
        // Enable shadows and enhance materials
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    child.material.envMapIntensity = 0.8;
                    if (child.material.metalness !== undefined) {
                        child.material.metalness *= 0.7;
                        child.material.roughness *= 0.8;
                    }
                }
            }
        });
        
        // Set up animations if available
        if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.model);
            gltf.animations.forEach((clip) => {
                const action = this.mixer.clipAction(clip);
                action.play();
            });
        }
        
        this.scene.add(this.model);
        this.hideLoading();
        this.showModelInfo();
        this.isLoaded = true;
    }
    
    onProgress(progress) {
        // Optional: Update loading progress
        if (progress.lengthComputable) {
            const percentComplete = (progress.loaded / progress.total) * 100;
            console.log(`Loading: ${percentComplete.toFixed(1)}%`);
        }
    }
    
    onError(error) {
        console.error('Error loading 3D model:', error);
        this.hideLoading();
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            color: #ef4444; 
            text-align: center; 
            padding: 1rem;
            font-size: 0.875rem;
        `;
        errorDiv.textContent = 'Failed to load 3D model';
        this.container.appendChild(errorDiv);
    }
    
    hideLoading() {
        const loading = this.container.querySelector('.model-loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }
    
    showModelInfo() {
        const modelInfo = this.container.parentElement.querySelector('.model-info');
        if (modelInfo) {
            setTimeout(() => {
                modelInfo.classList.add('show');
            }, 500);
        }
    }
    
    addEventListeners() {
        // Mouse movement
        this.container.addEventListener('mousemove', (event) => {
            if (!this.isLoaded) return;
            
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });
        
        // Mouse leave - return to front-facing position
        this.container.addEventListener('mouseleave', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
        
        // Resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isLoaded) return;
        
        const delta = this.clock.getDelta();
        
        // Update model rotation based on mouse
        if (this.model) {
            // Base rotation (180 degrees) + mouse interaction
            const baseRotationY = Math.PI;
            const targetRotationY = baseRotationY + this.mouse.x * 0.4;
            const targetRotationX = this.mouse.y * 0.3;
            
            // Smooth interpolation for natural movement
            this.model.rotation.y += (targetRotationY - this.model.rotation.y) * 0.08;
            this.model.rotation.x += (targetRotationX - this.model.rotation.x) * 0.08;
            
            // Add floating animation
            const time = this.clock.getElapsedTime();
            this.model.position.y += Math.sin(time * 1.5) * 0.002;
            
            // Add breathing effect
            const breathScale = 1 + Math.sin(time * 2) * 0.02;
            const baseScale = this.model.userData.originalScale || 1;
            this.model.scale.setScalar(baseScale * breathScale);
        }
        
        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Premium Project Sections Interactive Elements
function initializePremiumProjects() {
    // Initialize 3D Drone Viewport
    const droneViewport = document.getElementById('drone-3d-viewport');
    if (droneViewport) {
        initDroneViewport(droneViewport);
    }
    
    // Initialize Podcast Visualizer
    const podcastVisualizer = document.getElementById('podcast-visualizer');
    if (podcastVisualizer) {
        initPodcastVisualizer(podcastVisualizer);
    }
    
    // Initialize floating card animations
    initFloatingCards();
    
    // Initialize floating geometric elements
    initFloatingGeometry();
}

function initDroneViewport(viewport) {
    // Create 3D geometric shape
    const shape = document.createElement('div');
    shape.className = 'drone-3d-shape';
    shape.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120px;
        height: 120px;
        transform: translate(-50%, -50%);
        transform-style: preserve-3d;
        animation: droneFloat 8s ease-in-out infinite;
    `;
    
    // Create cube faces
    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    faces.forEach((face, index) => {
        const faceElement = document.createElement('div');
        faceElement.className = `drone-face drone-face-${face}`;
        faceElement.style.cssText = `
            position: absolute;
            width: 120px;
            height: 120px;
            background: linear-gradient(45deg, 
                rgba(99, 102, 241, 0.1), 
                rgba(6, 182, 212, 0.1));
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        `;
        
        // Position faces
        switch(face) {
            case 'front':
                faceElement.style.transform = 'rotateY(0deg) translateZ(60px)';
                break;
            case 'back':
                faceElement.style.transform = 'rotateY(180deg) translateZ(60px)';
                break;
            case 'right':
                faceElement.style.transform = 'rotateY(90deg) translateZ(60px)';
                break;
            case 'left':
                faceElement.style.transform = 'rotateY(-90deg) translateZ(60px)';
                break;
            case 'top':
                faceElement.style.transform = 'rotateX(90deg) translateZ(60px)';
                break;
            case 'bottom':
                faceElement.style.transform = 'rotateX(-90deg) translateZ(60px)';
                break;
        }
        
        shape.appendChild(faceElement);
    });
    
    viewport.appendChild(shape);
    
    // Add control handlers
    const controls = viewport.querySelectorAll('.control-btn');
    controls.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            handleDroneViewportAction(action, shape);
        });
    });
    
    // Add CSS animations
    if (!document.querySelector('#drone-animations')) {
        const style = document.createElement('style');
        style.id = 'drone-animations';
        style.textContent = `
            @keyframes droneFloat {
                0%, 100% { 
                    transform: translate(-50%, -50%) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
                }
                25% { 
                    transform: translate(-50%, -50%) rotateX(15deg) rotateY(90deg) rotateZ(5deg);
                }
                50% { 
                    transform: translate(-50%, -50%) rotateX(0deg) rotateY(180deg) rotateZ(0deg);
                }
                75% { 
                    transform: translate(-50%, -50%) rotateX(-15deg) rotateY(270deg) rotateZ(-5deg);
                }
            }
            @keyframes droneRotate {
                0% { transform: translate(-50%, -50%) rotateY(0deg); }
                100% { transform: translate(-50%, -50%) rotateY(720deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function handleDroneViewportAction(action, shape) {
    switch(action) {
        case 'rotate':
            shape.style.animation = 'droneRotate 2s ease-in-out';
            setTimeout(() => {
                shape.style.animation = 'droneFloat 8s ease-in-out infinite';
            }, 2000);
            break;
        case 'zoom':
            shape.style.transform = 'translate(-50%, -50%) scale(1.5)';
            setTimeout(() => {
                shape.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 1000);
            break;
        case 'reset':
            shape.style.animation = 'none';
            shape.style.transform = 'translate(-50%, -50%)';
            setTimeout(() => {
                shape.style.animation = 'droneFloat 8s ease-in-out infinite';
            }, 100);
            break;
    }
}

function initPodcastVisualizer(visualizer) {
    const visualizationArea = visualizer.querySelector('.visualization-area');
    if (!visualizationArea) return;
    
    // Create initial waveform
    createWaveformVisualization(visualizationArea);
    
    // Add control handlers
    const controls = visualizer.querySelectorAll('.viz-btn');
    controls.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            handleVisualizerMode(mode, visualizationArea);
            
            // Update active button
            controls.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Set initial active button
    const waveformBtn = visualizer.querySelector('[data-mode="waveform"]');
    if (waveformBtn) waveformBtn.classList.add('active');
}

function createWaveformVisualization(container) {
    const waveform = document.createElement('div');
    waveform.className = 'podcast-waveform';
    waveform.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: end;
        gap: 3px;
        height: 80px;
    `;
    
    // Create waveform bars
    for (let i = 0; i < 40; i++) {
        const bar = document.createElement('div');
        bar.className = 'waveform-bar';
        bar.style.cssText = `
            width: 4px;
            background: linear-gradient(to top, 
                rgba(147, 51, 234, 0.8), 
                rgba(236, 72, 153, 0.6));
            border-radius: 2px;
            animation: waveformPulse ${0.5 + Math.random() * 1}s ease-in-out infinite alternate;
            animation-delay: ${i * 0.05}s;
            height: ${20 + Math.random() * 60}px;
        `;
        waveform.appendChild(bar);
    }
    
    container.appendChild(waveform);
    
    // Add waveform animation
    if (!document.querySelector('#waveform-animations')) {
        const style = document.createElement('style');
        style.id = 'waveform-animations';
        style.textContent = `
            @keyframes waveformPulse {
                0% { transform: scaleY(0.3); opacity: 0.6; }
                100% { transform: scaleY(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function createFrequencyVisualization(container) {
    const frequency = document.createElement('div');
    frequency.className = 'podcast-frequency';
    frequency.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        border: 2px solid rgba(147, 51, 234, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Create frequency rings
    for (let i = 0; i < 5; i++) {
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: absolute;
            border: 1px solid rgba(236, 72, 153, ${0.2 + i * 0.1});
            border-radius: 50%;
            width: ${40 + i * 30}px;
            height: ${40 + i * 30}px;
            animation: frequencyPulse ${1 + i * 0.3}s ease-in-out infinite;
            animation-delay: ${i * 0.2}s;
        `;
        frequency.appendChild(ring);
    }
    
    container.appendChild(frequency);
    
    // Add frequency animation
    if (!document.querySelector('#frequency-animations')) {
        const style = document.createElement('style');
        style.id = 'frequency-animations';
        style.textContent = `
            @keyframes frequencyPulse {
                0%, 100% { 
                    transform: scale(1); 
                    opacity: 0.6; 
                }
                50% { 
                    transform: scale(1.2); 
                    opacity: 1; 
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function create3DSpectrumVisualization(container) {
    const spectrum = document.createElement('div');
    spectrum.className = 'podcast-3d-spectrum';
    spectrum.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transform-style: preserve-3d;
        animation: spectrum3DRotate 10s linear infinite;
    `;
    
    // Create 3D spectrum bars
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = `
            position: absolute;
            width: 8px;
            height: ${20 + Math.random() * 80}px;
            background: linear-gradient(to top, 
                rgba(147, 51, 234, 0.8), 
                rgba(236, 72, 153, 0.8));
            transform: rotateY(${i * 18}deg) translateZ(60px);
            animation: spectrumBarPulse ${0.5 + Math.random() * 1}s ease-in-out infinite alternate;
            animation-delay: ${i * 0.1}s;
        `;
        spectrum.appendChild(bar);
    }
    
    container.appendChild(spectrum);
    
    // Add 3D spectrum animations
    if (!document.querySelector('#spectrum-animations')) {
        const style = document.createElement('style');
        style.id = 'spectrum-animations';
        style.textContent = `
            @keyframes spectrum3DRotate {
                0% { transform: translate(-50%, -50%) rotateY(0deg); }
                100% { transform: translate(-50%, -50%) rotateY(360deg); }
            }
            @keyframes spectrumBarPulse {
                0% { transform: rotateY(var(--rotation, 0deg)) translateZ(60px) scaleY(0.3); }
                100% { transform: rotateY(var(--rotation, 0deg)) translateZ(60px) scaleY(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

function handleVisualizerMode(mode, visualizationArea) {
    // Remove existing visualizations
    const existing = visualizationArea.querySelectorAll('.podcast-waveform, .podcast-frequency, .podcast-3d-spectrum');
    existing.forEach(el => el.remove());
    
    switch(mode) {
        case 'waveform':
            createWaveformVisualization(visualizationArea);
            break;
        case 'frequency':
            createFrequencyVisualization(visualizationArea);
            break;
        case '3d':
            create3DSpectrumVisualization(visualizationArea);
            break;
    }
}

function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach((card, index) => {
        // Stagger animation delays
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add enhanced mouse tracking
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `
                translateY(-20px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                perspective(1000px)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function initFloatingGeometry() {
    const sections = document.querySelectorAll('.premium-project-section');
    sections.forEach(section => {
        for (let i = 0; i < 3; i++) {
            const geometry = document.createElement('div');
            geometry.className = 'floating-geometry';
            geometry.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: linear-gradient(45deg, 
                    rgba(255, 255, 255, 0.03), 
                    rgba(255, 255, 255, 0.08));
                border-radius: ${Math.random() > 0.5 ? '50%' : '20%'};
                top: ${Math.random() * 80}%;
                left: ${Math.random() * 80}%;
                animation: floatingGeometry ${10 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
                z-index: 1;
            `;
            
            section.appendChild(geometry);
        }
    });
    
    // Add floating geometry animation
    if (!document.querySelector('#floating-geometry-animations')) {
        const style = document.createElement('style');
        style.id = 'floating-geometry-animations';
        style.textContent = `
            @keyframes floatingGeometry {
                0%, 100% { 
                    transform: translate(0, 0) rotate(0deg) scale(1);
                    opacity: 0.3;
                }
                25% { 
                    transform: translate(30px, -20px) rotate(90deg) scale(1.1);
                    opacity: 0.6;
                }
                50% { 
                    transform: translate(-20px, -40px) rotate(180deg) scale(0.9);
                    opacity: 0.4;
                }
                75% { 
                    transform: translate(-30px, 20px) rotate(270deg) scale(1.05);
                    opacity: 0.5;
                }
            }
        `;
        document.head.appendChild(style);
    }
} 