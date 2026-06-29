/* ============================================
   HIDDEN MATHS — style.css
   Production-ready stylesheet
   Tech: HTML5 + CSS3 + Vanilla JS
   ============================================ */

/* ---- CSS Variables & Tokens ---- */
:root {
  --bg-deep: #0a0e27;
  --bg-mid: #141b3d;
  --bg-light: #1e2756;
  --accent-cyan: #00d9ff;
  --accent-violet: #7c5cff;
  --accent-pink: #ff5cab;
  --accent-gold: #ffc857;
  --accent-lime: #5cff85;
  --text-primary: #f0f2ff;
  --text-secondary: rgba(240, 242, 255, 0.72);
  --text-muted: rgba(240, 242, 255, 0.5);
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.14);
  --glass-border-hover: rgba(255, 255, 255, 0.28);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
  --glass-shadow-hover: 0 16px 48px rgba(0, 0, 0, 0.4);
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 28px;
  --radius-xl: 36px;
  --transition-fast: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-smooth: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-bounce: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  --font-body: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-display: 'Segoe UI', system-ui, sans-serif;
}

/* ---- Reset & Base ---- */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  background: var(--bg-deep);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  line-height: 1.6;
}

/* ---- Ambient Background ---- */
.ambient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.gradient-layer {
  position: absolute;
  inset: -50%;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(124, 92, 255, 0.22) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 80%, rgba(0, 217, 255, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 92, 171, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 30%, rgba(92, 255, 133, 0.10) 0%, transparent 50%);
  animation: gradientShift 20s ease-in-out infinite alternate;
}

@keyframes gradientShift {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-4%, 3%) scale(1.08); }
  100% { transform: translate(4%, -2%) scale(1.04); }
}

.particle-container {
  position: absolute;
  inset: 0;
}

.floating-symbols {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-symbol {
  position: absolute;
  font-size: clamp(1rem, 2vw, 1.6rem);
  color: rgba(255, 255, 255, 0.12);
  font-weight: 700;
  user-select: none;
  pointer-events: none;
  animation: floatSymbol linear infinite;
}

@keyframes floatSymbol {
  0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
}

/* ---- Glass Component ---- */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--glass-shadow);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
}

.glass:hover {
  border-color: var(--glass-border-hover);
  box-shadow: var(--glass-shadow-hover);
}

/* ---- Navigation ---- */
.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-radius: 0;
  border-top: none;
  border-left: none;
  border-right: none;
  padding: 0.75rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  transition: opacity var(--transition-fast);
}

.nav-logo:hover, .nav-logo:focus {
  opacity: 0.85;
  outline: none;
}

.nav-logo:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 4px;
  border-radius: 4px;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  padding: 0.4rem 0;
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-violet));
  border-radius: 2px;
  transition: width var(--transition-smooth);
}

.nav-link:hover, .nav-link:focus {
  color: var(--text-primary);
  outline: none;
}

.nav-link:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 4px;
  border-radius: 4px;
}

.nav-link:hover::after, .nav-link:focus::after {
  width: 100%;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}

/* ---- Hero Section ---- */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rem 1.5rem 4rem;
}

.hero-content {
  max-width: 720px;
  animation: heroEntrance 1.2s ease-out both;
}

@keyframes heroEntrance {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.8s 0.2s ease-out both;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-lime);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-cyan) 50%, var(--accent-violet) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.8s 0.3s ease-out both;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: 400;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s 0.45s ease-out both;
}

.hero-description {
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  color: var(--text-muted);
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
  animation: fadeInUp 0.8s 0.55s ease-out both;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.8s 0.65s ease-out both;
}

/* ---- Buttons ---- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  padding: 0.9rem 1.8rem;
  border-radius: var(--radius-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 3px solid var(--accent-cyan);
  outline-offset: 3px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-violet));
  color: var(--bg-deep);
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 217, 255, 0.35);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-2px);
}

.btn-icon {
  transition: transform var(--transition-fast);
}

.btn-primary:hover .btn-icon {
  transform: translateX(3px);
}

.btn-play {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.4rem;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.btn-play:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}

.btn-play-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
}

/* Hero Stats */
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  animation: fadeInUp 0.8s 0.75s ease-out both;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.stat-divider {
  width: 1px;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
}

/* Scroll Indicator */
.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: fadeInUp 0.8s 1s ease-out both;
  opacity: 0.7;
}

.scroll-mouse {
  width: 22px;
  height: 34px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  position: relative;
}

.scroll-wheel {
  width: 4px;
  height: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollWheel 1.5s ease-in-out infinite;
}

@keyframes scrollWheel {
  0% { top: 6px; opacity: 1; }
  100% { top: 18px; opacity: 0; }
}

.scroll-text {
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ---- Section Containers ---- */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-tag {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-cyan);
  background: rgba(0, 217, 255, 0.08);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 100px;
  padding: 0.35rem 1rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
}

