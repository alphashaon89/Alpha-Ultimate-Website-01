import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, ArrowRight } from 'lucide-react';

const galleryItems = [
  { src: '/src/assets/gallery-1.mp4' },
  { src: '/src/assets/gallery-2.mp4' },
  { src: '/src/assets/gallery-3.mp4' },
];

export default function GalleryTeaser() {
  const { t } = useTranslation();
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a18]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00d2ff]/5 blur-[100px]" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="section-badge mb-4">Visual Proof</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('galleryTeaser.title')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('galleryTeaser.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-white text-xs font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#14f195] flex items-center justify-center">
                    <Play size={8} className="ml-0.5 text-black" />
                  </div>
                  Playing
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <NavLink to="/gallery" className="btn-secondary inline-flex items-center gap-2">
            {t('galleryTeaser.cta')}
            <ArrowRight size={15} />
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
}
