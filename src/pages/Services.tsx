import { motion } from 'framer-motion';
import { Home, Building, Sun, Wind, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContent } from '../hooks/useContent';
import { NavLink } from 'react-router-dom';

const ICON_MAP: Record<string, any> = {
  'post-construction': Building,
  'move-in-out': Wind,
  'full-deep': Sun,
  'standard': Home,
  'kitchen': Home,
  'bathroom': Home,
  'sofa': Home,
  'office': Building,
};

const COLORS = ['#14f195','#9945ff','#ff6b35','#00d2ff','#ffda00','#14f195','#9945ff','#ff6b35'];

export default function Services() {
  const { t, i18n: { language } } = useTranslation();
  const { content, loading } = useContent();

  if (loading || !content) {
    return (
      <div className="bg-[#070712] min-h-screen flex items-center justify-center">
        <div className="neon-spinner" />
      </div>
    );
  }

  return (
    <div className="bg-[#070712] text-white pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="section-badge mb-4">Services</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('services.title', 'Our Cleaning')} <span className="gradient-text">Services</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('services.subtitle', 'Tailored solutions for every space.')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.services.map((service, i) => {
            const Icon = ICON_MAP[service.id] || Home;
            const color = COLORS[i % COLORS.length];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }} transition={{ delay: i * 0.08 }}
                className="spark-border overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img src={service.image} alt={service.title[language] || service.title['en']}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/800/400?random=${i+10}`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070712]/80 to-transparent" />
                </div>
                
                <div className="p-7 flex-grow flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white" style={{fontFamily:'Syne,sans-serif'}}>{service.title[language] || service.title['en']}</h3>
                      {service.duration && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={12} style={{ color }} />
                          <span className="text-xs font-medium" style={{ color }}>{service.duration[language] || service.duration['en']}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-grow">{service.description[language] || service.description['en']}</p>
                  
                  {service.includedItems && (
                    <ul className="space-y-1.5 mb-5">
                      {(service.includedItems[language] || service.includedItems['en'])?.slice(0, 3).map((item: string, j: number) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle size={12} style={{ color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <NavLink to="/booking" className="flex items-center gap-2 text-sm font-bold group transition-all duration-300"
                    style={{ color }}>
                    Book This Service <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
