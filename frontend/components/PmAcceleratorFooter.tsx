"use client";

const PM_ACCELERATOR_LINK = "https://www.linkedin.com/school/pmaccelerator/";

export default function PmAcceleratorFooter() {
  return (
    <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-bg-primary/40 backdrop-blur-sm">
      <a
        href={PM_ACCELERATOR_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="card flex items-center gap-3 p-3 hover:border-accent-blue/30 transition-all"
      >
        <img
          src="/pm-accelerator-logo.jpg"
          alt="PM Accelerator logo"
          className="w-14 h-14 rounded-lg object-cover bg-black/80 flex-shrink-0"
        />

        <div className="min-w-0">
          <h4 className="font-sans text-sm font-semibold text-text-primary">PM Accelerator</h4>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Supports PM professionals from aspiring talent to product leaders.
          </p>
          <span className="text-[11px] text-accent-blue">linkedin.com/school/pmaccelerator</span>
        </div>
      </a>
    </div>
  );
}
