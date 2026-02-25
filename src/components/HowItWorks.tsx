import { motion } from 'framer-motion';
import { Calendar, Home, Sparkles, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ICONS = [Phone, Home, Sparkles, Calendar];
const COLORS = ['#14f195','#9945ff','#ff6b35','#00d2ff'];

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { icon: ICONS[0], title: t('howItWorks.steps.book.title'), description: t('howItWorks.steps.book.description') },
    { icon: ICONS[1], title: t('howItWorks.steps.arrive.title'), description: t('howItWorks.steps.arrive.description') },
    { icon: ICONS[2], title: t('howItWorks.steps.clean.title'), description: t('howItWorks.steps.clean.description') },
    { icon: ICONS[3], title: t('howItWorks.steps.enjoy.title'), description: t('howItWorks.steps.enjoy.description') },
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#14f195]/5 blur-[100px]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="section-badge mb-4">Our Process</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('howItWorks.title')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('howItWorks.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const color = COLORS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-12px)] w-[calc(100%-24px)] h-px z-10"
                    style={{ background: `linear-gradient(90deg, ${color}40, ${COLORS[i+1]}40)` }} />
                )}
                <div className="spark-border p-7 text-center h-full">
                  <div className="relative inline-flex mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                      <Icon size={26} style={{ color }} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: color, color: '#070712' }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white" style={{fontFamily:'Syne,sans-serif'}}>{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
