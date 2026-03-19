import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1600',
    title: 'Tu pasión por el agua,',
    highlight: 'en un solo lugar.',
    subtitle: 'Descubre la mejor selección de peces, plantas y accesorios para tu acuario en Colombia.',
  },
  {
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=1600',
    title: 'Peces tropicales',
    highlight: 'de todo el mundo.',
    subtitle: 'Discos, Bettas, Tetras, Cuchas y más de 90 especies disponibles.',
  },
  {
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1600',
    title: 'Acuarios plantados',
    highlight: 'llenos de vida.',
    subtitle: 'Todo lo que necesitas: CO2, sustratos, fertilizantes, herramientas y lámparas.',
  },
];

interface Props {
  onViewCatalog: () => void;
}

export default function HeroCarousel({ onViewCatalog }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <section className="mb-8 md:mb-12 relative rounded-2xl md:rounded-3xl overflow-hidden bg-brand-dark">
      {/* Aspect ratio container */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/9] flex items-end md:items-center">
        {/* Background images — crossfade */}
        {SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === current ? 'opacity-50' : 'opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />

        {/* Content */}
        <div className="relative z-10 px-6 pb-8 md:px-16 lg:px-20 md:pb-0 max-w-3xl">
          <h2
            key={current}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-5 leading-tight animate-[fadeInUp_0.6s_ease-out]"
          >
            {slide.title} <br />
            <span className="text-cyan-300">{slide.highlight}</span>
          </h2>
          <p className="text-white/80 text-sm md:text-lg lg:text-xl mb-5 md:mb-8 hidden sm:block max-w-xl leading-relaxed">
            {slide.subtitle}
          </p>
          <button
            onClick={onViewCatalog}
            className="bg-white text-brand-dark px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-cyan-50 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
          >
            Ver Catálogo <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Nav arrows — desktop only */}
        <button
          onClick={prev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/40 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/40 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 h-2.5 bg-white'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
