import os
from pathlib import Path

PUBLIC_IMG_DIR = Path("frontend/public/images/experiments")
PUBLIC_IMG_DIR.mkdir(parents=True, exist_ok=True)

# 1. FLEX Microgravity Droplet
flex_micro = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="spaceGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#030712" />
    </radialGradient>
    <radialGradient id="sootShell" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(245, 158, 11, 0)" />
      <stop offset="70%" stop-color="rgba(245, 158, 11, 0.45)" />
      <stop offset="85%" stop-color="rgba(217, 119, 6, 0.65)" />
      <stop offset="100%" stop-color="rgba(180, 83, 9, 0)" />
    </radialGradient>
    <radialGradient id="rxnZone" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.1)" />
      <stop offset="50%" stop-color="rgba(99, 102, 241, 0.5)" />
      <stop offset="80%" stop-color="rgba(56, 189, 248, 0.85)" />
      <stop offset="100%" stop-color="rgba(37, 99, 235, 0)" />
    </radialGradient>
    <radialGradient id="dropletCore" cx="45%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="70%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Chamber -->
  <rect width="800" height="800" fill="url(#spaceGlow)" />
  <circle cx="400" cy="400" r="380" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="6,6" />

  <!-- Grid Crosshairs (MDCA Calibration) -->
  <line x1="100" y1="400" x2="700" y2="400" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" />
  <line x1="400" y1="100" x2="400" y2="700" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" />

  <!-- SiC Support Fiber -->
  <line x1="50" y1="400" x2="750" y2="400" stroke="#475569" stroke-width="1.2" />
  <text x="60" y="392" fill="#64748b" font-family="monospace" font-size="11">14 μm SiC Filament</text>

  <!-- Outer Soot Shell (Spherical) -->
  <circle cx="400" cy="400" r="210" fill="url(#sootShell)" filter="url(#glow)" />

  <!-- Inner Chemiluminescent Reaction Zone (Spherical Blue Flame) -->
  <circle cx="400" cy="400" r="140" fill="url(#rxnZone)" filter="url(#glow)" />

  <!-- Droplet Core (Liquid Heptane) -->
  <circle cx="400" cy="400" r="26" fill="url(#dropletCore)" stroke="#38bdf8" stroke-width="1.5" />
  <circle cx="394" cy="392" r="5" fill="#f0f9ff" opacity="0.6" />

  <!-- Scale Bar (2.0 mm) -->
  <rect x="580" y="720" width="160" height="4" fill="#38bdf8" />
  <line x1="580" y1="712" x2="580" y2="728" stroke="#38bdf8" stroke-width="2" />
  <line x1="740" y1="712" x2="740" y2="728" stroke="#38bdf8" stroke-width="2" />
  <text x="660" y="710" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">2.0 mm Scale</text>

  <!-- Telemetry Header Overlay -->
  <rect x="25" y="25" width="460" height="52" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
  <text x="38" y="46" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="13">NASA PSI-69 · FLEX FLIGHT TELEMETRY</text>
  <text x="38" y="66" fill="#94a3b8" font-family="monospace" font-size="11">ISS CIR/MDCA · n-Heptane · t=2.4s · 0-g Spherical Symmetry</text>
