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

        // Remove existing heatmap layer and source if they exist
        if (map.current.getSource('incidents-heatmap')) {
            map.current.removeLayer('incidents-heatmap-layer');
            map.current.removeSource('incidents-heatmap');
        }

        // Filter events with valid coordinates
        const validEvents = events.filter(event => 
            event.longitude && event.latitude && 
            !(event.longitude === 0 && event.latitude === 0)
        );

        if (validEvents.length === 0) return;

        // Create GeoJSON for heatmap with severity weighting
        const heatmapData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: validEvents.map(event => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [event.longitude, event.latitude]
                    },
                    properties: {
                        // Severity incidents get higher weight for heatmap
                        weight: event.severity ? 3 : 1
                    }
                }))
            }
        };

        // Add heatmap source
        map.current.addSource('incidents-heatmap', heatmapData);

        // Add heatmap layer
        map.current.addLayer({
            id: 'incidents-heatmap-layer',
            type: 'heatmap',
            source: 'incidents-heatmap',
            maxzoom: 15, // Hide heatmap at high zoom levels
            paint: {
                // Increase the heatmap weight based on frequency and property magnitude
                'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get', 'weight'],
                    0, 0.5,
                    6, 2
                ],
                // Moderate intensity for balanced visibility (increased by 50%)
                'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 2.25,
                    9, 4.5
                ],
                // Balanced color ramp with moderate opacity
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(220, 53, 69, 0)',      // Transparent
                    0.2, 'rgba(220, 53, 69, 0.3)',  // Light red
                    0.4, 'rgba(220, 53, 69, 0.5)',  // Medium red
                    0.6, 'rgba(220, 53, 69, 0.7)',  // Strong red
                    0.8, 'rgba(255, 107, 122, 0.8)', // Accent color
                    1, 'rgba(255, 107, 122, 1)'     // Full accent color
                ],
                // Moderate radius for good coverage without overwhelming
                'heatmap-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 30,
                    9, 60
                ],
                // Balanced opacity that fades at higher zoom
                'heatmap-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 0.8,
                    7, 0.7,
                    9, 0.5,
                    15, 0.2
                ]
            }
        }); // Remove the placement parameter to ensure visibility

        // Store markers in an array for zoom-based visibility control
        const markers = [];

        // Create individual markers
        validEvents.forEach((event) => {
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

            // Store marker for visibility control
            markers.push(marker);
        });

        // Function to update marker visibility based on zoom level
        const updateMarkerVisibility = () => {
            const zoom = map.current.getZoom();
            const showMarkers = zoom >= 6; // Show markers at zoom level 6 and above (was 8)
            
            markers.forEach(marker => {
                const element = marker.getElement();
                if (showMarkers) {
                    element.style.display = 'block';
                } else {
                    element.style.display = 'none';
                }
            });
        };

        // Set initial marker visibility
        updateMarkerVisibility();

        // Listen for zoom changes to update marker visibility
        map.current.on('zoom', updateMarkerVisibility);

        console.log('Added heatmap and markers for', validEvents.length, 'events');
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