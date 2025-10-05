import React, { useState, useEffect, useRef } from 'react'
import EventCard from './EventCard'
import './EventList.css'

const EventList = ({ events, userLocation, calculateDistance }) => {
  const [visibleCards, setVisibleCards] = useState(new Set())
  const cardRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.dataset.cardIndex);
            // Immediate animation without delay
            setVisibleCards(prev => new Set([...prev, cardIndex]));
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the card is visible
        rootMargin: '20px 0px -20px 0px' // Reduced margin for quicker trigger
      }
    );

    // Observe all card elements
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="events-feed">
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          ref={el => cardRefs.current[index] = el}
          event={event}
          cardIndex={index}
          isVisible={visibleCards.has(index)}
          userLocation={userLocation}
          calculateDistance={calculateDistance}
        />
      ))}
    </div>
  )
}

export default EventList