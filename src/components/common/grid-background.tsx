const GridBackground = () => {
  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-radial from-slate-900 via-slate-900 to-black opacity-90" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff0f 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff0f 1px, transparent 1px)
          `,
          backgroundSize: "14px 14px",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
};

export default GridBackground;
