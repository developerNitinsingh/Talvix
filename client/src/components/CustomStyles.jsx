export const CustomStyles = () => (
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
