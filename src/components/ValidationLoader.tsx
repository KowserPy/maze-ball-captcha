
import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const ValidationLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader className="w-12 h-12 text-purple-400 mx-auto" />
        </motion.div>
        
        <h3 className="text-xl font-bold text-white mb-2">
          Validating Solution
        </h3>
        
        <div className="space-y-2 text-sm text-gray-300">
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Verifying your path...
          </motion.div>
          
          <div className="flex justify-center space-x-1 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2 
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ValidationLoader;
