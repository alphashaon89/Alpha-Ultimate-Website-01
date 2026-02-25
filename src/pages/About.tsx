import { useSEO } from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function About() {
  useSEO({ title: "About Us", description: "Learn about Alpha Ultimate, Riyadh trusted premium cleaning company. Our mission, values, and team.", canonical: "/about" });
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-[#0D0D0D] text-white pt-28 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">{t('about.subtitle')}</p>
        </motion.div>

        <div className="bg-[#1a1a1a] p-12 rounded-xl border border-gray-800 mb-20">
          <h2 className="text-4xl font-bold mb-6 text-center">{t('about.story.title')}</h2>
          <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto text-center">{t('about.story.text')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold mb-6">{t('about.mission.title')}</h2>
            <p className="text-gray-400 leading-relaxed">{t('about.mission.text')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="spark-border p-8 rounded-xl"
          >
            <h2 className="text-4xl font-bold mb-6">{t('about.vision.title')}</h2>
            <p className="text-gray-400 leading-relaxed">{t('about.vision.text')}</p>
          </motion.div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-center mb-12">{t('about.team.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(t('about.team.members', { returnObjects: true }) as any[]).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="text-center spark-border-light p-8"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 mx-auto rounded-full mb-4 object-cover"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-2xl font-bold">{member.name}</h3>
                <p className="text-gray-400">{member.title[i18n.language] || member.title['en']}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
