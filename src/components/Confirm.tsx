import React from 'react';
import './styles/Confirm.css';
type Props = { title?:string; message:string; onConfirm:()=>void; onCancel:()=>void };
const Confirm:React.FC<Props> = ({title,message,onConfirm,onCancel})=>{
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-card">
        {title && <h3>{title}</h3>}
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn confirm-ok" onClick={onConfirm}>OK</button>
        </div>
      </div>
    </div>
  )
}
export default Confirm;

