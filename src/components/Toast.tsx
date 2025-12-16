import React from 'react';
import { useToast } from '../context/ToastContext';
import './styles/Toast.css';

const Toast:React.FC = ()=>{
  const { toasts, hideToast } = useToast();
  if(!toasts.length) return null;
  const t = toasts[toasts.length-1];
  return (
    <div className="toast-overlay" role="dialog" aria-modal="true">
      <div className="toast-card">
        {t.title && <h3 className="toast-title">{t.title}</h3>}
        <p className="toast-message">{t.message}</p>
        <div className="toast-actions">
          <button className="btn toast-ok" onClick={()=>hideToast(t.id)}>OK</button>
        </div>
      </div>
    </div>
  )
}
export default Toast;

