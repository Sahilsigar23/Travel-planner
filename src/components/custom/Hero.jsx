import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaMapMarkedAlt, FaRobot, FaWallet } from 'react-icons/fa';

/**
 * Background images are auto-collected from src/assets/photo/.
 * Drop any .webp/.jpg/.png/.avif into that folder and it will
 * automatically join the moving background slideshow — no code changes needed.
 */
const backgroundImages = Object.values(
  import.meta.glob('../../assets/photo/*.{webp,jpg,jpeg,png,avif}', {
    eager: true,
    import: 'default',
  })
);

const stats = [
  { value: '50K+', label: 'Trips Planned' },
  { value: '180+', label: 'Countries' },
  { value: '4.9★', label: 'Avg. Rating' },
];

const features = [
  {
    icon: <FaRobot />,
    title: 'AI-Powered Itineraries',
    desc: 'Smart day-by-day plans tailored to your taste, generated in seconds.',
  },
  {
    icon: <FaWallet />,
    title: 'Budget-Aware',
    desc: 'From backpacker to luxury — plans that respect your wallet.',
  },
  {
    icon: <FaMapMarkedAlt />,
    title: 'Curated Places & Hotels',
    desc: 'Hand-picked stays and attractions with maps, ratings and pricing.',
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  // Cycle the background slideshow
  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % backgroundImages.length),
      6000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        {/* Moving background slideshow */}
        <div className="absolute inset-0 -z-10">
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
          {/* Readability overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/30 via-transparent to-blue-900/20" />
        </div>

        {/* Floating decorative orbs */}
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -right-16 bottom-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <span className="animate-fadeUp glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white/90">
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
            AI-Powered Travel Planning
          </span>

          <h1 className="animate-fadeUp delay-100 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
            Discover Your Next <br className="hidden sm:block" />
            <span className="text-gradient">Adventure</span> with AI
          </h1>

          <p className="animate-fadeUp delay-200 mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            Personalized itineraries at your fingertips. Plan, explore, and
            experience the world like never before.
          </p>

          <div className="animate-fadeUp delay-300 mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <Link to="/create-trip">
              <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-orange-600/40">
                Get Started
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link to="/my-trips">
              <button className="glass inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/20">
                View My Trips
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fadeUp delay-400 mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm uppercase tracking-wider text-white/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        {backgroundImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {backgroundImages.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ============ FEATURES ============ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to plan the perfect trip
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Let AI handle the hard part — you just pack your bags.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-center shadow-xl">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to explore the world?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Create your first AI-generated itinerary in under a minute.
          </p>
          <Link to="/create-trip">
            <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-orange-600 shadow-lg transition-transform hover:scale-[1.03]">
              Plan My Trip
              <FaArrowRight />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Hero;
