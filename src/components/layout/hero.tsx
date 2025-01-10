export default function Hero() {
  return (
    <div className="text-center space-y-2">
      <h1
        translate="no"
        className="text-5xl md:text-7xl font-bold text-center tracking-tight 
                 animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
      >
        Neon
        <span translate="no" className="text-neon-pink  text-neon-pink-glow">
          Slug
        </span>
      </h1>
      <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ">
        <p className="text-gray-400  text-lg  md:text-xl ">
          Free and open-source URL shortener
        </p>
        <p className=" md:text-lg text-gray-400">
          No tracking, no ads, just fast and reliable short links.
        </p>
      </div>
    </div>
  );
}