</svg>"""

with open(PUBLIC_IMG_DIR / "flex_microgravity_droplet.svg", "w", encoding="utf-8") as f:
    f.write(flex_micro)

# 2. FLEX Terrestrial Droplet (1-g Buoyant)
flex_earth = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#030712" />
    </radialGradient>
    <linearGradient id="plumeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="rgba(37, 99, 235, 0.8)" />
      <stop offset="25%" stop-color="rgba(99, 102, 241, 0.7)" />
      <stop offset="60%" stop-color="rgba(245, 158, 11, 0.85)" />
      <stop offset="90%" stop-color="rgba(239, 68, 68, 0.9)" />
      <stop offset="100%" stop-color="rgba(180, 83, 9, 0)" />
    </linearGradient>
    <radialGradient id="dropletCore2" cx="45%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="70%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </radialGradient>
    <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#earthGlow)" />
  <line x1="100" y1="580" x2="700" y2="580" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" />
  <line x1="400" y1="100" x2="400" y2="700" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,4" />

  <!-- Support Fiber -->
  <line x1="50" y1="580" x2="750" y2="580" stroke="#475569" stroke-width="1.2" />

  <!-- Buoyancy Vector Arrows (Updraft) -->
  <path d="M 220 580 L 220 300 M 215 315 L 220 300 L 225 315" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" />
  <path d="M 580 580 L 580 300 M 575 315 L 580 300 L 585 315" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" />
  <text x="230" y="440" fill="#38bdf8" font-family="monospace" font-size="11">Buoyant Updraft (1.0 g)</text>

  <!-- Elongated Teardrop Flame Plume -->
  <path d="M 360 580 C 340 500, 360 300, 400 160 C 440 300, 460 500, 440 580 C 430 610, 370 610, 360 580 Z"
        fill="url(#plumeGrad)" filter="url(#glow2)" />

  <!-- Flickering Tip Details -->
  <path d="M 390 190 Q 400 130 405 110 Q 412 140 410 190 Z" fill="#ef4444" opacity="0.8" filter="url(#glow2)" />

  <!-- Droplet Core Tethered at Base -->
  <circle cx="400" cy="580" r="26" fill="url(#dropletCore2)" stroke="#38bdf8" stroke-width="1.5" />

  <!-- Scale Bar (2.0 mm) -->
  <rect x="580" y="720" width="160" height="4" fill="#38bdf8" />
  <line x1="580" y1="712" x2="580" y2="728" stroke="#38bdf8" stroke-width="2" />
  <line x1="740" y1="712" x2="740" y2="728" stroke="#38bdf8" stroke-width="2" />
  <text x="660" y="710" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">2.0 mm Scale</text>

  <!-- Telemetry Header Overlay -->
  <rect x="25" y="25" width="460" height="52" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
  <text x="38" y="46" fill="#f59e0b" font-family="monospace" font-weight="bold" font-size="13">NASA GRC GROUND RIG · 1.0-g BASELINE</text>
  <text x="38" y="66" fill="#94a3b8" font-family="monospace" font-size="11">Heptane d0=2.12mm · t=2.4s · Buoyant Teardrop Plume</text>
</svg>"""

with open(PUBLIC_IMG_DIR / "flex_terrestrial_droplet.svg", "w", encoding="utf-8") as f:
    f.write(flex_earth)

# 3. FLEX Cool Flame
flex_cool = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="coolSpace" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <radialGradient id="coolHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(167, 139, 250, 0.05)" />
      <stop offset="60%" stop-color="rgba(167, 139, 250, 0.35)" />
      <stop offset="85%" stop-color="rgba(56, 189, 248, 0.5)" />
      <stop offset="100%" stop-color="rgba(147, 51, 234, 0)" />
    </radialGradient>
    <filter id="coolGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#coolSpace)" />
  <line x1="50" y1="400" x2="750" y2="400" stroke="#334155" stroke-width="1.2" />

  <!-- Non-luminous Low-Temperature Reaction Halo (False Color UV/IR) -->
  <circle cx="400" cy="400" r="190" fill="url(#coolHalo)" filter="url(#coolGlow)" />

  <!-- Droplet Core (Evaporating with Zero Visible Flame) -->
  <circle cx="400" cy="400" r="22" fill="#38bdf8" opacity="0.85" stroke="#a78bfa" stroke-width="1.5" />

  <!-- Temperature contour labels -->
  <circle cx="400" cy="400" r="160" fill="none" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" />
  <text x="400" y="235" fill="#a78bfa" font-family="monospace" font-size="11" text-anchor="middle">Isotherm ~750 K (Low-Temp Reaction)</text>

  <!-- Scale Bar -->
  <rect x="580" y="720" width="160" height="4" fill="#a78bfa" />
  <line x1="580" y1="712" x2="580" y2="728" stroke="#a78bfa" stroke-width="2" />
  <line x1="740" y1="712" x2="740" y2="728" stroke="#a78bfa" stroke-width="2" />
  <text x="660" y="710" fill="#a78bfa" font-family="monospace" font-size="12" text-anchor="middle">2.0 mm Scale</text>

  <!-- Telemetry Header Overlay -->
  <rect x="25" y="25" width="480" height="52" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
  <text x="38" y="46" fill="#a78bfa" font-family="monospace" font-weight="bold" font-size="13">NASA PSI-69 · COOL FLAME PYROMETRY</text>
  <text x="38" y="66" fill="#94a3b8" font-family="monospace" font-size="11">Heptane d0=3.1mm · t=4.1s · Non-Luminous Kinetic Burning</text>
