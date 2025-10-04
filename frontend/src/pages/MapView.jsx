import React from 'react'
import './MapView.css'
import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapView = () => {
    const mapContainer = useRef(null)
    const map = useRef(null)

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

        return () => {
        }
    }, [])

    return (
        <>
            <div id="map-container" ref={mapContainer}>
            </div>
            <div className="map-overlay-box">
                {/* Content for the white box can go here */}
            </div>
        </>
    )
}

export default MapView