import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Smile, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const COLORS = ['#14f195','#9945ff','#ff6b35','#00d2ff'];

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const features = [
    { icon: ShieldCheck, title: t('whyChooseUs.features.trustedProfessionals.title'), description: t('whyChooseUs.features.trustedProfessionals.description') },
    { icon: Sparkles, title: t('whyChooseUs.features.ecoFriendlyProducts.title'), description: t('whyChooseUs.features.ecoFriendlyProducts.description') },
    { icon: Smile, title: t('whyChooseUs.features.satisfactionGuaranteed.title'), description: t('whyChooseUs.features.satisfactionGuaranteed.description') },
    { icon: Clock, title: t('whyChooseUs.features.flexibleScheduling.title'), description: t('whyChooseUs.features.flexibleScheduling.description') },
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#9945ff]/6 blur-[100px]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-badge mb-4">Our Advantages</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('whyChooseUs.title').split('?')[0]}<span className="gradient-text">?</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('whyChooseUs.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const color = COLORS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="spark-border p-7 group cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white" style={{fontFamily:'Syne,sans-serif'}}>{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
