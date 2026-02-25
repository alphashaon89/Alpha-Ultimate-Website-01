import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, ChevronDown, Phone } from 'lucide-react';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden flex items-center">
      {/* Video Background — proper production path + mobile fallback */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/assets/after-1.png"
        preload="metadata"
      >
        <source src="/assets/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070712]/70 via-[#070712]/50 to-[#070712] z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070712]/40 via-transparent to-[#070712]/20 z-10" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-[#14f195]/8 blur-[80px] sm:blur-[120px] z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-[#9945ff]/8 blur-[60px] sm:blur-[100px] z-10 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-10" />

      <div className="relative z-20 w-full px-4 sm:px-6 pt-28 pb-24 sm:py-32 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 sm:mb-6"
        >
          <span className="section-badge text-xs sm:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14f195] animate-pulse" />
            24/7 Premium Cleaning — Riyadh
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 sm:mb-6 leading-[1] sm:leading-[0.95] px-2"
          style={{ fontFamily: 'Syne,sans-serif' }}
        >
          <span className="text-white">
            {t('hero.title').split(' ').slice(0, 1).join(' ')}
          </span>{' '}
          <span className="gradient-text">
            {t('hero.title').split(' ').slice(1).join(' ')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 text-gray-400 leading-relaxed px-2"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
        >
          <NavLink
            to="/booking"
            className="btn-primary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Sparkles size={15} />
            {t('hero.cta.book')}
          </NavLink>
          <NavLink
            to="/services"
            className="btn-secondary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            {t('hero.cta.services')}
          </NavLink>
          <a
            href="https://wa.me/966563906822"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#25D366] transition-colors font-semibold py-2"
          >
            <Phone size={15} />
            WhatsApp Us
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 sm:mt-20 grid grid-cols-3 gap-3 sm:gap-4 max-w-sm sm:max-w-lg mx-auto px-2"
        >
          {[
            { val: '500+', label: 'Happy Clients' },
            { val: '24/7', label: 'Service Hours' },
            { val: '100%', label: 'Satisfaction' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-xl p-3 sm:p-4 text-center">
              <div
                className="text-xl sm:text-2xl font-black gradient-text"
                style={{ fontFamily: 'Syne,sans-serif' }}
              >
                {stat.val}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-600"
      >
        <span className="text-[10px] sm:text-xs tracking-widest uppercase font-medium">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </div>
  );
}
