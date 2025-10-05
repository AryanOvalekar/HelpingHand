import React, { forwardRef } from 'react'
import './EventCard.css'

const EventCard = forwardRef(({ event, isVisible, cardIndex }, ref) => {
  // Helper function to format time ago
  const formatTimeAgo = (publishedAt) => {
    if (!publishedAt) return '2 hours ago' // hardcoded fallback
    const now = new Date()
    const published = new Date(publishedAt)
    const diffMs = now - published
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Less than an hour ago'
    }
  }

  // Helper function to get category display info
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

  // Helper function to get need info
  const getNeedInfo = (need) => {
    switch(need) {
      case 0:
      case 'food':
        return { type: 'food', emoji: '🍲', color: '#fd7e14', label: 'Food Needed' }
      case 1:
      case 'clothing':
        return { type: 'clothing', emoji: '👕', color: '#6f42c1', label: 'Clothing Needed' }
      case 2:
      case 'money':
        return { type: 'money', emoji: '💰', color: '#28a745', label: 'Funds Needed' }
      default:
        return { type: 'help', emoji: '🏃‍♂️', color: '#dc3545', label: 'Help Needed' }
    }
  }

  // Helper function to format location
  const formatLocation = (location) => {
    if (!location) return 'Location not specified'
    
    // Split by comma and filter out empty strings and "unknown" values
    const parts = location.split(',')
      .map(part => part.trim())
      .filter(part => part && part.toLowerCase() !== 'unknown')
    
    // Join the remaining parts
    return parts.length > 0 ? parts.join(', ') : 'Location not specified'
  }

  const timeAgo = formatTimeAgo(event.publishedAt)
  const categoryInfo = getCategoryInfo(event.category)
  const needInfo = getNeedInfo(event.need)
  const distance = '2.3 km away' // hardcoded for now
  const formattedLocation = formatLocation(event.location)

  const handleReadMore = () => {
    if (event.articleLink || event.url) {
      window.open(event.articleLink || event.url, '_blank')
    }
  }

  return (
    <div 
      ref={ref}
      data-card-index={cardIndex}
      className={`crisis-card ${isVisible ? 'slide-in' : 'slide-hidden'} ${event.severity ? 'severe' : ''}`}
    >
      {/* Main card content - horizontal layout */}
      <div className="crisis-card-inner">
        {/* Left side - Image */}
        <div className="crisis-image">
          <img src={event.imageLink || event.urlToImage} alt={event.title} />
          {event.severity && (
            <div className="severity-overlay">
              <div className="severity-indicator" title="This incident has been classified as severe">
                ⚠ SEVERE
              </div>
            </div>
          )}
        </div>

        {/* Right side - Content */}
        <div className="crisis-content">
          <h2 className="crisis-title">{event.title}</h2>
          
          {/* Category and Need badges with time below title */}
          <div className="badges-time-container">
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
            <div className="time-info">{timeAgo}</div>
          </div>
          
          <p className="crisis-description">{event.description}</p>
          
          <div className="location-distance">
            <span className="location">📍 {formattedLocation}</span>
            <span className="distance">{distance}</span>
          </div>

          {/* Action button */}
          <button className="read-more-btn" onClick={handleReadMore}>
            Read Full Article
          </button>
        </div>
      </div>
    </div>
  )
})

EventCard.displayName = 'EventCard'

export default EventCard