.section-subtitle {
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ---- Today's Discovery ---- */
.todays-discovery {
  position: relative;
  z-index: 1;
  padding: 5rem 0;
}

.discovery-card {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 720px;
  margin: 0 auto;
  align-items: center;
  transition: transform var(--transition-smooth), box-shadow var(--transition-smooth);
  cursor: pointer;
}

.discovery-card:hover, .discovery-card:focus {
  transform: translateY(-6px);
  box-shadow: var(--glass-shadow-hover);
}

.discovery-card:focus-visible {
  outline: 3px solid var(--accent-cyan);
  outline-offset: 4px;
}

.discovery-visual {
  position: relative;
  flex-shrink: 0;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.discovery-icon {
  position: relative;
  z-index: 2;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid rgba(0, 217, 255, 0.25);
  border-radius: 50%;
  transition: transform var(--transition-bounce);
}

.discovery-card:hover .discovery-icon {
  transform: scale(1.1) rotate(5deg);
}

.discovery-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
}

.discovery-content {
  flex: 1;
  text-align: left;
}

.discovery-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.mystery-id {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-cyan);
  letter-spacing: 0.05em;
}

.difficulty-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
}

.difficulty-badge.easy {
  color: var(--accent-lime);
  background: rgba(92, 255, 133, 0.1);
  border: 1px solid rgba(92, 255, 133, 0.25);
}

.difficulty-badge.medium {
  color: var(--accent-gold);
  background: rgba(255, 200, 87, 0.1);
  border: 1px solid rgba(255, 200, 87, 0.25);
}

.difficulty-badge.hard {
  color: var(--accent-pink);
  background: rgba(255, 92, 171, 0.1);
  border: 1px solid rgba(255, 92, 171, 0.25);
}

.discovery-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.discovery-question {
  font-size: 1rem;
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.discovery-details {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.detail-item svg {
  opacity: 0.6;
}

/* ---- Mysteries Grid ---- */
.mysteries {
  position: relative;
  z-index: 1;
  padding: 5rem 0 6rem;
}

.mysteries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.mystery-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform var(--transition-smooth), box-shadow var(--transition-smooth);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.mystery-card:hover, .mystery-card:focus {
  transform: translateY(-8px);
  box-shadow: var(--glass-shadow-hover);
}

.mystery-card:focus-visible {
  outline: 3px solid var(--accent-cyan);
  outline-offset: 4px;
}

.mystery-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.mystery-icon {
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
  transition: transform var(--transition-bounce);
}

.mystery-card:hover .mystery-icon {
  transform: scale(1.15) rotate(-5deg);
}

.mystery-card-body {
  flex: 1;
  text-align: left;
}

.mystery-card-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  letter-spacing: -0.02em;
}

.mystery-card-question {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.mystery-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.mystery-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.mystery-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.mystery-play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.mystery-play:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.mystery-play:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 2px;
}

.mystery-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-violet), var(--accent-pink));
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.mystery-card:hover::before {
  opacity: 1;
}

/* ---- Footer ---- */
.main-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 3rem 1.5rem;
  text-align: center;
}

.footer-container {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.footer-tagline {
  font-size: 1rem;
  color: var(--text-secondary);
  font-style: italic;
  max-width: 400px;
  line-height: 1.5;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-link {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-link:hover, .footer-link:focus {
  color: var(--accent-cyan);
  outline: none;
}

.footer-link:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 3px;
  border-radius: 3px;
}

.footer-credit {
  font-size: 0.85rem;
  color: var(--text-muted);
  opacity: 0.7;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(10, 14, 39, 0.95);
    backdrop-filter: blur(16px);
    padding: 1rem 0;
    gap: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: transform 0.3s, opacity 0.3s, visibility 0.3s;
  }

  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    display: block;
    width: 100%;
    padding: 0.75rem 1.5rem;
    text-align: center;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
    opacity: 0;
  }
  .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  .hero {
    padding: 7rem 1rem 3rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1.2rem;
  }

  .stat-divider {
    width: 3rem;
    height: 1px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 280px;
  }

  .discovery-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .discovery-content {
    text-align: center;
  }

  .discovery-meta {
    justify-content: center;
  }

  .discovery-details {
    justify-content: center;
  }

  .mysteries-grid {
    grid-template-columns: 1fr;
  }

  .footer-container {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
  .section-title {
    font-size: 1.5rem;
  }
  .discovery-visual {
    width: 100px;
    height: 100px;
  }
  .discovery-icon {
    width: 60px;
    height: 60px;
  }
  .discovery-icon svg {
    width: 48px;
    height: 48px;
  }
}

/* ---- Reduced Motion ---- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .gradient-layer {
    animation: none;
  }
  .floating-symbol {
    animation: none;
  }
  .scroll-wheel {
    animation: none;
  }
  .discovery-glow {
    animation: none;
  }
}

/* ---- High Contrast ---- */
@media (prefers-contrast: high) {
  :root {
    --glass-bg: rgba(0, 0, 0, 0.5);
    --glass-border: rgba(255, 255, 255, 0.5);
    --text-secondary: rgba(255, 255, 255, 0.9);
    --text-muted: rgba(255, 255, 255, 0.8);
  }
  .glass {
    border-width: 2px;
  }
  .btn {
    border: 2px solid currentColor;
  }
}