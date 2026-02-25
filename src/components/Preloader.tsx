import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070712]"
        >
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="relative flex flex-col items-center gap-6">
            {/* Logo + spinner */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14f195] to-[#0ea572] flex items-center justify-center shadow-[0_0_40px_rgba(20,241,149,0.4)]">
                <span className="text-[#070712] text-2xl font-black" style={{fontFamily:'Syne,sans-serif'}}>A</span>
              </div>
              <div className="absolute -inset-2 rounded-3xl border border-[#14f195]/20 animate-ping" style={{animationDuration:'1.5s'}} />
            </div>
            
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="gradient-text font-black text-xl tracking-[0.3em] uppercase"
                style={{fontFamily:'Syne,sans-serif'}}
              >
                Alpha Ultimate
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-700 text-xs tracking-[0.2em] uppercase mt-1"
              >
                Loading...
              </motion.p>
            </div>

            {/* Progress bar */}
            <motion.div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-[#14f195] to-[#9945ff] rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