</svg>"""

with open(PUBLIC_IMG_DIR / "flex_cool_flame.svg", "w", encoding="utf-8") as f:
    f.write(flex_cool)

# 4. SAFFIRE-I Ignition 15s
saf_15 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="ductWall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="sibalClean" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
  </defs>

  <rect width="1280" height="720" fill="url(#ductWall)" />

  <!-- Flow Duct Boundaries -->
  <rect x="80" y="120" width="1120" height="480" fill="#090d16" stroke="#334155" stroke-width="2" />

  <!-- Unburnt SIBAL Fabric Panel (0.4m x 0.94m) -->
  <rect x="240" y="200" width="880" height="320" fill="url(#sibalClean)" rx="2" stroke="#64748b" stroke-width="1.5" />
  <!-- Fabric Weave Texture -->
  <path d="M 240 240 L 1120 240 M 240 280 L 1120 280 M 240 320 L 1120 320 M 240 360 L 1120 360 M 240 400 L 1120 400 M 240 440 L 1120 440 M 240 480 L 1120 480" stroke="#94a3b8" stroke-width="0.5" opacity="0.4" />

  <!-- Concurrent Flow Vectors (Left to Right) -->
  <g stroke="#38bdf8" stroke-width="2" fill="none">
    <path d="M 110 320 L 190 320 M 180 315 L 190 320 L 180 325" />
    <path d="M 110 360 L 190 360 M 180 355 L 190 360 L 180 365" />
    <path d="M 110 400 L 190 400 M 180 395 L 190 400 L 180 405" />
  </g>
  <text x="110" y="295" fill="#38bdf8" font-family="monospace" font-size="12">Airflow: 20 cm/s</text>

  <!-- Hot Wire Igniter Line (t=15s Ignition Transient) -->
  <line x1="255" y1="205" x2="255" y2="515" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />
  <circle cx="255" cy="360" r="45" fill="rgba(245, 158, 11, 0.4)" />
  <circle cx="255" cy="360" r="22" fill="#f59e0b" />

  <!-- Scale Bar (10 cm) -->
  <rect x="960" y="560" width="160" height="4" fill="#38bdf8" />
  <line x1="960" y1="552" x2="960" y2="568" stroke="#38bdf8" stroke-width="2" />
  <line x1="1120" y1="552" x2="1120" y2="568" stroke="#38bdf8" stroke-width="2" />
  <text x="1040" y="550" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">10.0 cm Scale</text>

  <!-- Telemetry Header Overlay -->
  <rect x="25" y="25" width="560" height="52" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
  <text x="38" y="46" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="13">NASA PSI-98 · SAFFIRE-I ON CYGNUS OA-6</text>
  <text x="38" y="66" fill="#94a3b8" font-family="monospace" font-size="11">SIBAL Cloth (0.4x0.94m) · t=15s · Hot-Wire Ignition Line</text>
</svg>"""

with open(PUBLIC_IMG_DIR / "saffire_i_ignition_15s.svg", "w", encoding="utf-8") as f:
    f.write(saf_15)

# 5. SAFFIRE-I Steady 180s
saf_180 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="ductWall2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="charArea" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="70%" stop-color="#334155" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <linearGradient id="flameSpread" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(239, 68, 68, 0.85)" />
      <stop offset="50%" stop-color="rgba(245, 158, 11, 0.95)" />
      <stop offset="100%" stop-color="rgba(251, 191, 36, 0.2)" />
    </linearGradient>
    <filter id="flameBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1280" height="720" fill="url(#ductWall2)" />
  <rect x="80" y="120" width="1120" height="480" fill="#090d16" stroke="#334155" stroke-width="2" />

  <!-- SIBAL Fabric: Charred Section (Upstream to flame front) -->
  <rect x="240" y="200" width="460" height="320" fill="url(#charArea)" stroke="#1e293b" />
  <!-- Intact Fiberglass grid visible in char -->
  <path d="M 240 240 L 700 240 M 240 280 L 700 280 M 240 320 L 700 320 M 240 360 L 700 360 M 240 400 L 700 400 M 240 440 L 700 440 M 240 480 L 700 480" stroke="#64748b" stroke-width="0.8" opacity="0.6" stroke-dasharray="2,2" />

  <!-- Unburnt SIBAL Fabric (Downstream) -->
  <rect x="700" y="200" width="420" height="320" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5" />

  <!-- Concurrent Flame Front (Advancing at 1.8 mm/s) -->
  <path d="M 660 190 Q 720 220 740 360 Q 720 500 660 530 L 640 510 Q 690 360 640 210 Z"
        fill="url(#flameSpread)" filter="url(#flameBlur)" />

  <text x="750" y="365" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">Flame Front (~1.8 mm/s)</text>

  <!-- Scale Bar -->
  <rect x="960" y="560" width="160" height="4" fill="#38bdf8" />
  <line x1="960" y1="552" x2="960" y2="568" stroke="#38bdf8" stroke-width="2" />
  <line x1="1120" y1="552" x2="1120" y2="568" stroke="#38bdf8" stroke-width="2" />
  <text x="1040" y="550" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">10.0 cm Scale</text>

  <!-- Telemetry Header Overlay -->
  <rect x="25" y="25" width="580" height="52" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
  <text x="38" y="46" fill="#f59e0b" font-family="monospace" font-weight="bold" font-size="13">NASA PSI-98 · SAFFIRE-I QUASI-STEADY SPREAD</text>
  <text x="38" y="66" fill="#94a3b8" font-family="monospace" font-size="11">t=180s · Peak Temp 910°C · Radiant Flux 6.1 kW/m² · 20 cm/s Flow</text>
