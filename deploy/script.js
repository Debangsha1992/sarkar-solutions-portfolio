// Mobile/iOS Detection and Optimization
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isOldIOS = isIOS && parseFloat(navigator.userAgent.match(/OS (\d+)_(\d+)/)?.[1] || '0') < 13;

// Mobile optimization configuration
const mobileConfig = {
    // Particle system reductions
    starCount: isMobile ? 300 : 2000,
    nebulaCount: isMobile ? 100 : 500,
    spiralCount: isMobile ? 200 : 1500,
    dustCount: isMobile ? 50 : 200,
    
    // Rendering optimizations
    antialias: !isMobile,
    shadowMapSize: isMobile ? 512 : 2048,
    pixelRatio: isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
    
    // Feature toggles
    enableShadows: !isMobile,
    enableFog: !isMobile,
    enableBloom: !isMobile,
    enableNeuralBackground: !isMobile,
    enableAudioBackground: !isMobile,
    enableAdvancedLighting: !isMobile,
    
    // Premium project simplifications
    neuralNodes: isMobile ? 20 : 56,
    gaussianSplats: isMobile ? 10 : 50,
    maxLights: isMobile ? 1 : 3,
    
    // Performance limits
    maxParticles: isMobile ? 500 : 5000,
    targetFPS: isMobile ? 30 : 60
};

// Memory warning for very old devices
if (isOldIOS) {
    console.warn('Old iOS device detected - applying maximum optimizations');
    mobileConfig.starCount = 100;
    mobileConfig.nebulaCount = 50;
    mobileConfig.spiralCount = 100;
    mobileConfig.neuralNodes = 10;
    mobileConfig.gaussianSplats = 5;
    mobileConfig.enableAdvancedLighting = false;
    mobileConfig.enableShadows = false;
}

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

// Enhanced Three.js initialization with mobile optimization
function initThree() {
    // Skip Three.js initialization on very old devices
    if (isOldIOS && navigator.hardwareConcurrency < 4) {
        console.warn('Skipping Three.js initialization on low-performance device');
        return;
    }
    
    // Scene
    scene = new THREE.Scene();
    
    // Only add fog on desktop
    if (mobileConfig.enableFog) {
        scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0008);
    }
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;
    
    // Renderer with mobile optimizations
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: mobileConfig.antialias,
        powerPreference: isMobile ? "low-power" : "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(mobileConfig.pixelRatio);
    
    // Disable expensive features on mobile
    if (mobileConfig.enableShadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap; // Cheaper than PCFSoft
    }
    
    // Create space effects with mobile optimization
    createStarField();
    createNebulaCloud();
    createGalaxySpiral();
    createCosmicDust();
    createParticles();
    
    // Simplified lighting for mobile
    if (mobileConfig.enableAdvancedLighting) {
        // Desktop lighting
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
    } else {
        // Mobile lighting - single ambient light
        const ambientLight = new THREE.AmbientLight(0x6366f1, 0.8);
        scene.add(ambientLight);
    }
    
    // Animation loop
    animate();
}

function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = mobileConfig.starCount; // Reduced for mobile
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
        
        // Simplified colors for mobile
        if (isMobile) {
            // Single color for mobile
            colors[i3] = 0.8;
            colors[i3 + 1] = 0.8;
            colors[i3 + 2] = 1.0;
        } else {
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
        blending: isMobile ? THREE.NormalBlending : THREE.AdditiveBlending, // Cheaper blending for mobile
        sizeAttenuation: true
    });
    
    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

