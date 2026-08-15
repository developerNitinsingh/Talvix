import { useEffect, useRef } from "react";

export const InteractiveSphere3D = () => {
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