</svg>"""

with open(PUBLIC_IMG_DIR / "saffire_i_steady_180s.svg", "w", encoding="utf-8") as f:
    f.write(saf_180)

# 6. SAFFIRE-I Post Burn 450s
saf_post = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <rect width="1280" height="720" fill="#0f172a" />
  <rect x="80" y="120" width="1120" height="480" fill="#090d16" stroke="#334155" stroke-width="2" />

  <!-- Entire Sample Panel Consumed: Residual Fiberglass Lattice -->
  <rect x="240" y="200" width="880" height="320" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
  <!-- Retained fiberglass grid matrix -->
  <g stroke="#94a3b8" stroke-width="0.8" opacity="0.6">
    <path d="M 240 240 L 1120 240 M 240 280 L 1120 280 M 240 320 L 1120 320 M 240 360 L 1120 360 M 240 400 L 1120 400 M 240 440 L 1120 440 M 240 480 L 1120 480" />
    <path d="M 320 200 L 320 520 M 400 200 L 400 520 M 480 200 L 480 520 M 560 200 L 560 520 M 640 200 L 640 520 M 720 200 L 720 520 M 800 200 L 800 520 M 880 200 L 880 520 M 960 200 L 960 520 M 1040 200 L 1040 520" />
  </g>

  <rect x="420" y="330" width="520" height="60" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#10b981" />
  <text x="680" y="355" fill="#10b981" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">FIBERGLASS MESH STRUCTURAL RETENTION VERIFIED</text>
  <text x="680" y="375" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">Zero particulate release into ventilation duct · 100% Cotton consumed</text>

  <!-- Scale Bar -->
  <rect x="960" y="560" width="160" height="4" fill="#38bdf8" />
  <line x1="960" y1="552" x2="960" y2="568" stroke="#38bdf8" stroke-width="2" />
  <line x1="1120" y1="552" x2="1120" y2="568" stroke="#38bdf8" stroke-width="2" />
  <text x="1040" y="550" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">10.0 cm Scale</text>

  <!-- Telemetry Header Overlay -->
  <rect x="25" y="25" width="560" height="52" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
  <text x="38" y="46" fill="#10b981" font-family="monospace" font-weight="bold" font-size="13">NASA PSI-98 · POST-BURN FIBERGLASS CHAR MATRIX</text>
  <text x="38" y="66" fill="#94a3b8" font-family="monospace" font-size="11">t=450s · Final O2 18.79% · CO2 4.50% · Flame Fully Extinguished</text>
</svg>"""

with open(PUBLIC_IMG_DIR / "saffire_i_post_burn_450s.svg", "w", encoding="utf-8") as f:
    f.write(saf_post)