function createNebulaCloud() {
    // Reduce nebula clouds on mobile
    const cloudCount = isMobile ? 1 : 3;
    
    // Create nebula clouds
    for (let n = 0; n < cloudCount; n++) {
        const cloudGeometry = new THREE.BufferGeometry();
        const particleCount = mobileConfig.nebulaCount; // Reduced for mobile
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // Cloud center
        const centerX = (Math.random() - 0.5) * 600;
        const centerY = (Math.random() - 0.5) * 400;
        const centerZ = (Math.random() - 0.5) * 400;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Gaussian distribution for cloud-like appearance
            const spread = 100;
            positions[i3] = centerX + (Math.random() - 0.5) * spread;
            positions[i3 + 1] = centerY + (Math.random() - 0.5) * spread;
            positions[i3 + 2] = centerZ + (Math.random() - 0.5) * spread;
            
            // Simplified colors for mobile
            if (isMobile) {
                colors[i3] = 0.4;
                colors[i3 + 1] = 0.1;
                colors[i3 + 2] = 0.8;
            } else {
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
            }
            
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
            blending: isMobile ? THREE.NormalBlending : THREE.AdditiveBlending, // Cheaper blending for mobile
            sizeAttenuation: true
        });
        
        const nebula = new THREE.Points(cloudGeometry, cloudMaterial);
        nebulaClouds.push(nebula);
        scene.add(nebula);
    }
}

function createGalaxySpiral() {
    const spiralGeometry = new THREE.BufferGeometry();
    const spiralCount = mobileConfig.spiralCount; // Reduced for mobile
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
        
        // Simplified colors for mobile
        if (isMobile) {
            colors[i3] = 0.5;
            colors[i3 + 1] = 0.7;
            colors[i3 + 2] = 1.0;
        } else {
            // Galaxy colors (center bright, edges dim)
            const distanceFromCenter = radius / 350;
            const brightness = 1 - distanceFromCenter * 0.7;
            
            colors[i3] = 0.3 + brightness * 0.4;     // R
            colors[i3 + 1] = 0.5 + brightness * 0.3; // G
            colors[i3 + 2] = 0.9 + brightness * 0.1; // B
        }
    }
    
    spiralGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    spiralGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const spiralMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: isMobile ? THREE.NormalBlending : THREE.AdditiveBlending, // Cheaper blending for mobile
        sizeAttenuation: true
    });
    
    galaxySpiral = new THREE.Points(spiralGeometry, spiralMaterial);
    scene.add(galaxySpiral);
}

function createCosmicDust() {
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = mobileConfig.dustCount; // Reduced for mobile
    const positions = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);
    
    for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        
        positions[i3] = (Math.random() - 0.5) * 1500;
        positions[i3 + 1] = (Math.random() - 0.5) * 1500;
        positions[i3 + 2] = (Math.random() - 0.5) * 1500;
        
        // Simplified colors for mobile
        if (isMobile) {
            colors[i3] = 0.15;
            colors[i3 + 1] = 0.2;
            colors[i3 + 2] = 0.3;
        } else {
            // Cosmic dust colors (very subtle)
            colors[i3] = 0.1 + Math.random() * 0.1;
            colors[i3 + 1] = 0.1 + Math.random() * 0.2;
            colors[i3 + 2] = 0.2 + Math.random() * 0.2;
        }
    }
    
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const dustMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: isMobile ? THREE.NormalBlending : THREE.AdditiveBlending // Cheaper blending for mobile
    });
    
    cosmicDust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(cosmicDust);
}

