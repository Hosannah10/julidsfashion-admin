import React, { createContext, useContext, useState, type ReactNode } from 'react';
type Toast = { id:number; title?:string; message:string };
type ToastCtx = { toasts:Toast[]; showToast:(message:string,title?:string)=>void; hideToast:(id:number)=>void };

const ToastContext = createContext<ToastCtx|undefined>(undefined);

export const ToastProvider:React.FC<{children:ReactNode}> = ({children})=>{
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message:string, title?:string) => {
    const id = Date.now() + Math.floor(Math.random()*1000);
    setToasts(t => [...t, { id, title, message }]);
  };
  const hideToast = (id:number) => setToasts(t => t.filter(x=>x.id!==id));
  return <ToastContext.Provider value={{ toasts, showToast, hideToast }}>{children}</ToastContext.Provider>
}

export const useToast = ()=> {
  const ctx = useContext(ToastContext);
  if(!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
