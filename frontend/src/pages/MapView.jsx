import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './MapView.css'

// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ5YW5vdmFsZWthciIsImEiOiJjbWdjcTN6eHIwczV5MmxvN2JyN3l5NWtzIn0.E_z4d_rTKDpEcDNJe_GLQg'

const MapView = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return // Initialize map only once

    console.log('Initializing map...')
    console.log('Container:', mapContainer.current)

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/aryanovalekar/cmgcq0dn4007s01sb7cqg5fia',
        center: [-74.006, 40.7128], // NYC coordinates as default
        zoom: 12
      })

      map.current.on('load', () => {
        console.log('Map loaded successfully!')
      })

      map.current.on('error', (e) => {
        console.error('Map error:', e)
      })

    } catch (error) {
      console.error('Error creating map:', error)
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  return (
    <div 
      ref={mapContainer} 
      className="map-container"
    />
  )
}

export default MapView