function createParticles() {
    const particleCount = mobileConfig.maxParticles; // Reduced for mobile
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
        
        // Simplified velocities for mobile
        if (isMobile) {
            velocities.push({
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.1
            });
        } else {
            // Velocities for floating motion
            velocities.push({
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5,
                z: (Math.random() - 0.5) * 0.3
            });
        }
        
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
        blending: isMobile ? THREE.NormalBlending : THREE.AdditiveBlending // Cheaper blending for mobile
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
    // Show mobile performance warning if needed
    if (isOldIOS || (isMobile && navigator.hardwareConcurrency < 4)) {
        console.warn('⚠️ Mobile device detected - some features may be disabled for optimal performance');
        
        // Show user notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            max-width: 300px;
            line-height: 1.4;
        `;
        notification.textContent = 'Some advanced features are disabled on mobile devices for optimal performance.';
        document.body.appendChild(notification);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Initialize loading manager
    const loadingManager = new LoadingManager();
    
    // Initialize Three.js (with mobile optimization)
    initThree();
    
    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();
    
    // Initialize navigation
    const navigation = new Navigation();
    
    // Initialize contact form
    const contactForm = new ContactForm();
    
    // Initialize interactive elements
    const interactiveElements = new InteractiveElements();
    
    // Initialize performance monitor
    const performanceMonitor = new PerformanceMonitor();
    
    // Initialize Pokémon cards carousel
    const pokemonCarousel = new PokemonCardsCarousel();
    
    // Initialize timeline head scan viewer (simplified on mobile)
    if (!isOldIOS) {
        // Add delay to ensure Three.js loaders are ready
        setTimeout(() => {
            if (THREE && THREE.GLTFLoader) {
                const timelineViewer = new TimelineHeadScanViewer();
            } else {
                console.warn('GLTFLoader not available, skipping 3D model loading');
            }
        }, 1000); // 1 second delay to ensure all loaders are ready
    }
    
    // Initialize premium project sections (with mobile optimization)
    initializePremiumProjects();
    
    // Initialize premium Three.js backgrounds
    initializePremiumThreeJSBackgrounds();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onDocumentMouseMove);
    
    // Add custom CSS for enhanced effects
    const style = document.createElement('style');
    style.textContent = `
        .cyber-glow {
            text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff;
            animation: cyberPulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes cyberPulse {
            0% { text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff; }
            100% { text-shadow: 0 0 30px #00ffff, 0 0 60px #00ffff, 0 0 90px #00ffff; }
        }
        
        .floating-tech {
            animation: floatTech 3s ease-in-out infinite alternate;
        }
        
        @keyframes floatTech {
            0% { transform: translateY(0px) rotateX(0deg); }
            100% { transform: translateY(-20px) rotateX(5deg); }
        }
        
        .matrix-effect {
            background: linear-gradient(90deg, transparent, rgba(0,255,255,0.1), transparent);
            animation: matrixSweep 3s linear infinite;
        }
        
        @keyframes matrixSweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
            .cyber-glow {
                text-shadow: 0 0 10px #00ffff;
                animation: none;
            }
            
            .floating-tech {
                animation: none;
            }
            
            .matrix-effect {
                animation: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log(isMobile ? 
        '📱 Mobile-Optimized Portfolio Initialized' : 
        '🚀 Enhanced Portfolio Initialized'
    );
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
        // Check if GLTFLoader is available
        if (!THREE.GLTFLoader) {
            console.error('GLTFLoader is not available');
            this.onError(new Error('GLTFLoader is not available'));
            return;
        }
        
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

// Premium Project Sections Interactive Elements - Complete Overhaul with Mobile Optimization
function initializePremiumProjects() {
    // Skip complex premium features on very old devices
    if (isOldIOS && navigator.hardwareConcurrency < 4) {
        console.warn('Skipping premium features on low-performance device');
        return;
    }
    
    // Initialize Advanced 3D Drone Viewport (simplified on mobile)
    const droneViewport = document.getElementById('drone-3d-viewport');
    if (droneViewport) {
        initAdvancedDroneViewport(droneViewport);
    }
    
    // Initialize Advanced Audio Visualizer (simplified on mobile)
    const podcastVisualizer = document.getElementById('podcast-visualizer');
    if (podcastVisualizer) {
        initAdvancedAudioVisualizer(podcastVisualizer);
    }
    
    // Initialize Premium Card Animations
    initPremiumCardAnimations();
    
    // Initialize Neural Network Background (only on desktop)
    if (mobileConfig.enableNeuralBackground) {
        initNeuralNetworkBackground();
    }
    
    // Initialize Audio Wave Background (only on desktop)
    if (mobileConfig.enableAudioBackground) {
        initAudioWaveBackground();
    }
}

// Advanced 3D Drone Viewport with Neural Network Visualization
function initAdvancedDroneViewport(container) {
    const loadingElement = container.querySelector('.viewport-loading');
    const controls = container.querySelector('.viewport-controls');
    
    // Create Three.js scene with mobile optimization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: mobileConfig.antialias,
        powerPreference: isMobile ? "low-power" : "high-performance"
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(mobileConfig.pixelRatio);
    
    // Only enable shadows on desktop
    if (mobileConfig.enableShadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap; // Cheaper than PCFSoft
    }
    
    // Disable expensive post-processing on mobile
    if (!isMobile) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
    }
    
    // Optimized lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, isMobile ? 0.8 : 0.4);
    scene.add(ambientLight);
    
    if (mobileConfig.enableAdvancedLighting) {
        // Desktop lighting
        const directionalLight = new THREE.DirectionalLight(0x6366f1, 1);
        directionalLight.position.set(5, 5, 5);
        
        if (mobileConfig.enableShadows) {
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = mobileConfig.shadowMapSize;
            directionalLight.shadow.mapSize.height = mobileConfig.shadowMapSize;
        }
        scene.add(directionalLight);
        
        const pointLight1 = new THREE.PointLight(0x06b6d4, 0.8, 100);
        pointLight1.position.set(-10, 10, 10);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.6, 100);
        pointLight2.position.set(10, -10, -10);
        scene.add(pointLight2);
    } else {
        // Mobile lighting - single directional light
        const directionalLight = new THREE.DirectionalLight(0x6366f1, 1.2);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
    }
    
    // Removed Gaussian splat visualization to prevent interference
    
    camera.position.z = 8;
    
    // Animation variables
    let gaussianFocus = false;
    let depthAnalysis = false;
    let animationId;
    
    // Animation loop with mobile optimization
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        // Removed Gaussian splat animation code
        
        renderer.render(scene, camera);
    }
    
    // Add renderer to container
    container.appendChild(renderer.domElement);
    
    // Hide loading screen
    setTimeout(() => {
        loadingElement.style.display = 'none';
        animate();
    }, 1500);
    
    // Handle controls
    controls.addEventListener('click', (e) => {
        const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;
        
        switch (action) {
            case 'gaussian-focus':
                gaussianFocus = !gaussianFocus;
                break;
            case 'depth-analysis':
                depthAnalysis = !depthAnalysis;
                break;
            case 'reset-view':
                camera.position.set(0, 0, 8);
                gaussianFocus = false;
                depthAnalysis = false;
                break;
        }
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Cleanup
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        renderer.dispose();
    };
}

// Advanced Audio Visualizer with Neural Processing
function initAdvancedAudioVisualizer(container) {
    const loadingElement = container.querySelector('.visualizer-loading');
    const controls = container.querySelector('.visualizer-controls');
    
    // Create Three.js scene with mobile optimization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: mobileConfig.antialias,
        powerPreference: isMobile ? "low-power" : "high-performance"
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(mobileConfig.pixelRatio);
    
    // Only enable shadows on desktop
    if (mobileConfig.enableShadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap; // Cheaper than PCFSoft
    }
    
    // Optimized lighting for audio visualization
    const ambientLight = new THREE.AmbientLight(0x2d1b4e, isMobile ? 0.6 : 0.3);
    scene.add(ambientLight);
    
    if (mobileConfig.enableAdvancedLighting) {
        // Desktop lighting
        const directionalLight = new THREE.DirectionalLight(0x9333ea, 1);
        directionalLight.position.set(3, 3, 3);
        scene.add(directionalLight);
        
        const pointLight1 = new THREE.PointLight(0xec4899, 0.8, 50);
        pointLight1.position.set(-5, 5, 5);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xa855f7, 0.6, 50);
        pointLight2.position.set(5, -5, -5);
        scene.add(pointLight2);
    } else {
        // Mobile lighting - single directional light
        const directionalLight = new THREE.DirectionalLight(0x9333ea, 1.5);
        directionalLight.position.set(3, 3, 3);
        scene.add(directionalLight);
    }
    
    // Create visualization elements
    const visualizationGroup = new THREE.Group();
    let currentMode = 'spectrum';
    let animationId;
    
    // Spectrum visualization
    function createSpectrumVisualization() {
        const group = new THREE.Group();
        const barGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
        const barMaterial = new THREE.MeshStandardMaterial({
            color: 0x9333ea,
            emissive: 0x9333ea,
            emissiveIntensity: 0.3
        });
        
        const bars = [];
        for (let i = 0; i < 64; i++) {
            const bar = new THREE.Mesh(barGeometry, barMaterial.clone());
            const angle = (i / 64) * Math.PI * 2;
            const radius = 3;
            bar.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            bar.userData = { baseHeight: 1, index: i };
            bars.push(bar);
            group.add(bar);
        }
        
        group.userData = { bars, type: 'spectrum' };
        return group;
    }
    
    // Waveform visualization
    function createWaveformVisualization() {
        const group = new THREE.Group();
        const waveGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const waveMaterial = new THREE.MeshStandardMaterial({
            color: 0xec4899,
            emissive: 0xec4899,
            emissiveIntensity: 0.4
        });
        
        const wavePoints = [];
        for (let i = 0; i < 128; i++) {
            const point = new THREE.Mesh(waveGeometry, waveMaterial.clone());
            point.position.set(
                (i - 64) * 0.1,
                0,
                0
            );
            point.userData = { baseY: 0, index: i };
            wavePoints.push(point);
            group.add(point);
        }
        
        group.userData = { wavePoints, type: 'waveform' };
        return group;
    }
    
    // Circular visualization
    function createCircularVisualization() {
        const group = new THREE.Group();
        
        // Create concentric rings
        for (let ring = 0; ring < 5; ring++) {
            const ringGeometry = new THREE.TorusGeometry(1 + ring * 0.8, 0.02, 8, 32);
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.8 - ring * 0.1, 0.8, 0.6),
                emissive: new THREE.Color().setHSL(0.8 - ring * 0.1, 0.8, 0.3),
                emissiveIntensity: 0.2
            });
            
            const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            ringMesh.userData = { ring, baseScale: 1 };
            group.add(ringMesh);
        }
        
        group.userData = { type: 'circular' };
        return group;
    }
    
    // Neural visualization
    function createNeuralVisualization() {
        const group = new THREE.Group();
        
        // Create neural network structure
        const nodeGeometry = new THREE.SphereGeometry(0.08, 12, 12);
        const nodeMaterial = new THREE.MeshStandardMaterial({
            color: 0xa855f7,
            emissive: 0xa855f7,
            emissiveIntensity: 0.3
        });
        
        const nodes = [];
        const layers = [6, 10, 14, 10, 6];
        
        layers.forEach((nodeCount, layerIndex) => {
            for (let i = 0; i < nodeCount; i++) {
                const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
                const angle = (i / nodeCount) * Math.PI * 2;
                const radius = 1.5 + layerIndex * 0.3;
                node.position.set(
                    Math.cos(angle) * radius,
                    (i - nodeCount / 2) * 0.2,
                    layerIndex * 1.5 - 3
                );
                node.userData = { layer: layerIndex, index: i };
                nodes.push(node);
                group.add(node);
            }
        });
        
        group.userData = { nodes, type: 'neural' };
        return group;
    }
    
    // Initialize with spectrum mode
    let currentVisualization = createSpectrumVisualization();
    visualizationGroup.add(currentVisualization);
    scene.add(visualizationGroup);
    
    camera.position.z = 8;
    
    // Animation loop
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update visualization based on mode
        if (currentVisualization.userData.type === 'spectrum') {
            currentVisualization.userData.bars.forEach((bar, index) => {
                const frequency = Math.sin(time * 2 + index * 0.2) * 0.5 + 0.5;
                bar.scale.y = 0.2 + frequency * 2;
                bar.material.emissiveIntensity = 0.1 + frequency * 0.5;
            });
        } else if (currentVisualization.userData.type === 'waveform') {
            currentVisualization.userData.wavePoints.forEach((point, index) => {
                const wave = Math.sin(time * 3 + index * 0.1) * 2;
                point.position.y = wave;
                point.material.emissiveIntensity = 0.2 + Math.abs(wave) * 0.3;
            });
        } else if (currentVisualization.userData.type === 'circular') {
            currentVisualization.children.forEach((ring, index) => {
                const pulse = Math.sin(time * (2 + index * 0.5)) * 0.3 + 1;
                ring.scale.setScalar(pulse);
                ring.material.emissiveIntensity = 0.1 + pulse * 0.2;
                ring.rotation.z += 0.01 * (index + 1);
            });
        } else if (currentVisualization.userData.type === 'neural') {
            currentVisualization.userData.nodes.forEach((node, index) => {
                const activation = Math.sin(time * 1.5 + index * 0.3) * 0.5 + 0.5;
                node.material.emissiveIntensity = 0.1 + activation * 0.4;
                node.scale.setScalar(0.8 + activation * 0.4);
            });
        }
        
        // Global rotation
        visualizationGroup.rotation.y += 0.003;
        
        renderer.render(scene, camera);
    }
    
    // Add renderer to container
    container.appendChild(renderer.domElement);
    
    // Hide loading screen
    setTimeout(() => {
        loadingElement.style.display = 'none';
        animate();
    }, 1200);
    
    // Handle mode switching
    function switchMode(mode) {
        if (mode === currentMode) return;
        
        currentMode = mode;
        
        // Remove current visualization
        visualizationGroup.remove(currentVisualization);
        
        // Create new visualization
        switch (mode) {
            case 'spectrum':
                currentVisualization = createSpectrumVisualization();
                break;
            case 'waveform':
                currentVisualization = createWaveformVisualization();
                break;
            case 'circular':
                currentVisualization = createCircularVisualization();
                break;
            case 'neural':
                currentVisualization = createNeuralVisualization();
                break;
        }
        
        visualizationGroup.add(currentVisualization);
        
        // Update active button
        controls.querySelectorAll('.control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        controls.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    }
    
    // Handle controls
    controls.addEventListener('click', (e) => {
        const mode = e.target.dataset.mode || e.target.closest('[data-mode]')?.dataset.mode;
        if (mode) {
            switchMode(mode);
        }
    });
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Cleanup
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        renderer.dispose();
    };
}

