/** 木刻线描：细墨线、平涂、无渐变。每个步骤一件器物，不做现代图标。 */
type Props = {
  step: string;
  className?: string;
};

const common = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Woodcut({ step, className }: Props) {
  return (
    <svg className={`woodcut ${className ?? ""}`} viewBox="0 0 240 120" aria-hidden="true">
      {step === "target" && (
        <g {...common}>
          <path d="M34 18c44 22 44 62 0 84" />
          <path d="M58 18c44 22 44 62 0 84" />
          <path d="M110 18c44 22 44 62 0 84" />
          <path d="M134 18c44 22 44 62 0 84" />
          <path d="M34 36h100M34 54h100M34 72h100M34 90h100" className="hatch" />
          <path d="M176 30h44v60h-44z" />
          <path d="M186 42h24M186 54h24M186 66h18M186 78h24" className="hatch" />
          <path d="M176 60h-14" />
        </g>
      )}
      {step === "cut" && (
        <g {...common}>
          <circle cx="98" cy="60" r="38" />
          <circle cx="98" cy="60" r="30" className="hatch" />
          <path d="M140 16l48 88" strokeWidth="2" />
          <path d="M186 22l-26 44" />
          <path d="M134 60h-8M78 60h-8" />
          <path d="M60 26l10 10M124 92l10 10" className="hatch" />
        </g>
      )}
      {step === "ligate" && (
        <g {...common}>
          <path d="M70 32c22-14 44-14 66 0" />
          <path d="M70 88c22 14 44 14 66 0" />
          <path d="M70 32v56M136 32v56" />
          <path d="M70 32c-10 0-18 8-18 18s8 18 18 18" />
          <path d="M136 88c10 0 18-8 18-18s-8-18-18-18" />
          <path d="M100 46c8 6 8 22 0 28M108 46c-8 6-8 22 0 28" className="hatch" />
          <path d="M96 60h18" />
        </g>
      )}
      {step === "deliver" && (
        <g {...common}>
          <path d="M60 60c0-26 20-40 46-40s52 12 52 40-24 44-52 44-46-18-46-44z" />
          <circle cx="106" cy="58" r="11" />
          <path d="M150 20l18 18M168 20l-18 18" />
          <path d="M22 42h22M22 58h18M22 74h22" className="hatch" />
          <path d="M44 58h14" />
          <path d="M128 88c8-6 14-14 18-22" className="hatch" />
        </g>
      )}
      {step === "select" && (
        <g {...common}>
          <ellipse cx="104" cy="66" rx="58" ry="30" />
          <ellipse cx="104" cy="62" rx="58" ry="30" className="hatch" />
          <circle cx="82" cy="58" r="5" />
          <circle cx="104" cy="52" r="4" />
          <circle cx="124" cy="66" r="4" />
          <circle cx="98" cy="74" r="4" />
          <circle cx="132" cy="50" r="3" />
          <circle cx="124" cy="66" r="10" stroke="currentColor" />
          <path d="M148 26l22 22M170 26l-22 22" className="hatch" />
        </g>
      )}
      {step === "express" && (
        <g {...common}>
          <path d="M100 46l-34 54h92l-34-54" />
          <path d="M96 46h32" />
          <path d="M80 84h64" className="hatch" />
          <path d="M100 46V26h24v20" />
          <path d="M94 20h36" />
          <path d="M104 32c6-4 12-4 16 0" className="hatch" />
          <circle cx="166" cy="38" r="3" />
          <circle cx="176" cy="50" r="2.2" />
          <circle cx="158" cy="26" r="1.6" />
        </g>
      )}
      {step === "verify" && (
        <g {...common}>
          <rect x="70" y="16" width="52" height="88" />
          <path d="M78 26h36M78 38h36M78 50h36M78 62h36M78 74h36M78 86h36" className="hatch" />
          <path d="M82 34h20M92 46h16M86 68h18M96 82h14" strokeWidth="2" />
          <path d="M150 24v72M140 24h20M140 96h20" />
          <path d="M150 36h10M150 48h14M150 60h8M150 72h12" className="hatch" />
        </g>
      )}
      {step === "apply" && (
        <g {...common}>
          <path d="M56 52h56l-6 46H62z" />
          <path d="M52 52h64" />
          <path d="M72 62h24M72 72h18M72 82h24" className="hatch" />
          <path d="M150 96V30M150 96h44" />
          <path d="M150 66c10-4 18-4 26 0M150 48c8-3 16-3 24 0" className="hatch" />
          <path d="M168 96V58M168 70l-8-8M168 70l8-8M168 54l-6-6M168 54l6-6" />
          <path d="M158 88c6-4 14-4 20 0" />
        </g>
      )}
    </svg>
  );
}
