import React, { forwardRef } from 'react'
import './EventCard.css'

const EventCard = forwardRef(({ event, isVisible, cardIndex }, ref) => {
  return (
    <div 
      ref={ref}
      data-card-index={cardIndex}
      className={`event-card ${isVisible ? 'slide-in' : 'slide-hidden'} ${event.severity ? 'severe' : ''}`}
    >
      {event.severity && (
        <div className="severity-indicator" title="This incident has been classified as severe">
          ⚠️
        </div>
      )}
      <h2 className="event-title">{event.title}</h2>
      <div className="event-body">
        <div className="event-image">
          <img src={event.imageLink} alt={event.title} />
        </div>
        <div className="event-content">
          <p className="event-description">{event.description}</p>
        </div>
      </div>
    </div>
  )
})

EventCard.displayName = 'EventCard'

export default EventCard