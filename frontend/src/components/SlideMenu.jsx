import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SlideMenu.css'

const SlideMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="slide-menu-toggle"
      >
        {isOpen ? 'Close -' : 'Menu +'}
      </button>

      {/* Menu Panel */}
      <div className={`slide-menu-panel ${isOpen ? 'open' : 'closed'}`}>
        <div className={`slide-menu-item ${isOpen ? 'open' : 'closed'}`}>
          <Link to="/" className="slide-menu-link">Home</Link>
        </div>
        <div className={`slide-menu-item ${isOpen ? 'open' : 'closed'}`}>
          <Link to="/map" className="slide-menu-link">Map</Link>
        </div>
        <div className={`slide-menu-item ${isOpen ? 'open' : 'closed'}`}>
          <Link to="/list" className="slide-menu-link">List</Link>
        </div>
        <div className={`slide-menu-item ${isOpen ? 'open' : 'closed'}`}>
          <Link to="/about-us" className="slide-menu-link">About</Link>
        </div>
      </div>
    </>
  )
}

export default SlideMenu