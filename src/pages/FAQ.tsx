import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useTranslation } from 'react-i18next';

export default function FAQPage() {
  const { content, loading } = useContent();
  const { t, i18n: { language } } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  if (loading || !content) {
    return <div className="bg-[#070712] min-h-screen flex items-center justify-center"><div className="neon-spinner" /></div>;
  }

  const filtered = content.faq.filter(item => {
    const q = item.question[language] || item.question['en'];
    const a = item.answer[language] || item.answer['en'];
    return q.toLowerCase().includes(search.toLowerCase()) || a.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-[#070712] text-white pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-12">
          <div className="section-badge mb-4"><HelpCircle size={12} />FAQ</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('faq.title', 'Frequently Asked')} <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('faq.subtitle', 'Find answers to common questions.')}</p>
        </motion.div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="input-field !pl-10" placeholder="Search questions..." />
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {filtered.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                activeIndex === i ? 'ring-1 ring-[#14f195]/20' : 'glass'
              }`}
            >
              <button onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold text-gray-200 pr-4 text-sm">{item.question[language] || item.question['en']}</span>
                <motion.div animate={{ rotate: activeIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={16} className={activeIndex === i ? 'text-[#14f195]' : 'text-gray-600'} />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-white/[0.05] pt-4">
                      {item.answer[language] || item.answer['en']}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">No questions found matching "{search}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
