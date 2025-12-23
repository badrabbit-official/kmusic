'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const toasts: Toast[] = [];
const listeners: Array<() => void> = [];

export function showToast(message: string, type: ToastType = 'info') {
  const id = `toast-${toastId++}`;
  toasts.push({ id, message, type });
  listeners.forEach(listener => listener());
  
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id);
    if (index >= 0) {
      toasts.splice(index, 1);
      listeners.forEach(listener => listener());
    }
  }, 3000);
}

export function ToastContainer() {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const update = () => setToastList([...toasts]);
    listeners.push(update);
    update();
    
    return () => {
      const index = listeners.indexOf(update);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toastList.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-2xl pointer-events-auto flex items-center gap-3 min-w-[250px] max-w-[400px]"
            style={{
              borderColor: toast.type === 'success' ? 'rgba(0,255,100,0.3)' : 
                          toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 
                          'rgba(156,163,175,0.3)'
            }}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-lime-400 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />}
            <p className="text-white text-sm flex-1">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