// Premium Card Animations
function initPremiumCardAnimations() {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        // Add entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
        
        // Add hover tracking
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Neural Network Background Animation
function initNeuralNetworkBackground() {
    const droneSection = document.querySelector('.drone-project');
    if (!droneSection) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '2';
    canvas.style.opacity = '0.3';
    
    const background = droneSection.querySelector('.neural-network-bg');
    background.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resizeCanvas() {
        canvas.width = droneSection.clientWidth;
        canvas.height = droneSection.clientHeight;
    }
    
    resizeCanvas();
    
    // Neural network nodes
    const nodes = [];
    const connections = [];
    
    for (let i = 0; i < 50; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2
        });
    }
    
    function updateNodes() {
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            node.opacity = 0.2 + Math.sin(Date.now() * 0.001 + node.x * 0.01) * 0.3;
        });
    }
    
    function drawNodes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;
        
        nodes.forEach((node, i) => {
            nodes.slice(i + 1).forEach(otherNode => {
                const dx = node.x - otherNode.x;
                const dy = node.y - otherNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.stroke();
                }
            });
        });
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${node.opacity})`;
            ctx.fill();
        });
    }
    
    function animate() {
        animationId = requestAnimationFrame(animate);
        updateNodes();
        drawNodes();
    }
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        window.removeEventListener('resize', resizeCanvas);
    };
}

// Audio Wave Background Animation
function initAudioWaveBackground() {
    const podcastSection = document.querySelector('.podcast-project');
    if (!podcastSection) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '2';
    canvas.style.opacity = '0.4';
    
    const background = podcastSection.querySelector('.audio-wave-bg');
    background.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resizeCanvas() {
        canvas.width = podcastSection.clientWidth;
        canvas.height = podcastSection.clientHeight;
    }
    
    resizeCanvas();
    
    // Audio wave parameters
    const waves = [];
    for (let i = 0; i < 5; i++) {
        waves.push({
            amplitude: Math.random() * 50 + 20,
            frequency: Math.random() * 0.02 + 0.01,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.01,
            color: `hsl(${280 + i * 10}, 70%, 60%)`,
            opacity: 0.3 - i * 0.05
        });
    }
    
    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const time = Date.now() * 0.001;
        
        waves.forEach(wave => {
            ctx.beginPath();
            ctx.strokeStyle = wave.color;
            ctx.globalAlpha = wave.opacity;
            ctx.lineWidth = 2;
            
            for (let x = 0; x < canvas.width; x += 2) {
                const y = canvas.height / 2 + 
                    Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        });
        
        ctx.globalAlpha = 1;
    }
    
    function animate() {
        animationId = requestAnimationFrame(animate);
        drawWaves();
    }
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        window.removeEventListener('resize', resizeCanvas);
    };
}

// Premium Three.js Backgrounds
function initializePremiumThreeJSBackgrounds() {
    initDroneProjectBackground();
    initPodcastProjectBackground();
}

function initDroneProjectBackground() {
    const container = document.getElementById('drone-threejs-bg');
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Neural network nodes
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1, 
        transparent: true,
        opacity: 0.8
    });
    
    const nodes = [];
    const connections = [];
    
    // Create network of interconnected nodes
    for (let i = 0; i < 150; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        node.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        
        // Add pulsing animation data
        node.userData = {
            originalOpacity: Math.random() * 0.5 + 0.3,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        nodes.push(node);
        scene.add(node);
    }
    
    // Create connections between nearby nodes
    const connectionMaterial = new THREE.LineBasicMaterial({ 
        color: 0x06b6d4, 
        transparent: true,
        opacity: 0.3
    });
    
    nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
            const distance = node.position.distanceTo(otherNode.position);
            if (distance < 4) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    node.position,
                    otherNode.position
                ]);
                const line = new THREE.Line(geometry, connectionMaterial.clone());
                line.userData = {
                    pulseSpeed: Math.random() * 0.01 + 0.005,
                    pulsePhase: Math.random() * Math.PI * 2
                };
                connections.push(line);
                scene.add(line);
            }
        });
    });
    
    // Add gaussian splat particles
    const splatGeometry = new THREE.BufferGeometry();
    const splatPositions = new Float32Array(500 * 3);
    const splatColors = new Float32Array(500 * 3);
    
    for (let i = 0; i < 500; i++) {
        const i3 = i * 3;
        splatPositions[i3] = (Math.random() - 0.5) * 30;
        splatPositions[i3 + 1] = (Math.random() - 0.5) * 30;
        splatPositions[i3 + 2] = (Math.random() - 0.5) * 30;
        
        const hue = Math.random() * 0.2 + 0.6; // Blue to cyan hues
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        splatColors[i3] = color.r;
        splatColors[i3 + 1] = color.g;
        splatColors[i3 + 2] = color.b;
    }
    
    splatGeometry.setAttribute('position', new THREE.BufferAttribute(splatPositions, 3));
    splatGeometry.setAttribute('color', new THREE.BufferAttribute(splatColors, 3));
    
    const splatMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const splatPoints = new THREE.Points(splatGeometry, splatMaterial);
    scene.add(splatPoints);
    
    // Complex geometry (dodecahedron wireframe)
    const dodecaGeometry = new THREE.DodecahedronGeometry(8, 1);
    const dodecaMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1, 
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const dodecahedron = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    scene.add(dodecahedron);
    
    // Position camera
    camera.position.set(0, 0, 15);
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Animate nodes
        nodes.forEach(node => {
            const userData = node.userData;
            const pulse = Math.sin(time * userData.pulseSpeed + userData.pulsePhase) * 0.3 + 0.7;
            node.material.opacity = userData.originalOpacity * pulse;
            node.scale.setScalar(pulse);
        });
        
        // Animate connections
        connections.forEach(line => {
            const userData = line.userData;
            const pulse = Math.sin(time * userData.pulseSpeed + userData.pulsePhase) * 0.2 + 0.3;
            line.material.opacity = pulse;
        });
        
        // Rotate gaussian splats
        splatPoints.rotation.x += 0.001;
        splatPoints.rotation.y += 0.002;
        
        // Rotate dodecahedron
        dodecahedron.rotation.x += 0.005;
        dodecahedron.rotation.y += 0.003;
        
        // Subtle camera movement
        camera.position.x = Math.sin(time * 0.1) * 2;
        camera.position.y = Math.cos(time * 0.1) * 2;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animate();
    
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        renderer.dispose();
    };
}

function initPodcastProjectBackground() {
    const container = document.getElementById('podcast-threejs-bg');
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Audio waveform rings
    const waveformRings = [];
    for (let i = 0; i < 20; i++) {
        const geometry = new THREE.RingGeometry(2 + i * 0.5, 2.2 + i * 0.5, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(0.8 + i * 0.01, 0.8, 0.6),
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.position.z = -i * 0.5;
        ring.userData = {
            originalOpacity: 0.3,
            pulseSpeed: 0.05 + i * 0.002,
            pulsePhase: i * 0.3
        };
        waveformRings.push(ring);
        scene.add(ring);
    }
    
    // Frequency spectrum bars
    const spectrumBars = [];
    const barGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    
    for (let i = 0; i < 64; i++) {
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(0.8, 0.8, 0.4 + Math.random() * 0.4),
            transparent: true,
            opacity: 0.7
        });
        const bar = new THREE.Mesh(barGeometry, material);
        
        const angle = (i / 64) * Math.PI * 2;
        const radius = 8;
        bar.position.x = Math.cos(angle) * radius;
        bar.position.z = Math.sin(angle) * radius;
        bar.position.y = -2;
        
        bar.userData = {
            originalHeight: 1,
            pulseSpeed: 0.1 + Math.random() * 0.1,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        spectrumBars.push(bar);
        scene.add(bar);
    }
    
    // Microphone particles
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(200 * 3);
    const particleColors = new Float32Array(200 * 3);
    
    for (let i = 0; i < 200; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 20;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 20;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 20;
        
        const hue = 0.8 + Math.random() * 0.1; // Purple to pink hues
        const color = new THREE.Color().setHSL(hue, 0.9, 0.7);
        particleColors[i3] = color.r;
        particleColors[i3 + 1] = color.g;
        particleColors[i3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Complex geometry (icosahedron wireframe)
    const icosaGeometry = new THREE.IcosahedronGeometry(6, 1);
    const icosaMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x9333ea, 
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const icosahedron = new THREE.Mesh(icosaGeometry, icosaMaterial);
    scene.add(icosahedron);
    
    // Position camera
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Animate waveform rings
        waveformRings.forEach((ring, index) => {
            const userData = ring.userData;
            const pulse = Math.sin(time * userData.pulseSpeed + userData.pulsePhase) * 0.5 + 0.5;
            ring.material.opacity = userData.originalOpacity * pulse;
            ring.scale.setScalar(0.8 + pulse * 0.4);
            ring.rotation.z += 0.01 * (index % 2 === 0 ? 1 : -1);
        });
        
        // Animate spectrum bars
        spectrumBars.forEach(bar => {
            const userData = bar.userData;
            const height = Math.sin(time * userData.pulseSpeed + userData.pulsePhase) * 3 + 4;
            bar.scale.y = height;
            bar.position.y = height / 2 - 2;
        });
        
        // Rotate particles
        particles.rotation.x += 0.002;
        particles.rotation.y += 0.001;
        
        // Rotate icosahedron
        icosahedron.rotation.x += 0.003;
        icosahedron.rotation.y += 0.004;
        
        // Subtle camera movement
        camera.position.x = Math.sin(time * 0.05) * 3;
        camera.position.z = 12 + Math.cos(time * 0.05) * 2;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    animate();
    
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        renderer.dispose();
    };
}