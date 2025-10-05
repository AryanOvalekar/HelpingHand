import React from 'react'
import './MapView.css'
import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import MapSidePanel from '../components/MapSidePanel'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapView = () => {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [sidePanelState, setSidePanelState] = useState({
        isOpen: false,
        incident: null
    })

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

        // Add a test marker once the map loads
        map.current.on('load', () => {
            // Test incident data
            const testIncident = {
                id: 1,
                title: "Hurricane Relief Effort - NYC",
                description: "Urgent assistance needed for hurricane victims in New York area. Volunteers and supplies desperately needed for evacuation and emergency shelter operations.",
                location: "New York, NY",
                type: 0, // Disaster
                need: 1, // Clothing needed (0=food, 1=clothing, 2=money, other=help)
                imageLink: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
                articleLink: "https://example.com/hurricane-relief"
            };

            // Create marker element for custom styling if needed
            const testMarker = new mapboxgl.Marker({
                color: '#ff4444'
            })
            .setLngLat([-74.006, 40.7128]) // NYC coordinates
            .addTo(map.current);

            // Add click event to marker
            testMarker.getElement().addEventListener('click', (e) => {
                e.stopPropagation();
                
                setSidePanelState({
                    isOpen: true,
                    incident: testIncident
                });
            });

            console.log('Test marker with custom React side panel added');
        });

        // Close side panel when clicking on map (optional - you might want to remove this)
        map.current.on('click', () => {
            // Uncomment if you want map clicks to close the panel
            // setSidePanelState(prev => ({ ...prev, isOpen: false }));
        });

        return () => {
        }
    }, [])

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