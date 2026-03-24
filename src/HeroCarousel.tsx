import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://i.postimg.cc/nLCcKrb9/Betta_dumbo_Photoroom.jpg',
    title: 'Tu pasión por el agua,',
    highlight: 'en un solo lugar.',
    subtitle: 'Descubre la mejor selección de peces, plantas y accesorios para tu acuario en Colombia.',
  },
  {
    image: 'https://i.postimg.cc/brmnJVkq/Pareja_Discos.png',
    title: 'Peces tropicales',
    highlight: 'de todo el mundo.',
    subtitle: 'Discos, Bettas, Tetras, Cuchas y más de 90 especies disponibles.',
  },
  {
    image: 'https://i.postimg.cc/sxTWXH7z/Procambarus.png',
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
    <section className="mb-10 md:mb-14 relative rounded-2xl md:rounded-3xl overflow-hidden bg-brand-dark shadow-xl">
      {/* Aspect ratio container */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/9] flex items-end md:items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#0a2540] to-cyan-900" />

        {/* Fish images — crossfade, positioned right, with CSS mask for soft edges */}
        {SLIDES.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt=""
            className={`absolute right-0 md:right-[5%] top-1/2 -translate-y-1/2 h-[80%] md:h-[90%] object-contain transition-all duration-1000 drop-shadow-[0_0_40px_rgba(0,200,255,0.3)] ${
              i === current ? 'opacity-80 scale-100' : 'opacity-0 scale-90'
            }`}
            referrerPolicy="no-referrer"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 72%)',
              maskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 72%)',
            }}
          />
        ))}

        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />

        {/* Content */}
        <div className="relative z-10 px-8 pb-10 md:px-20 lg:px-28 md:pb-0 max-w-3xl">
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
