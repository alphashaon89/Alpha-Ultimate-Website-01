import { NavLink } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.pricing'), path: '/pricing' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.contact'), path: '/contact' },
    { name: t('nav.faq'), path: '/faq' },
  ];

  return (
    <header
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#070712]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#14f195] to-[#0ea572] flex items-center justify-center shadow-lg shadow-[#14f195]/20 group-hover:shadow-[#14f195]/40 transition-shadow">
              <img
                src="/assets/alpha-logo.png"
                alt="Alpha Ultimate"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                loading="eager"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black tracking-widest text-white" style={{ fontFamily: 'Syne,sans-serif' }}>ALPHA</span>
            <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] text-[#14f195]/70 block uppercase -mt-1">Ultimate</span>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive ? 'text-[#14f195]' : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#14f195] to-[#00d2ff] rounded-full shadow-[0_0_6px_rgba(20,241,149,0.8)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <NavLink
            to="/booking"
            className="hidden md:flex btn-primary items-center gap-2 text-sm py-2.5 px-5"
          >
            <Sparkles size={14} />
            {t('nav.book')}
          </NavLink>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="md:hidden text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 top-[57px] bg-[#070712]/60 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="md:hidden relative bg-[#0a0a18]/98 backdrop-blur-2xl border-t border-white/[0.05] overflow-hidden z-50"
            >
              <nav className="flex flex-col py-4 px-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `py-3.5 px-4 text-base font-semibold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'text-[#14f195] bg-[#14f195]/8'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                <div className="pt-4 pb-2 border-t border-white/5 mt-2">
                  <NavLink
                    to="/booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary flex items-center justify-center gap-2 text-sm w-full"
                  >
                    <Sparkles size={14} />
                    {t('nav.book')}
                  </NavLink>
                </div>
              </nav>
              {/* Safe area bottom padding for iOS */}
              <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
