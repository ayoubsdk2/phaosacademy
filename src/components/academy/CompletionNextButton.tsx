import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CompletionNextButtonProps {
  onClick: () => void;
  label?: string;
}

export function CompletionNextButton({ onClick, label = 'Continue to Next Module' }: CompletionNextButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
    >
      <button
        onClick={onClick}
        className="w-full rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {label}
        <ArrowRight size={20} />
      </button>
    </motion.div>
  );
}