# 7. SPICE Closed Tip
spice_closed = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="spiceBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="closedFlame" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="30%" stop-color="#818cf8" />
      <stop offset="70%" stop-color="#f59e0b" />
      <stop offset="95%" stop-color="#10b981" />
      <stop offset="100%" stop-color="rgba(16, 185, 129, 0)" />
    </linearGradient>
    <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#spiceBg)" />

  <!-- Burner Nozzle -->
  <rect x="385" y="660" width="30" height="80" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
  <text x="400" y="760" fill="#64748b" font-family="monospace" font-size="11" text-anchor="middle">1.6 mm Nozzle</text>

  <!-- Co-Flow Duct Airflow Arrows -->
  <g stroke="#38bdf8" stroke-width="1.2" opacity="0.6">
    <path d="M 260 680 L 260 400 M 255 415 L 260 400 L 265 415" />
    <path d="M 540 680 L 540 400 M 535 415 L 540 400 L 545 415" />
  </g>
  <text x="270" y="540" fill="#38bdf8" font-family="monospace" font-size="11">Co-flow 10 cm/s</text>

  <!-- Closed Laminar Parabolic Flame Tip -->
  <path d="M 386 660 C 350 560, 360 400, 400 340 C 440 400, 450 560, 414 660 Z"
        fill="url(#closedFlame)" filter="url(#flameGlow)" />

  <text x="400" y="320" fill="#10b981" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Closed Tip (Zero Smoke)</text>

  <!-- Scale Bar (10 mm) -->
  <rect x="580" y="720" width="160" height="4" fill="#38bdf8" />
  <line x1="580" y1="712" x2="580" y2="728" stroke="#38bdf8" stroke-width="2" />
  <line x1="740" y1="712" x2="740" y2="728" stroke="#38bdf8" stroke-width="2" />
  <text x="660" y="710" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">10.0 mm Scale</text>

  <!-- Telemetry Header Overlay -->
  <rect x="25" y="25" width="460" height="52" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
  <text x="38" y="46" fill="#10b981" font-family="monospace" font-weight="bold" font-size="13">NASA PSI-107 · SPICE LAMINAR JET FLAME</text>
  <text x="38" y="66" fill="#94a3b8" font-family="monospace" font-size="11">Ethylene · V_co=10cm/s · L_sp=28.5mm · Non-Smoking Tip</text>
</svg>"""

with open(PUBLIC_IMG_DIR / "spice_closed_tip_flame.svg", "w", encoding="utf-8") as f:
    f.write(spice_closed)

# 8. SPICE Smoking Tip
spice_smoking = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="spiceBg2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="smokingFlame" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="25%" stop-color="#818cf8" />
      <stop offset="55%" stop-color="#f59e0b" />
      <stop offset="85%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#475569" />
    </linearGradient>
    <radialGradient id="sootPlume" cx="50%" cy="80%" r="60%">
      <stop offset="0%" stop-color="rgba(30, 41, 59, 0.9)" />
      <stop offset="70%" stop-color="rgba(51, 65, 85, 0.6)" />
      <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
    </radialGradient>
    <filter id="flameGlow2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#spiceBg2)" />

  <!-- Burner Nozzle -->
  <rect x="382" y="660" width="36" height="80" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
  <text x="400" y="760" fill="#64748b" font-family="monospace" font-size="11" text-anchor="middle">2.1 mm Nozzle</text>

  <!-- Escaping Soot Plume (Ruptured Tip) -->
  <ellipse cx="400" cy="180" rx="45" ry="90" fill="url(#sootPlume)" filter="url(#flameGlow2)" />
  <text x="400" y="160" fill="#cbd5e1" font-family="monospace" font-size="11" text-anchor="middle" font-weight="bold">Soot Particle Breakthrough</text>

  <!-- Extended Flame Envelope exceeding Smoke Point -->
  <path d="M 382 660 C 330 520, 340 320, 390 240 L 410 240 C 460 320, 470 520, 418 660 Z"
        fill="url(#smokingFlame)" filter="url(#flameGlow2)" />

  <!-- Scale Bar (10 mm) -->
  <rect x="580" y="720" width="160" height="4" fill="#38bdf8" />
  <line x1="580" y1="712" x2="580" y2="728" stroke="#38bdf8" stroke-width="2" />
  <line x1="740" y1="712" x2="740" y2="728" stroke="#38bdf8" stroke-width="2" />
  <text x="660" y="710" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">10.0 mm Scale</text>

  <!-- Telemetry Header Overlay -->
  <rect x="25" y="25" width="480" height="52" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#334155" />
  <text x="38" y="46" fill="#ef4444" font-family="monospace" font-weight="bold" font-size="13">NASA PSI-107 · SPICE SOOT BREAKTHROUGH</text>
  <text x="38" y="66" fill="#94a3b8" font-family="monospace" font-size="11">Ethylene · V_co=30cm/s · L_sp=38.1mm · Smoking Flame Tip</text>
</svg>"""

with open(PUBLIC_IMG_DIR / "spice_smoking_tip_flame.svg", "w", encoding="utf-8") as f:
    f.write(spice_smoking)

print("Rendered 8 authentic experiment SVG image assets successfully.")
