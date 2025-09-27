'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PhotoLibrary from './photo-library';

export default function PolaroidDeveloping({ onClose }: { onClose: () => void }) {
  const [developing, setDeveloping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDeveloping(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const filmHeight = Math.ceil((window.innerHeight * 0.9));

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: developing ? [0, -5, 5, -3, 3, 0] : 0 }}
        transition={{ rotate: { repeat: developing ? 3 : 0, duration: 0.4 } }}
        className="w-160 bg-white rounded-lg shadow-lg pt-8 pr-8 pb-24 pl-8 relative"
        style={{
            height: filmHeight
        }}
        >
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: developing ? 0 : 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full h-full bg-black"
        />

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: developing ? 1 : 0 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute inset-0 bg-white rounded-lg shadow-lg pt-8 pr-8 pb-24 pl-8 flex flex-col p-4 overflow-hidden"
        >
            <PhotoLibrary onClose={onClose} photos={[
                {src: '/assets/images/IMG_7008.jpg', alt: 'Camps Bay'},
                {src: '/assets/images/IMG_7011.jpg', alt: 'Mokoro'},
                {src: '/assets/images/IMG_7013.jpg', alt: 'Victoria Falls'},
                {src: '/assets/images/IMG_7015.jpg', alt: 'Vic Falls Bridge'},
                {src: '/assets/images/IMG_7009.jpg', alt: 'Table Mountain'},
                {src: '/assets/images/IMG_7012.jpg', alt: 'Elephants'},
                {src: '/assets/images/IMG_7010.jpg', alt: 'Safari Car'},
                {src: '/assets/images/IMG_7017.jpg', alt: 'Elephant Skull'}
            ]}/>
        </motion.div>
        </motion.div>

    </div>
  );
}