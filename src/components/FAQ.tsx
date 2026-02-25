import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { content, loading } = useContent();
  const { t, i18n: { language } } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (loading || !content) return null;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a18]" />
      <div className="absolute inset-0 grid-pattern opacity-25" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="section-badge mb-4">
            <HelpCircle size={12} />
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('faq.title')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('faq.subtitle')}</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {content.faq.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                activeIndex === i 
                  ? 'border border-[#14f195]/20 bg-[#14f195]/03' 
                  : 'glass'
              }`}
              style={{ border: activeIndex === i ? '1px solid rgba(20,241,149,0.15)' : undefined }}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-base font-semibold text-gray-200 pr-4">{item.question[language] || item.question['en']}</span>
                <motion.div animate={{ rotate: activeIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={18} className={activeIndex === i ? 'text-[#14f195]' : 'text-gray-600'} />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-white/[0.05] pt-4">
                      {item.answer[language] || item.answer['en']}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
