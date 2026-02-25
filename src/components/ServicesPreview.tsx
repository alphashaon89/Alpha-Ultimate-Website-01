import { motion } from 'framer-motion';
import { Home, Building, Sun, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ServicesPreview() {
  const { t } = useTranslation();

  const services = [
    { icon: Home, title: t('servicesPreview.services.residential.title'), description: t('servicesPreview.services.residential.description'), color: '#14f195', gradient: 'from-[#14f195]/10 to-transparent' },
    { icon: Building, title: t('servicesPreview.services.commercial.title'), description: t('servicesPreview.services.commercial.description'), color: '#9945ff', gradient: 'from-[#9945ff]/10 to-transparent' },
    { icon: Sun, title: t('servicesPreview.services.deepCleaning.title'), description: t('servicesPreview.services.deepCleaning.description'), color: '#ff6b35', gradient: 'from-[#ff6b35]/10 to-transparent' },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute left-0 top-1/2 w-80 h-80 rounded-full bg-[#14f195]/5 blur-[100px] -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-badge mb-4">What We Offer</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('servicesPreview.title')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('servicesPreview.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="spark-border p-8 flex flex-col group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6`}
                  style={{ border: `1px solid ${service.color}20` }}>
                  <Icon size={28} style={{ color: service.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white" style={{fontFamily:'Syne,sans-serif'}}>{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-6">{service.description}</p>
                <NavLink to="/services" className="flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-3"
                  style={{ color: service.color }}>
                  {t('servicesPreview.learnMore')}
                  <ArrowRight size={14} />
                </NavLink>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
