import React from 'react';

export default function FarmerCowAnimatedDoodle({ className = "w-full h-auto" }) {
  return (
    <div className={`relative inline-block overflow-hidden rounded-2xl bg-[#faf8f5] border border-[#e5dfd3] p-4 shadow-sm select-none ${className}`}>
      <svg
        viewBox="0 0 500 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <style>{`
            @keyframes walkForward {
              0%, 100% { transform: translateX(0px); }
              50% { transform: translateX(18px); }
            }
            @keyframes nodOxHead {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(-7deg); }
            }
            @keyframes wagOxTail {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(22deg); }
            }
            @keyframes rotateSunRays {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes swayInkWheat {
              0%, 100% { transform: rotate(-5deg); }
              50% { transform: rotate(7deg); }
            }
            @keyframes birdFly {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-4px); }
            }
            .ink-walk { animation: walkForward 3.2s ease-in-out infinite; }
            .ink-head { transform-origin: 85px 30px; animation: nodOxHead 2.4s ease-in-out infinite; }
            .ink-tail { transform-origin: 15px 45px; animation: wagOxTail 1.6s ease-in-out infinite; }
            .ink-sun { transform-origin: 55px 45px; animation: rotateSunRays 18s linear infinite; }
            .ink-wheat { transform-origin: bottom center; animation: swayInkWheat 4.2s ease-in-out infinite; }
            .ink-bird { animation: birdFly 3s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* Notebook / Cream Paper Canvas Grid Lines */}
        <line x1="0" y1="40" x2="500" y2="40" stroke="#e8e2d5" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="80" x2="500" y2="80" stroke="#e8e2d5" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="120" x2="500" y2="120" stroke="#e8e2d5" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="160" x2="500" y2="160" stroke="#e8e2d5" strokeWidth="1" strokeDasharray="4 4" />

        {/* 1. ROTATING INK SUN (Top Left Sky) */}
        <g className="ink-sun">
          <circle cx="55" cy="45" r="22" stroke="#262626" strokeWidth="2.5" fill="none" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="55"
              y1="45"
              x2={55 + 34 * Math.cos((angle * Math.PI) / 180)}
              y2={45 + 34 * Math.sin((angle * Math.PI) / 180)}
              stroke="#262626"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* 2. FLYING INK BIRDS IN SKY */}
        <g className="ink-bird">
          <path d="M 310 35 Q 318 27 326 35 Q 334 27 342 35" stroke="#262626" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 355 48 Q 361 41 367 48 Q 373 41 379 48" stroke="#262626" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>

        {/* 3. DISTANT HILLS HORIZON LINE */}
        <path d="M 0 150 Q 140 120 270 145 T 500 135" stroke="#737373" strokeWidth="2" strokeDasharray="4 4" fill="none" />

        {/* 4. GROUND BASELINE (y=180) */}
        <line x1="0" y1="180" x2="500" y2="180" stroke="#262626" strokeWidth="3" strokeLinecap="round" />

        {/* Grass & Small Sprout Sprigs along Ground Line */}
        {[25, 70, 130, 200, 270, 340, 410, 470].map((x, idx) => (
          <path key={idx} d={`M ${x} 180 L ${x - 3} 170 M ${x} 180 L ${x} 165 M ${x} 180 L ${x + 4} 168`} stroke="#262626" strokeWidth="2" strokeLinecap="round" />
        ))}

        {/* 5. SWAYING WHEAT STALKS */}
        <g className="ink-wheat">
          {[35, 95, 425, 465].map((x, idx) => (
            <g key={idx} transform={`translate(${x}, 125)`}>
              <path d="M 0 55 Q 5 28 0 0" stroke="#262626" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <circle cx="0" cy="0" r="3.5" stroke="#262626" strokeWidth="1.8" fill="#faf8f5" />
              <circle cx="3.5" cy="11" r="2.8" stroke="#262626" strokeWidth="1.8" fill="#faf8f5" />
              <circle cx="-3.5" cy="20" r="2.8" stroke="#262626" strokeWidth="1.8" fill="#faf8f5" />
            </g>
          ))}
        </g>

        {/* 6. ANIMATED MOVING FARMER & OX PLOWING GROUP */}
        <g className="ink-walk">
          {/* OX / COW DOODLE (Feet on Ground y=180, Nodding Head & Wagging Tail) */}
          <g transform="translate(100, 80)">
            {/* Body */}
            <path d="M 20 40 C 20 20, 70 20, 75 45 C 75 75, 65 85, 20 85 Z" stroke="#262626" strokeWidth="2.5" fill="#faf8f5" />
            {/* Ink Spots */}
            <path d="M 35 35 Q 50 30 45 50 Q 30 55 35 35 Z" stroke="#262626" strokeWidth="1.8" fill="#e5dfd3" />

            {/* Wagging Tail */}
            <path d="M 20 45 Q 5 55 12 75" stroke="#262626" strokeWidth="2.5" fill="none" strokeLinecap="round" className="ink-tail" />

            {/* Nodding Head & Horns */}
            <g className="ink-head">
              <path d="M 85 22 Q 95 5 105 15 M 70 20 Q 75 0 82 12" stroke="#262626" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 65 25 C 65 15, 95 15, 95 28 C 95 40, 85 50, 70 48 Z" stroke="#262626" strokeWidth="2.5" fill="#faf8f5" />
              <circle cx="80" cy="28" r="2.2" fill="#262626" />
              <ellipse cx="88" cy="38" rx="7" ry="5" stroke="#262626" strokeWidth="2" fill="#faf8f5" />
            </g>

            {/* Legs extending down to ground y=180 (80 + 100 = 180) */}
            <path d="M 30 85 L 30 100 M 42 85 L 42 100 M 60 85 L 60 100 M 72 85 L 72 100" stroke="#262626" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="27" y="97" width="6" height="3" fill="#262626" rx="1" />
            <rect x="39" y="97" width="6" height="3" fill="#262626" rx="1" />
            <rect x="57" y="97" width="6" height="3" fill="#262626" rx="1" />
            <rect x="69" y="97" width="6" height="3" fill="#262626" rx="1" />
          </g>

          {/* FARMER DOODLE (Feet on Ground y=180, Holding Wooden Plow) */}
          <g transform="translate(230, 60)">
            {/* Turban */}
            <path d="M 18 20 C 10 10, 35 0, 42 12 C 48 5, 60 18, 48 26 Z" stroke="#262626" strokeWidth="2.5" fill="#faf8f5" />
            {/* Head */}
            <circle cx="32" cy="30" r="12" stroke="#262626" strokeWidth="2.5" fill="#faf8f5" />
            {/* Face details */}
            <circle cx="28" cy="28" r="1.8" fill="#262626" />
            <circle cx="36" cy="28" r="1.8" fill="#262626" />
            <path d="M 28 34 Q 32 37 36 34" stroke="#262626" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 24 32 Q 32 35 40 32" stroke="#262626" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Body Kurta */}
            <path d="M 18 42 L 46 42 L 50 85 L 14 85 Z" stroke="#262626" strokeWidth="2.5" fill="#faf8f5" />
            {/* Arms holding wooden plow */}
            <path d="M 18 48 L -15 65 M 46 48 L -10 68" stroke="#262626" strokeWidth="3" strokeLinecap="round" />

            {/* Legs extending down to ground y=180 (60 + 120 = 180) */}
            <path d="M 24 85 L 24 120 M 40 85 L 40 120" stroke="#262626" strokeWidth="3.5" strokeLinecap="round" />
            <ellipse cx="22" cy="120" rx="5" ry="2.5" fill="#262626" />
            <ellipse cx="38" cy="120" rx="5" ry="2.5" fill="#262626" />
          </g>

          {/* Wooden Plow Beam */}
          <path d="M 165 165 L 220 158" stroke="#262626" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
