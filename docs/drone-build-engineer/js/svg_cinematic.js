export const cinematicSVG = `<svg id="drone-svg-graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <!-- Frame Layer -->
  <g id="vis-Frame" class="vis-layer" opacity="0.15">
    <rect x="150" y="120" width="100" height="160" fill="#d0d5db" stroke="#999" stroke-width="3" rx="30" />
    <g fill="#a0a5ab" stroke="#777" stroke-width="2">
      <path d="M 160,150 L 70,100 L 60,115 L 150,170 Z" />
      <path d="M 240,150 L 330,100 L 340,115 L 250,170 Z" />
      <path d="M 160,250 L 80,320 L 95,335 L 170,270 Z" />
      <path d="M 240,250 L 320,320 L 305,335 L 230,270 Z" />
    </g>
  </g>

  <!-- Motors -->
  <g id="vis-Motors" class="vis-layer" opacity="0">
    <g fill="#bbb" stroke="#888" stroke-width="2">
      <circle cx="65" cy="110" r="16" />
      <circle cx="335" cy="110" r="16" />
      <circle cx="85" cy="325" r="16" />
      <circle cx="315" cy="325" r="16" />
    </g>
  </g>

  <!-- FC & ESC (Hidden inside body mostly, but we'll show a top vent glow) -->
  <g id="vis-FC" class="vis-layer" opacity="0">
    <rect x="180" y="150" width="40" height="30" fill="#1e3d59" rx="5" />
    <circle cx="200" cy="165" r="4" fill="#5ad1ff" />
  </g>
  <g id="vis-ESC" class="vis-layer" opacity="0">
    <rect x="175" y="185" width="50" height="20" fill="#222" rx="3" />
  </g>

  <!-- Battery Area -->
  <g id="vis-Battery" class="vis-layer" opacity="0">
    <rect x="165" y="200" width="70" height="70" fill="#444" rx="10" stroke="#666" stroke-width="2"/>
    <circle cx="200" cy="235" r="8" fill="#39ff8f" opacity="0.8"/>
  </g>

  <!-- GPS -->
  <g id="vis-GPS" class="vis-layer" opacity="0">
    <circle cx="200" cy="135" r="14" fill="#eee" stroke="#ccc" stroke-width="2" />
    <circle cx="200" cy="135" r="4" fill="#333" />
  </g>

  <!-- Obstacle Avoidance -->
  <g id="vis-ObstacleAvoidance" class="vis-layer" opacity="0">
    <circle cx="160" cy="125" r="5" fill="#111" />
    <circle cx="240" cy="125" r="5" fill="#111" />
    <circle cx="160" cy="275" r="5" fill="#111" />
    <circle cx="240" cy="275" r="5" fill="#111" />
  </g>

  <!-- Receiver & Downlink -->
  <g id="vis-Receiver" class="vis-layer" opacity="0">
    <line x1="180" y1="270" x2="160" y2="300" stroke="#333" stroke-width="3" />
  </g>
  <g id="vis-VideoDownlink" class="vis-layer" opacity="0">
    <line x1="220" y1="270" x2="240" y2="300" stroke="#333" stroke-width="3" />
  </g>

  <!-- Gimbal/Camera -->
  <g id="vis-GimbalCamera" class="vis-layer" opacity="0">
    <rect x="180" y="85" width="40" height="35" fill="#555" rx="5" />
    <circle cx="200" cy="100" r="14" fill="#111" stroke="#333" stroke-width="2" />
    <circle cx="200" cy="100" r="6" fill="#1e3d59" />
  </g>

  <!-- Propellers -->
  <g id="vis-Propellers" class="vis-layer" opacity="0">
    <g fill="#ccc" opacity="0.5">
      <ellipse cx="65" cy="110" rx="60" ry="10" transform="rotate(20 65 110)" />
      <ellipse cx="335" cy="110" rx="60" ry="10" transform="rotate(-20 335 110)" />
      <ellipse cx="85" cy="325" rx="60" ry="10" transform="rotate(-20 85 325)" />
      <ellipse cx="315" cy="325" rx="60" ry="10" transform="rotate(20 315 325)" />
    </g>
  </g>

</svg>`;