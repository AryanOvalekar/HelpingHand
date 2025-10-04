import React from 'react'
import { Link } from 'react-router-dom'
import './Homepage.css'

const Homepage = () => {
  return (
    <div className="homepage">
      <h1 className="homepage-title">Name Here</h1>
      <p className="homepage-description">
        Helping the community, one <span className="gradient-text">step</span> at a time
      </p>
      <div className="homepage-buttons">
        <Link to="/list" className="homepage-button">Start Helping</Link>
        <Link to="/map" className="homepage-button-outline">View Map</Link>
      </div>
    </div>
  )
}

export default Homepage