import React from 'react'
import '../components/styles/Hamburger.css'

const Hamburger: React.FC<{open:boolean,onToggle:()=>void}> = ({open,onToggle})=>{
  return (
    <button aria-label="Toggle sidebar" className={`hamburger ${open? 'open':''}`} onClick={onToggle}>
      <span />
      <span />
      <span />
    </button>
  )
}

export default Hamburger