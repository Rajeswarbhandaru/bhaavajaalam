export const racingSVG = `<svg id="drone-svg-graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Frame Layer (Base) -->
  <g id="vis-Frame" class="vis-layer" opacity="0.15">
    <g fill="#2a2a2a" stroke="#111" stroke-width="2">
      <path d="M 180,180 L 80,80 L 100,60 L 190,160 Z" />
      <path d="M 220,180 L 320,80 L 300,60 L 210,160 Z" />
      <path d="M 180,220 L 80,320 L 100,340 L 190,240 Z" />
      <path d="M 220,220 L 320,320 L 300,340 L 210,240 Z" />
      <rect x="160" y="140" width="80" height="120" rx="10" />
    </g>
  </g>

  <!-- Motors Layer -->
  <g id="vis-Motors" class="vis-layer" opacity="0">
    <g fill="#444" stroke="#777" stroke-width="2">
      <circle cx="90" cy="70" r="18" />
      <circle cx="310" cy="70" r="18" />
      <circle cx="90" cy="330" r="18" />
      <circle cx="310" cy="330" r="18" />
    </g>
  </g>

  <!-- ESC Layer -->
  <g id="vis-ESC" class="vis-layer" opacity="0">
    <rect x="170" y="170" width="60" height="60" fill="#222" stroke="#555" stroke-width="1" rx="4" />
    <circle cx="180" cy="180" r="3" fill="#999" />
    <circle cx="220" cy="180" r="3" fill="#999" />
  </g>

  <!-- FC Layer -->
  <g id="vis-FC" class="vis-layer" opacity="0">
    <rect x="175" y="175" width="50" height="50" fill="#1b2a47" stroke="#39ff8f" stroke-width="2" rx="5" />
    <circle cx="200" cy="200" r="10" fill="#39ff8f" opacity="0.8"/>
  </g>

  <!-- Propellers Layer -->
  <g id="vis-Propellers" class="vis-layer" opacity="0">
    <g fill="#5ad1ff" opacity="0.6">
      <ellipse cx="90" cy="70" rx="50" ry="8" transform="rotate(45 90 70)" />
      <ellipse cx="90" cy="70" rx="8" ry="50" transform="rotate(45 90 70)" />

      <ellipse cx="310" cy="70" rx="50" ry="8" transform="rotate(-45 310 70)" />
      <ellipse cx="310" cy="70" rx="8" ry="50" transform="rotate(-45 310 70)" />

      <ellipse cx="90" cy="330" rx="50" ry="8" transform="rotate(-45 90 330)" />
      <ellipse cx="90" cy="330" rx="8" ry="50" transform="rotate(-45 90 330)" />

      <ellipse cx="310" cy="330" rx="50" ry="8" transform="rotate(45 310 330)" />
      <ellipse cx="310" cy="330" rx="8" ry="50" transform="rotate(45 310 330)" />
    </g>
  </g>

  <!-- VTX / Receiver Layer -->
  <g id="vis-VTX" class="vis-layer" opacity="0">
    <rect x="185" y="240" width="30" height="20" fill="#b31237" rx="3" />
    <line x1="200" y1="260" x2="200" y2="300" stroke="#b31237" stroke-width="3" />
  </g>

  <g id="vis-Receiver" class="vis-layer" opacity="0">
    <rect x="175" y="225" width="15" height="15" fill="#333" rx="2" />
    <line x1="175" y1="230" x2="140" y2="210" stroke="#222" stroke-width="2" />
  </g>

  <!-- Action Cam Layer -->
  <g id="vis-ActionCam" class="vis-layer" opacity="0">
    <path d="M 175,140 L 225,140 L 215,110 L 185,110 Z" fill="#222" stroke="#555" />
    <circle cx="200" cy="125" r="8" fill="#111" />
  </g>

  <!-- Battery Layer -->
  <g id="vis-Battery" class="vis-layer" opacity="0">
    <rect x="170" y="160" width="60" height="90" fill="#111" stroke="#444" stroke-width="2" rx="6" />
    <rect x="180" y="170" width="40" height="70" fill="#333" rx="2" />
    <text x="200" y="210" fill="#fff" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle" transform="rotate(-90 200 210)">LIPO</text>
  </g>

  <!-- LED Strip Layer -->
  <g id="vis-LEDStrip" class="vis-layer" opacity="0">
    <line x1="120" y1="280" x2="150" y2="250" stroke="#39ff8f" stroke-width="6" filter="url(#glow-green)" stroke-dasharray="8 4"/>
    <line x1="280" y1="280" x2="250" y2="250" stroke="#39ff8f" stroke-width="6" filter="url(#glow-green)" stroke-dasharray="8 4"/>
  </g>

</svg>`;