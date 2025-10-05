import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EventList from '../components/EventList'
import './ListView.css'

const ListView = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c // Distance in kilometers
    return distance
  }

  // Function to get user's geolocation
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          resolve({ latitude, longitude })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  useEffect(() => {
    const fetchEventsWithLocation = async () => {
      try {
        setLoading(true)
        
        // First, get user's location
        let userLat = null
        let userLon = null
        
        try {
          const location = await getUserLocation()
          userLat = location.latitude
          userLon = location.longitude
          setUserLocation(location)
        } catch (locationError) {
          console.warn('Could not get user location:', locationError.message)
          // Continue without location - will use fallback distances
        }

        // Then fetch events
        const response = await axios.get('http://localhost:8000/recent')
        
        // Map API response to frontend format, preserving all fields from the model
        const mappedEvents = response.data.map((article, index) => {
          let distanceAway = 'Distance unknown'
          
          // Calculate distance if we have both user location and event coordinates
          if (userLat && userLon && article.latitude && article.longitude) {
            const distance = calculateDistance(userLat, userLon, article.latitude, article.longitude)
            if (distance < 1) {
              distanceAway = `${Math.round(distance * 1000)}m away`
            } else {
              distanceAway = `${distance.toFixed(1)}km away`
            }
          }
          
          return {
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
            articleLink: article.url,
            distanceAway: distanceAway
          }
        })
        
        setEvents(mappedEvents)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching events:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEventsWithLocation()
  }, [])

  if (loading) {
    return (
      <div className="listview">
        <div className="listview-content">
          {/* Loading without text */}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="listview">
        <div className="listview-content">
          <div className="error-container">
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">{error}</p>
          </div>
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