import React from 'react'
import './MapSidePanel.css'

const MapSidePanel = ({ incident, isOpen, onClose }) => {
  if (!incident) return null

  // Helper function to get category display info (matching EventCard)
  const getCategoryInfo = (category) => {
    switch(category) {
      case 'naturalDisaster':
        return { label: 'Disaster', color: '#dc3545', emoji: '🌪️' }
      case 'warRelief':
        return { label: 'Relief', color: '#28a745', emoji: '🏥' }
      case 'volunteerWork':
        return { label: 'Volunteering', color: '#007bff', emoji: '🤝' }
      default:
        return { label: 'Crisis', color: '#6c757d', emoji: '⚠️' }
    }
  }

  // Helper function to get need info (matching EventCard exactly)
  const getNeedInfo = (need) => {
    switch(need) {
      case 0:
        return { type: 'food', emoji: '🍲', color: '#fd7e14', label: 'Food Needed' }
      case 1:
        return { type: 'clothing', emoji: '👕', color: '#6f42c1', label: 'Clothing Needed' }
      case 2:
        return { type: 'money', emoji: '💰', color: '#28a745', label: 'Funds Needed' }
      default:
        return { type: 'help', emoji: '🏃‍♂️', color: '#dc3545', label: 'Help Needed' }
    }
  }

  const categoryInfo = getCategoryInfo(incident.category)
  const needInfo = getNeedInfo(incident.need)

  const handleReadMore = () => {
    if (incident.articleLink || incident.url) {
      window.open(incident.articleLink || incident.url, '_blank')
    }
  }

  return (
    <>
      {/* Panel */}
      <div className={`map-side-panel ${isOpen ? 'open' : 'closed'}`}>
        {/* Close Button - matching SlideMenu style */}
        <button className="map-side-panel-close" onClick={onClose}>
          Close -
        </button>

        {/* Content */}
        <div className="map-side-panel-content">
          <h2 className="map-side-panel-title">{incident.title}</h2>
          
          {/* Badges matching EventCard exactly */}
          <div className="badges-container">
            <div className="badge category-badge" style={{ backgroundColor: categoryInfo.color }}>
              <span className="badge-emoji">{categoryInfo.emoji}</span>
              <span className="badge-label">{categoryInfo.label}</span>
            </div>
            
            <div className="badge need-badge" style={{ backgroundColor: needInfo.color }}>
              <span className="badge-emoji">{needInfo.emoji}</span>
              <span className="badge-label">{needInfo.label}</span>
            </div>
          </div>

          {/* Image */}
          {(incident.imageLink || incident.urlToImage) && (
            <div className="map-side-panel-image">
              <img src={incident.imageLink || incident.urlToImage} alt={incident.title} />
              {/* High severity indicator */}
              {incident.severity && (
                <div className="severity-indicator">
                  <span className="severity-text">⚠ SEVERE</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {incident.description && (
            <p className="map-side-panel-description">{incident.description}</p>
          )}

          {/* Location matching EventCard */}
          <div className="location-container">
            <span className="location">📍 {incident.location}</span>
          </div>

          {/* Read More Button matching EventCard exactly */}
          <button className="read-more-btn" onClick={handleReadMore}>
            Read Full Article
          </button>
        </div>
      </div>
    </>
  )
}

export default MapSidePanel