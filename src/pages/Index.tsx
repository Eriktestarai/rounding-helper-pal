
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto text-center space-y-8"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto rounded-full bg-blue-50 p-6 w-24 h-24 flex items-center justify-center"
        >
          <span className="text-4xl">🔢</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
        >
          Matematikhjälpmedel
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Ett elegant verktyg för att träna på matematisk avrundning, utformat med inspiration från minimalistisk designfilosofi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pt-6"
        >
          <Link to="/avrunda">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full px-8 py-6 flex items-center gap-2 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
            >
              <span>Träna på avrundning</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col md:flex-row gap-8 mt-16 justify-center"
        >
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xs">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Intuitiv design</h3>
            <p className="text-gray-600">Ett elegant gränssnitt som fokuserar på funktionalitet och användarvänlighet.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xs">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Visuellt stöd</h3>
            <p className="text-gray-600">Tallinje som hjälper dig förstå avrundningsprinciper på ett visuellt sätt.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xs">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Interaktiv övning</h3>
            <p className="text-gray-600">Övningsläge som ger dig direkt feedback på dina svar med slumpmässiga tal.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
