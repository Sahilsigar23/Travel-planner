import React, { useEffect, useState } from 'react';

/**
 * Shared moving photo background — same slideshow used on the landing page.
 * Auto-collects every image from src/assets/photo/. Renders as a fixed,
 * full-viewport backdrop with a dark gradient overlay so foreground
 * content (white/glass cards) stays readable.
 *
 * Usage: place <MovingBackground /> as the first child of a
 * `relative min-h-screen` wrapper, and put page content in a
 * sibling with `relative z-10`.
 */
export const backgroundImages = Object.values(
  import.meta.glob('../../assets/photo/*.{webp,jpg,jpeg,png,avif}', {
    eager: true,
    import: 'default',
  })
);

export default function MovingBackground({ interval = 6000 }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % backgroundImages.length),
      interval
    );
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div className="no-print pointer-events-none fixed inset-0 z-0">
      {backgroundImages.length > 0 ? (
        backgroundImages.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <div
              className="h-full w-full bg-cover bg-center animate-kenburns"
              style={{ backgroundImage: `url(${src})` }}
            />
          </div>
        ))
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900" />
      )}
      {/* Readability overlay — matches the landing page (lighter) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/30 via-transparent to-blue-900/20" />
    </div>
  );
}
