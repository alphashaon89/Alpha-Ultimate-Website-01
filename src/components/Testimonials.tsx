import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { useContent } from '../hooks/useContent';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Testimonials() {
  const { t, i18n: { language } } = useTranslation();
  const { content } = useContent();
  const testimonials = content?.testimonials || [];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#14f195]/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="section-badge mb-4">Client Stories</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            {t('testimonials.title')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={testimonials.length > 1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-14"
          >
            {testimonials.map((testimonial, i) => (
              <SwiperSlide key={i}>
                <div className="spark-border p-7 h-full flex flex-col">
                  <Quote size={28} className="text-[#14f195]/30 mb-4" />
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-[#ffda00] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-400 italic text-sm leading-relaxed flex-grow mb-6">
                    "{testimonial.text[language] || testimonial.text['en']}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#14f195]/30 to-[#9945ff]/30 flex items-center justify-center text-xs font-bold text-white">
                      {(testimonial.name[language] || testimonial.name['en'])?.[0]}
                    </div>
                    <span className="font-bold text-white text-sm">{testimonial.name[language] || testimonial.name['en']}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
