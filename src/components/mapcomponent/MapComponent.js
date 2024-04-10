import React from 'react';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {divIcon} from "leaflet/src/layer";
import "./mapComponents.css";

const MapComponent = () => {

  const renderCoordinates = [{laiuskraad: "34.1510867", pikkuskraad: "36.2740782", koht: "Aabla"}]

  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();
    let size = 'markerClusterLargeXL';

    if (count < 10) {
      size = 'markerClusterSmall';
    }
    else if (count >= 10 && count < 100) {
      size = 'markerClusterMedium';
    }
    else if (count >= 100 && count < 500) {
      size = 'markerClusterLarge';
    }

    return new divIcon({
      html:
        `<div class=${size}>
          <span>${count}</span>
        </div>`,
      className: "cluster-other"});
  };

  const customIcon = new divIcon({
    html:
      `<div class="round-icon">
        </div>`,
    className: "cluster-others"
  })

  return (
    <MapContainer className="map-container" center={[58.595, 25.5]} zoomDelta={1} wheelPxPerZoomLevel={100} zoomSnap={0} zoom={8} maxZoom={16} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      />
      <MarkerClusterGroup
        style={{height: "200px", width: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}
        chunkedLoading
        animate={false}
        iconCreateFunction={createClusterCustomIcon}
        spiderLegPolylineOptions={{
          weight: 0,
          opacity: 0,
        }}
        showCoverageOnHover={false}
        maxClusterRadius={100}
      >
        {renderCoordinates.map((coordinate) => (
            <Marker
              position={[coordinate.laiuskraad, coordinate.pikkuskraad]}
              icon={customIcon}
              eventHandlers={{
                mouseover: (event) => event.target.openPopup(),
                mouseout: (event) => event.target.closePopup()
              }}
            >
              <Popup>
                {coordinate.koht}
              </Popup>
            </Marker>
          )
        )}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;