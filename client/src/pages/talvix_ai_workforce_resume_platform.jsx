import React, { useState, useEffect, useRef } from "react";

// Embedded CSS styles for glassmorphism, animations, and radial auroras
const CustomStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    body {
      background-color: #07090e;
      color: #f3f4f6;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow-x: hidden;
    }

    .glass-panel {
      background: rgba(22, 28, 39, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .glass-card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(16, 185, 129, 0.3);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px -10px rgba(16, 185, 129, 0.25);
    }

    .glow-button {
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }

    .glow-button:hover {
      box-shadow: 0 0 35px rgba(16, 185, 129, 0.6);
      transform: translateY(-2px);
    }

    .gradient-text {
      background: linear-gradient(135deg, #ffffff 0%, #a7f3d0 50%, #10b981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .bg-grid-pattern {
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }

    .radial-aurora {
      background: radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, rgba(7, 9, 14, 0) 70%);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }

    @keyframes pulseSlow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    .animate-pulse-slow {
      animation: pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #07090e;
    }
    ::-webkit-scrollbar-thumb {
      background: #1e293b;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #10b981;
    }
  `}</style>
);

// 3D Interactive Mesh Component using Three.js inside React
const InteractiveSphere3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let renderer, scene, camera, mainMesh, coreMesh, particlesMesh;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const initThree = () => {
      const container = containerRef.current;
      if (!container || !window.THREE) return;

      const THREE = window.THREE;
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000,
      );
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Clean old canvas if re-rendered
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // Main Icosahedron Wireframe
      const geometry = new THREE.IcosahedronGeometry(1.8, 2);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        emissive: 0x047857,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
      mainMesh = new THREE.Mesh(geometry, material);
      scene.add(mainMesh);

      // Inner Core Sphere
      const coreGeometry = new THREE.SphereGeometry(1.0, 32, 32);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        wireframe: false,
      });
      coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      scene.add(coreMesh);

      // Background Particle Field
      const particlesCount = 200;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 12;
      }

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x34d399,
        transparent: true,
        opacity: 0.6,
      });
      particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particlesMesh);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x00f2fe, 2, 50);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x10b981, 2, 50);
      pointLight2.position.set(-5, -5, -5);
      scene.add(pointLight2);

      // Mouse & Touch Drag Interaction Listeners
      const handleMouseDown = (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      const handleMouseMove = (e) => {
        if (isDragging && mainMesh) {
          const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y,
          };
          mainMesh.rotation.y += deltaMove.x * 0.008;
          mainMesh.rotation.x += deltaMove.y * 0.008;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        }
      };

      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }
      };

      const handleTouchMove = (e) => {
        if (isDragging && e.touches.length === 1 && mainMesh) {
          const deltaMove = {
            x: e.touches[0].clientX - previousMousePosition.x,
            y: e.touches[0].clientY - previousMousePosition.y,
          };
          mainMesh.rotation.y += deltaMove.x * 0.008;
          mainMesh.rotation.x += deltaMove.y * 0.008;
          previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }
      };

      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleMouseUp);
      container.addEventListener("touchmove", handleTouchMove);

      // Animation Render Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isDragging && mainMesh && particlesMesh) {
          mainMesh.rotation.y += 0.004;
          mainMesh.rotation.x += 0.002;
          particlesMesh.rotation.y -= 0.001;
        }

        if (coreMesh) {
          const time = Date.now() * 0.002;
          const scale = 0.95 + Math.sin(time) * 0.08;
          coreMesh.scale.set(scale, scale, scale);
        }

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", handleResize);
      };
    };

    // Load Three.js dynamically if not already available
    if (window.THREE) {
      initThree();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.async = true;
      script.onload = () => initThree();
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative"
    >
      <div className="absolute top-4 left-4 z-20 pointer-events-none bg-[#07090e]/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-gray-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Interactive 3D Sphere - Drag to rotate</span>
      </div>
    </div>
  );
};

// Announcement Bar Component
const AnnouncementBar = () => (
  <div className="relative z-50 bg-gradient-to-r from-emerald-950/80 via-[#0f141c] to-emerald-950/80 border-b border-emerald-500/20 py-2.5 px-4 text-center text-xs font-medium">
    <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider animate-pulse">
        NEW v3.2
      </span>
      <span className="text-gray-300">
        AI Resume Optimizer with Live ATS Matching is here!
      </span>
      <a
        href="#pricing"
        className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
      >
        Try Interactive Demo{" "}
        <i className="fa-solid fa-arrow-right text-[10px]"></i>
      </a>
    </div>
  </div>
);

// Navbar Component
const Navbar = ({ onOpenModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 backdrop-blur-xl bg-[#07090e]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#07090e] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-all duration-300">
              <i className="fa-solid fa-bolt text-emerald-400 group-hover:text-white transition-colors"></i>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-wider text-white font-sans flex items-center gap-1">
              TALVIX
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </span>
            <span className="text-[9px] text-gray-400 tracking-widest uppercase font-semibold">
              Career Intelligence
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a
            href="#features"
            className="hover:text-emerald-400 transition-colors py-1"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="hover:text-emerald-400 transition-colors py-1"
          >
            Success Stories
          </a>
          <a
            href="#pricing"
            className="hover:text-emerald-400 transition-colors py-1"
          >
            Pricing
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <a
            href="#pricing"
            className="hidden sm:inline-flex text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </a>
          <a
            href="#pricing"
            className="glow-button bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#07090e] font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-center gap-2"
          >
            <span>Get Started</span>
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white text-xl p-2 focus:outline-none"
          >
            <i
              className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`}
            ></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0f141c]/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-emerald-400 text-base font-medium"
          >
            Features
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-emerald-400 text-base font-medium"
          >
            Success Stories
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-emerald-400 text-base font-medium"
          >
            Pricing
          </a>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-emerald-500 text-[#07090e] font-bold py-3 rounded-xl"
            >
              Get Started Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

// Hero Section Component
const HeroSection = ({ onOpenModal }) => (
  <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Hero Left Text & CTAs */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
          {/* Rating Pill */}
          <div className="inline-flex items-center gap-3 glass-card px-4 py-2 rounded-full border border-white/10 shadow-inner">
            <div className="flex -space-x-2">
              <img
                className="w-7 h-7 rounded-full border-2 border-[#07090e] object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="User Avatar"
              />
              <img
                className="w-7 h-7 rounded-full border-2 border-[#07090e] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="User Avatar"
              />
              <img
                className="w-7 h-7 rounded-full border-2 border-[#07090e] object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="User Avatar"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
              <div className="flex text-amber-400 text-xs">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <span className="text-white font-bold">4.9/5</span>
              <span className="text-gray-400 hidden sm:inline">
                • Trusted by 25,000+ professionals
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Land your dream job with{" "}
            <span className="gradient-text">AI-powered</span> career
            intelligence.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Create, optimize, and tailor professional resumes engineered for top
            ATS algorithms in seconds with TALVIX smart assistant.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href="#pricing"
              className="glow-button w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-[#07090e] font-extrabold px-8 py-4 rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>Get Started Free</span>
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </a>

            <button
              onClick={onOpenModal}
              className="glass-card w-full sm:w-auto text-white font-semibold px-7 py-4 rounded-xl text-base hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-play text-xs pl-0.5"></i>
              </div>
              <span>Watch 3D Showcase</span>
            </button>
          </div>

          {/* Micro Details */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-check text-emerald-400"></i> No Credit
              Card Required
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-check text-emerald-400"></i> Instant ATS
              Score
            </span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-check text-emerald-400"></i> 100% Secure
              & Private
            </span>
          </div>
        </div>

        {/* Hero Right 3D Interactive Mesh Box */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/20 rounded-full blur-[90px] -z-10 animate-pulse-slow"></div>

          <div className="relative w-full aspect-square max-w-[500px] rounded-3xl glass-panel p-2 overflow-hidden border border-emerald-500/20 shadow-2xl">
            {/* 3D Canvas Box */}
            <InteractiveSphere3D />

            {/* Floating Metric Badge 1 */}
            <div className="absolute top-8 right-6 glass-card p-3.5 rounded-2xl max-w-[190px] border border-emerald-500/30 shadow-xl animate-float pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <i className="fa-solid fa-chart-line text-sm"></i>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    ATS Score
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    98.4% Match
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Metric Badge 2 */}
            <div
              className="absolute bottom-8 left-6 glass-card p-3.5 rounded-2xl max-w-[210px] border border-blue-500/30 shadow-xl animate-float pointer-events-none"
              style={{ animationDelay: "-3s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    AI Enhancement
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Keyword Tailored for Tech Lead
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Brand Logos Section
const BrandLogos = () => (
  <section className="border-y border-white/5 bg-[#0f141c]/40 py-10 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
        Trusted by job seekers hired at industry leaders including
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2 font-bold text-gray-300 text-lg hover:text-white">
          <i className="fa-brands fa-microsoft text-2xl text-blue-400"></i>{" "}
          Microsoft
        </div>
        <div className="flex items-center gap-2 font-bold text-gray-300 text-lg hover:text-white">
          <i className="fa-brands fa-google text-2xl text-red-400"></i> Google
        </div>
        <div className="flex items-center gap-2 font-bold text-gray-300 text-lg hover:text-white">
          <i className="fa-brands fa-amazon text-2xl text-amber-400"></i> Amazon
        </div>
        <div className="flex items-center gap-2 font-bold text-gray-300 text-lg hover:text-white">
          <i className="fa-brands fa-spotify text-2xl text-emerald-400"></i>{" "}
          Spotify
        </div>
        <div className="flex items-center gap-2 font-bold text-gray-300 text-lg hover:text-white">
          <i className="fa-brands fa-meta text-2xl text-blue-500"></i> Meta
        </div>
        <div className="flex items-center gap-2 font-bold text-gray-300 text-lg hover:text-white">
          <i className="fa-brands fa-apple text-2xl text-gray-200"></i> Apple
        </div>
      </div>
    </div>
  </section>
);

// Features Section Component
const FeaturesSection = () => (
  <section id="features" className="py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
          <i className="fa-solid fa-sparkles"></i> Simple & Powerful Process
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Build your job-winning resume with intelligent precision
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">
          Our streamlined AI engine analyzes employer job descriptions and
          generates optimized resumes formatted to beat Applicant Tracking
          Systems (ATS).
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="glass-card p-8 rounded-3xl relative group overflow-hidden border border-white/5 hover:border-emerald-500/30">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-[#07090e] transition-all duration-300">
            <i className="fa-solid fa-microchip"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Real-Time ATS Analytics
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Get instant score feedback matching your resume against recruiter
            search algorithms before hitting apply.
          </p>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
              Instant Keyword Parsing
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
              Format & Typography Check
            </li>
          </ul>
        </div>

        {/* Feature 2 */}
        <div className="glass-card p-8 rounded-3xl relative group overflow-hidden border border-white/5 hover:border-emerald-500/30">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-[#07090e] transition-all duration-300">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Bank-Grade Privacy
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            End-to-end encryption guarantees your career history, personal
            contact info, and metrics remain 100% private.
          </p>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
              SOC-2 Compliant Architecture
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-emerald-400"></i> Zero
              Data Selling
            </li>
          </ul>
        </div>

        {/* Feature 3 */}
        <div className="glass-card p-8 rounded-3xl relative group overflow-hidden border border-white/5 hover:border-emerald-500/30">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-2xl mb-6 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-[#07090e] transition-all duration-300">
            <i className="fa-solid fa-file-export"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Customizable Exports
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Export pixel-perfect PDF, Word, or shareable web-ready links with
            custom portfolio integrations in one click.
          </p>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
              Clean Vector PDFs
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-emerald-400"></i>{" "}
              Multi-column Layout Support
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// Testimonials Section Component
const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
          <i className="fa-solid fa-heart"></i> Wall of Love
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Don't just take our words for it
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">
          See how candidates secured dream offers at top tech, finance, and
          creative companies using TALVIX.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Testimonial 1 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-emerald-500/30">
          <div className="space-y-4">
            <div className="flex text-amber-400 text-xs">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              "TALVIX completely transformed my stagnant resume. Within 2 weeks
              of applying with the AI-optimized format, I landed interviews at
              Microsoft and Stripe!"
            </p>
          </div>
          <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Evelyn Chen"
              className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
            />
            <div>
              <div class="text-sm font-bold text-white flex items-center gap-1">
                Evelyn Chen{" "}
                <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
              </div>
              <div className="text-xs text-gray-400">
                Senior Product Designer at Meta
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-emerald-500/30">
          <div className="space-y-4">
            <div className="flex text-amber-400 text-xs">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              "The ATS live score checker is a game changer. I used to send
              hundreds of applications into the void—now 4 out of 5 lead to
              initial recruiter phone screens."
            </p>
          </div>
          <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="Avery Johnson"
              className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                Avery Johnson{" "}
                <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
              </div>
              <div className="text-xs text-gray-400">
                Staff Backend Engineer at Uber
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-emerald-500/30">
          <div className="space-y-4">
            <div className="flex text-amber-400 text-xs">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              "Super clean UI and incredibly fast. The bullet point generator
              helped me articulate metrics I couldn't summarize on my own. Worth
              every penny."
            </p>
          </div>
          <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
              alt="Marcus Lee"
              className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                Marcus Lee{" "}
                <i className="fa-solid fa-circle-check text-emerald-400 text-xs"></i>
              </div>
              <div className="text-xs text-gray-400">
                Head of Growth at Techstars
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Pricing Section Component
const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="py-24 bg-[#0f141c]/30 border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <i className="fa-solid fa-tag"></i> Flexible Plans
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Invest in your next big career move
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Choose the plan that fits your career goals. Upgrade or cancel
            anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="text-sm font-medium text-gray-300">Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-emerald-500/30 border border-emerald-500 p-1 flex items-center transition-all cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full bg-emerald-400 transition-transform ${isAnnual ? "translate-x-6" : "translate-x-0"}`}
              ></div>
            </button>
            <span className="text-sm font-medium text-white flex items-center gap-2">
              Annual
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Starter Plan */}
          <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-lg font-bold text-white mb-2">Starter</div>
              <p className="text-xs text-gray-400 mb-6">
                Perfect for building your first AI-optimized resume.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-gray-400 text-sm">/ forever</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i> 1
                  Active AI Resume
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i> Basic
                  ATS Match Score
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i>{" "}
                  Standard PDF Export
                </li>
                <li className="flex items-center gap-2 text-gray-500">
                  <i className="fa-solid fa-xmark"></i> Unlimited AI Rewrites
                </li>
              </ul>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl text-sm transition-colors">
              Start Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="glass-panel p-8 rounded-3xl border-2 border-emerald-500 relative flex flex-col justify-between shadow-2xl scale-105 z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#07090e] font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Most Popular
            </div>
            <div>
              <div className="text-lg font-bold text-white mb-2">
                Pro Career
              </div>
              <p className="text-xs text-gray-400 mb-6">
                For active job seekers looking for maximum interview invites.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? "$15" : "$19"}
                </span>
                <span className="text-gray-400 text-sm">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i>{" "}
                  Unlimited AI Resumes & Cover Letters
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i>{" "}
                  Advanced Real-time ATS Analytics
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i>{" "}
                  Unlimited AI Bullet Rewrites
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i> PDF,
                  Word & Web Link Exports
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i> 1-on-1
                  AI Career Coach Assistant
                </li>
              </ul>
            </div>
            <button className="glow-button w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-[#07090e] font-extrabold py-3.5 rounded-xl text-sm transition-all">
              Upgrade to Pro
            </button>
          </div>

          {/* Executive Plan */}
          <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
            <div>
              <div className="text-lg font-bold text-white mb-2">Executive</div>
              <p className="text-xs text-gray-400 mb-6">
                For senior leaders & executive level role transitions.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? "$39" : "$49"}
                </span>
                <span className="text-gray-400 text-sm">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i>{" "}
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i> Human
                  Resume Expert Review
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i>{" "}
                  LinkedIn Profile Optimization
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-400"></i>{" "}
                  Priority 24/7 VIP Support
                </li>
              </ul>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl text-sm transition-colors">
              Contact Executive Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA Banner Component
const CtaBanner = () => (
  <section className="py-20 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-3xl p-10 sm:p-16 border border-emerald-500/30 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 relative z-10 leading-tight">
          Build a Professional Resume That Helps You{" "}
          <br className="hidden sm:inline" />
          Stand Out and Get Hired.
        </h2>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 relative z-10">
          Join over 25,000 job seekers who accelerated their careers using
          TALVIX AI engine.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <a
            href="#pricing"
            className="glow-button bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-[#07090e] font-extrabold px-8 py-4 rounded-xl text-base transition-all flex items-center gap-3"
          >
            <span>Get Started Now</span>
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="border-t border-white/5 bg-[#07090e] py-16 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Brand Info */}
        <div className="col-span-2 space-y-4">
          <a href="#" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-[#07090e] font-bold">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <span className="text-xl font-extrabold text-white tracking-wider">
              TALVIX
            </span>
          </a>
          <p className="text-gray-400 text-xs sm:text-sm max-w-sm leading-relaxed">
            Making every job application tailored, targeted, and powerful so no
            matter the competition, your talent gets noticed.
          </p>
          <div className="flex gap-4 pt-2 text-gray-400 text-base">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              <i className="fa-brands fa-discord"></i>
            </a>
          </div>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Product
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li>
              <a
                href="#features"
                className="hover:text-emerald-400 transition-colors"
              >
                AI Resume Builder
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="hover:text-emerald-400 transition-colors"
              >
                ATS Checker
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="hover:text-emerald-400 transition-colors"
              >
                Cover Letter Generator
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="hover:text-emerald-400 transition-colors"
              >
                Pricing Plans
              </a>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Resources
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Career Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Resume Templates
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                ATS Guide 2026
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Legal
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Security
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Cookie Settings
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div>&copy; 2026 TALVIX AI Inc. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-400">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-400">
            Terms
          </a>
          <a href="#" className="hover:text-gray-400">
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// Video / Interactive Showcase Modal Component
const DemoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/10 p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-play text-emerald-400 text-xs"></i> TALVIX
            Platform Overview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg p-1"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="aspect-video bg-[#07090e] rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-white/5 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4 border border-emerald-500/40 animate-pulse">
            <i className="fa-solid fa-circle-play"></i>
          </div>
          <h4 className="text-xl font-bold text-white mb-2">
            Interactive 3D Engine Preview
          </h4>
          <p className="text-gray-400 text-sm max-w-md mb-6">
            Watch how TALVIX analyzes real job posts and synthesizes high-impact
            resume bullet points instantly.
          </p>
          <a
            href="#pricing"
            onClick={onClose}
            className="glow-button bg-emerald-500 text-[#07090e] font-extrabold px-6 py-2.5 rounded-xl text-sm"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </div>
  );
};

// Main Default Export Component
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load FontAwesome CDN dynamically for icons
  useEffect(() => {
    if (!document.getElementById("fa-cdn")) {
      const link = document.createElement("link");
      link.id = "fa-cdn";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="relative bg-[#07090e] text-gray-100 antialiased selection:bg-emerald-500 selection:text-white min-h-screen">
      <CustomStyles />

      {/* Global Background Visual Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] radial-aurora opacity-70"></div>
        <div className="absolute -top-32 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] -left-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
      </div>

      {/* Application Layout Sections */}
      <div className="relative z-10">
        <AnnouncementBar />
        <Navbar onOpenModal={() => setIsModalOpen(true)} />
        <HeroSection onOpenModal={() => setIsModalOpen(true)} />
        <BrandLogos />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaBanner />
        <Footer />
        <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(true)} />
      </div>
    </div>
  );
}
