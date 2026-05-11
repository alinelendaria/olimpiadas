'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [visible,  setVisible]  = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => { if (p >= 100) { clearInterval(iv); return 100; } return p + 5; });
    }, 40);
    const to = setTimeout(() => setVisible(false), 1400);
    return () => { clearInterval(iv); clearTimeout(to); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <span className="text-5xl mb-4">🏅</span>
          <p className="text-base font-bold text-gray-900 mb-5">Olimpíadas TDJ</p>
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
