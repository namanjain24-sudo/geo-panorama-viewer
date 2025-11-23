"use client"

import { useState, useEffect } from "react"

export default function PanoramaApp() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const panoramas = [
    {
      id: 1,
      title: "Mountain Vista",
      url: "/image.png",
      lat: 40.7128,
      lng: -74.006,
      description: "Mountain landscape",
    },
    {
      id: 2,
      title: "Ocean Horizon",
      url: "/image copy 2.png",
      lat: 37.7749,
      lng: -122.4194,
      description: "Coastal view",
    },
  ]

  const initMap = () => {
    const container = document.getElementById("map-container")
    
    if (container._map) {
      updateMarkers(container._map)
      return
    }

    if (typeof window === "undefined" || !window.L) return

    const L = window.L
    const map = L.map("map-container", {
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      tap: true,
    }).setView([40, -95], 3)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    container._map = map
    addMarkers(map)
    
    if (panoramas.length > 0) {
      const bounds = L.latLngBounds(panoramas.map((p) => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  const addMarkers = (map) => {
    if (!window.L) return
    
    const L = window.L
    map._markers = []
    
    panoramas.forEach((pano, index) => {
      const marker = L.circleMarker([pano.lat, pano.lng], {
        radius: index === currentIndex ? 12 : 8,
        fillColor: index === currentIndex ? "#3b82f6" : "#9ca3af",
        color: index === currentIndex ? "#1e40af" : "#6b7280",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup(`<strong>${pano.title}</strong><br/>${pano.description}`)
        .on("click", () => {
          setCurrentIndex(index)
        })
        .addTo(map)
      
      map._markers.push({
        marker: marker,
        index: index
      })
    })
  }

  const updateMarkers = (map) => {
    if (!map || !window.L) return
    
    const L = window.L
    
    if (map._markers) {
      map._markers.forEach(markerObj => map.removeLayer(markerObj.marker))
    }
    
    addMarkers(map)
  }

  const exportMarkers = () => {
    const geojson = {
      type: "FeatureCollection",
      features: panoramas.map(pano => ({
        type: "Feature",
        properties: {
          id: pano.id,
          title: pano.title,
          description: pano.description,
          imageUrl: pano.url
        },
        geometry: {
          type: "Point",
          coordinates: [pano.lng, pano.lat]
        }
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "panorama-markers.geojson");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.L) {
      initMap()
    } else {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
      script.onload = () => {
        setTimeout(() => {
          initMap()
        }, 100)
      }
      document.head.appendChild(script)
    }
    
    return () => {
      const container = document.getElementById("map-container")
      if (container && container._map && container._map._markers) {
        container._map._markers.forEach(markerObj => container._map.removeLayer(markerObj.marker))
        container._map._markers = []
      }
    }
  }, [currentIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + panoramas.length) % panoramas.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % panoramas.length)
  }

  const current = panoramas[currentIndex]

  return (
    <main style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ width: "500px", height: "100vh", border: "3px solid black", overflow: "hidden" }}>
        <div id="map-container" style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f5" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", border: "3px solid black", borderLeft: "none" }}>
        <div
          style={{
            width: "100%",
            height: "calc(100% - 160px)",
            border: "3px solid black",
            borderTop: "none",
            borderRight: "none",
            borderBottom: "none",
            backgroundColor: "#f5f5f5",
            position: "relative",
          }}
        >
          <img
            src={current.url || "/placeholder.svg"}
            alt={current.title}
            style={{ 
              objectFit: "cover",
              width: "100%",
              height: "100%"
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "15px",
            }}
          >
            <h2 style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: "0 0 5px 0" }}>
              {current.title}
            </h2>
            <p style={{ color: "#ccc", fontSize: "14px", margin: 0 }}>{current.description}</p>
          </div>
        </div>

        <div style={{ height: "160px", padding: "10px", borderTop: "3px solid black", backgroundColor: "white" }}>
          <div style={{ marginBottom: "8px" }}>
            <button
              onClick={exportMarkers}
              style={{
                width: "100%",
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "1px solid #1e40af",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "4px"
              }}
            >
              Export Markers as GeoJSON
            </button>
          </div>
          
          <div style={{ backgroundColor: "white", border: "1px solid #999", padding: "8px" }}>
            <div style={{ marginBottom: "8px" }}>
              <p style={{ fontSize: "14px", color: "black", margin: "0" }}>
                Image {currentIndex + 1} of {panoramas.length}
              </p>
              <p style={{ fontSize: "12px", color: "black", margin: "4px 0 0 0" }}>
                Lat: {current.lat.toFixed(4)}, Lng: {current.lng.toFixed(4)}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handlePrevious}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#d1d5db",
                  color: "black",
                  border: "1px solid #6b7280",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {"←"} Previous
              </button>
              <button
                onClick={handleNext}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#d1d5db",
                  color: "black",
                  border: "1px solid #6b7280",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Next {"→"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}