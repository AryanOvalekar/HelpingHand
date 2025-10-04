import React from 'react'
import { Link } from 'react-router-dom'
import './Homepage.css'

const Homepage = () => {
  return (
    <div className="homepage">
      <h1 className="homepage-title">Helping Hand</h1>
      <p className="homepage-description">
        <span className="gradient-text">Helping</span> the community, one step at a time
      </p>
      <div className="homepage-buttons">
        <Link to="/map" className="homepage-button">Start Helping</Link>
        <Link to="/about-us" className="homepage-button-outline">Our Mission</Link>
      </div>
    </div>
  )
}

export default Homepage