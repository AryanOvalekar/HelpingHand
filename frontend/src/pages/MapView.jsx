import React from 'react'
import './MapView.css'
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios'
import MapSidePanel from '../components/MapSidePanel'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapView = () => {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [sidePanelState, setSidePanelState] = useState({
        isOpen: false,
        incident: null
    })
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true)
                
                // Fetch events from API
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
                    articleLink: article.url,
                    coordinates: [article.longitude, article.latitude]
                }))
                
                setEvents(mappedEvents)
                setError(null)
            } catch (err) {
                setError(err.message)
                console.error('Error fetching events:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    useEffect(() => {
        if (map.current) return

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/aryanovalekar/cmgcq0dn4007s01sb7cqg5fia',
            center: [-24, 42],
            zoom: 1
        })

        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
            })
        );

        // Add markers once the map loads
        map.current.on('load', () => {
            // Markers will be added by the events useEffect below
        });

        // Close side panel when clicking on map (optional)
        map.current.on('click', () => {
            // Uncomment if you want map clicks to close the panel
            // setSidePanelState(prev => ({ ...prev, isOpen: false }));
        });

        return () => {
        }
    }, [])

    // Add markers when events data is loaded
    useEffect(() => {
        if (!map.current || !events.length) return

        // Clear existing markers (if any)
        const existingMarkers = document.querySelectorAll('.mapboxgl-marker')
        existingMarkers.forEach(marker => marker.remove())

        // Create markers for each event that has valid coordinates
        events.forEach((event) => {
            if (event.longitude && event.latitude && 
                !(event.longitude === 0 && event.latitude === 0)) {
                
                // Create custom pulsing dot element
                const markerElement = document.createElement('div');
                markerElement.className = 'pulsing-marker';
                markerElement.innerHTML = `
                    <div class="pulsing-dot"></div>
                    <div class="pulsing-ring"></div>
                `;
                
                const marker = new mapboxgl.Marker({
                    element: markerElement
                })
                .setLngLat([event.longitude, event.latitude])
                .addTo(map.current);

                // Add click event to each marker
                markerElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    setSidePanelState({
                        isOpen: true,
                        incident: event
                    });
                });
            }
        });

        console.log('Added markers for', events.length, 'events');
    }, [events])

    const closeSidePanel = () => {
        setSidePanelState(prev => ({ ...prev, isOpen: false }));
    }

    return (
        <>
            <div id="map-container" ref={mapContainer}>
            </div>
            <div className="map-overlay-box">
                {/* Content for the white box can go here */}
            </div>
            <MapSidePanel
                incident={sidePanelState.incident}
                isOpen={sidePanelState.isOpen}
                onClose={closeSidePanel}
            />
        </>
    )
}

export default MapView