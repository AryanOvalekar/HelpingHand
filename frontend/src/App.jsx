import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import MapView from './pages/MapView'
import ListView from './pages/ListView'
import AboutUs from './pages/AboutUs'
import SlideMenu from './components/SlideMenu'

const App = () => {
  return (
    <Router>
      <SlideMenu />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/list" element={<ListView />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </Router>
  )
}

export default App