import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EventList from '../components/EventList'
import './ListView.css'

const ListView = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  
  // Filter and sort states
  const [filters, setFilters] = useState({
    disasterType: 'all',
    helpType: 'all',
    severity: 'all'
  })
  const [sortType, setSortType] = useState('default')

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

  // Filter and sort functions
  const applyFiltersAndSort = (eventsToFilter) => {
    let filtered = [...eventsToFilter]

    // Apply filters
    if (filters.disasterType !== 'all') {
      filtered = filtered.filter(event => event.category === filters.disasterType)
    }
    
    if (filters.helpType !== 'all') {
      filtered = filtered.filter(event => {
        const helpTypeMap = { 0: 'food', 1: 'clothing', 2: 'money', 3: 'volunteers' }
        const eventHelpType = typeof event.need === 'number' ? helpTypeMap[event.need] : event.need
        return eventHelpType === filters.helpType
      })
    }
    
    if (filters.severity !== 'all') {
      if (filters.severity === 'severe') {
        filtered = filtered.filter(event => event.severity === true)
      } else if (filters.severity === 'normal') {
        filtered = filtered.filter(event => !event.severity)
      }
    }

    // Apply sorting
    if (sortType === 'date') {
      filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    } else if (sortType === 'distance' && userLocation) {
      filtered.sort((a, b) => {
        const distanceA = a.latitude && a.longitude ? 
          calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude) : 
          Infinity
        const distanceB = b.latitude && b.longitude ? 
          calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude) : 
          Infinity
        return distanceA - distanceB
      })
    }

    return filtered
  }

  // Update filtered events when filters, sort, or events change
  useEffect(() => {
    const filtered = applyFiltersAndSort(events)
    setFilteredEvents(filtered)
  }, [events, filters, sortType, userLocation])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        
        // Get user's location in the background
        getUserLocation()
          .then(location => {
            setUserLocation(location)
          })
          .catch(locationError => {
            console.warn('Could not get user location:', locationError.message)
          })

        // Fetch events immediately without waiting for location
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

  // Use filtered events if available, otherwise fall back to original events
  const eventsToDisplay = filteredEvents.length > 0 ? filteredEvents : events

  return (
    <div className="listview">
      <div className="listview-content">
        {/* Filter and Sort Bar */}
        <div className="filter-sort-bar">
          <div className="filter-group">
            <label>Disaster Type:</label>
            <select 
              value={filters.disasterType} 
              onChange={(e) => setFilters({...filters, disasterType: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="naturalDisaster">Natural Disaster</option>
              <option value="warRelief">War Relief</option>
              <option value="volunteerWork">Volunteer Work</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Help Type:</label>
            <select 
              value={filters.helpType} 
              onChange={(e) => setFilters({...filters, helpType: e.target.value})}
            >
              <option value="all">All Help Types</option>
              <option value="food">Food</option>
              <option value="clothing">Clothing</option>
              <option value="money">Money</option>
              <option value="volunteers">Volunteers</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Severity:</label>
            <select 
              value={filters.severity} 
              onChange={(e) => setFilters({...filters, severity: e.target.value})}
            >
              <option value="all">All Severities</option>
              <option value="severe">Severe Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={sortType} 
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="date">Most Recent</option>
              <option value="distance">Closest Distance</option>
            </select>
          </div>
        </div>

        <EventList 
          events={eventsToDisplay} 
          userLocation={userLocation}
          calculateDistance={calculateDistance}
        />
      </div>
    </div>
  )
}

export default ListView