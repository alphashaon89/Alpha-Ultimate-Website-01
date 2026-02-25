import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Phone } from 'lucide-react';

export default function CtaBand() {
  const { t } = useTranslation();
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#14f195]/10 via-[#070712] to-[#9945ff]/10" />
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14f195]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9945ff]/30 to-transparent" />
          
          {/* Orbs */}
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[#14f195]/8 blur-[80px] -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-[#9945ff]/8 blur-[60px] -translate-y-1/2" />
          
          <div className="relative z-10 text-center py-20 px-8">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="section-badge mb-6">Get Started Today</div>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-white" style={{fontFamily:'Syne,sans-serif'}}>
              {t('ctaBand.title')}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">{t('ctaBand.subtitle')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink to="/booking" className="btn-primary flex items-center gap-2">
                <Sparkles size={16} />
                {t('ctaBand.cta')}
              </NavLink>
              <a href="https://wa.me/966563906822" target="_blank" rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2">
                <Phone size={15} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
