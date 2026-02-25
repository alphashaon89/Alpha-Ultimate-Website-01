import { motion } from 'framer-motion';
import { useState } from 'react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { useTranslation } from 'react-i18next';
import { Play, Camera } from 'lucide-react';

const galleries = {
  all: [
    { type: 'video', src: '/src/assets/gallery-1.mp4', label: 'Living Room' },
    { type: 'video', src: '/src/assets/gallery-2.mp4', label: 'Kitchen' },
    { type: 'video', src: '/src/assets/gallery-3.mp4', label: 'Bathroom' },
    { type: 'video', src: '/src/assets/gallery-bathroom-1.mp4', label: 'Deep Bath' },
    { type: 'video', src: '/src/assets/gallery-living-1.mp4', label: 'Deep Living' },
    { type: 'image', src: '/src/assets/gallery-kitchen-1.png', label: 'Kitchen Result' },
    { type: 'image', src: '/src/assets/gallery-whole-home-1.png', label: 'Whole Home' },
  ],
};

const beforeAfterPairs = [
  { before: '/src/assets/before-1.png', after: '/src/assets/after-1.png', title: 'Living Room Transformation' },
  { before: '/src/assets/before-2.png', after: '/src/assets/after-2.png', title: 'Kitchen Deep Clean' },
];

export default function Gallery() {
  const { t } = useTranslation();
  return (
    <div className="bg-[#070712] text-white pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="section-badge mb-4"><Camera size={12} />Gallery</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            Our <span className="gradient-text">Work</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Witness the transformations. Every clean tells a story.</p>
        </motion.div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {galleries.all.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl overflow-hidden aspect-video"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {item.type === 'video' ? (
                <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">{item.label}</span>
              </div>
              {item.type === 'video' && (
                <div className="absolute top-3 right-3">
                  <div className="w-7 h-7 rounded-full bg-[#14f195]/80 backdrop-blur-sm flex items-center justify-center">
                    <Play size={10} className="ml-0.5 text-black" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Before/After Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="section-badge mb-4">Transformations</div>
          <h2 className="text-3xl md:text-4xl font-black text-white" style={{fontFamily:'Syne,sans-serif'}}>
            Before <span className="gradient-text">&</span> After
          </h2>
        </motion.div>
        <div className="space-y-16">
          {beforeAfterPairs.map((pair, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-center text-lg font-bold text-gray-300 mb-5">{pair.title}</h3>
              <BeforeAfterSlider before={pair.before} after={pair.after} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
