import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EventList from '../components/EventList'
import './ListView.css'

const ListView = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:8000/recent')
        
        // Map API response to frontend format, preserving all fields from the model
        const mappedEvents = response.data.map((article, index) => ({
          // Article model fields
          id: article._id || article.id || index,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          category: article.category,
          severity: article.severity,
          location: article.location,
          need: article.need,
          longitude: article.longitude,
          latitude: article.latitude,
          
          // Frontend display fields (mapped from model)
          imageLink: article.urlToImage,
          articleLink: article.url
        }))
        
        setEvents(mappedEvents)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="listview">
        <div className="listview-content">
          <div className="loading">Loading events...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="listview">
        <div className="listview-content">
          <div className="error">Error loading events: {error}</div>
        </div>
      </div>
    )
  }

  // Fallback to empty array if no events
  const eventsToDisplay = events.length > 0 ? events : []

  return (
    <div className="listview">
      <div className="listview-content">
        <EventList events={eventsToDisplay} />
      </div>
    </div>
  )
}

export default ListView