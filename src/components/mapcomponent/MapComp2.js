import "leaflet/dist/leaflet.css"
import {MapContainer, Marker, Popup, TileLayer, useMapEvents, Tooltip as LeafletTooltip} from "react-leaflet";
import React, {useEffect, useState} from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import"./mapcomp2.css";
import {divIcon} from "leaflet/src/layer";
import {
  Button,
  Chip,
  CircularProgress,
  TextField, Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ShowBox from "../table/components/ShowBox";
import {addFilterButton, tabValues} from "../../constants/constants";
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {handleEnterPress} from "../nameTab/helperfunctions/helperFunctions";
import {handleChipDelete} from "../helperfunctions/helperFunctions";
import fetchRequest from "../../queries/fetchRequest";

export default function MapComp2({mapData, queryButtonPressed}) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [showsData, setShowsData] = useState([]);
  const open = Boolean(anchorEl);
  const [addFilterIsOpen, setAddFilterIsOpen] = useState(false);

  const customIcon = new divIcon({
    html:
      `<div class="round-icon">
        </div>`,
    className: "cluster-others"
  })

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

  const callShowsData = async(event, codeandyear) => {
    const metadata = await fetchRequest({data: codeandyear.map((entry) => entry.tekstikood)}, "getshowsmetadata");
    setShowsData(metadata);
    event.target.openPopup();
  }

  console.log(mapData)

  return (
    <div>
    <div style={{position: "relative"}}>
      {mapData ?
        <div style={{position: "relative"}}>
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
              {mapData.map((coordinate) => (
                  <Marker
                    position={[coordinate.laiuskraad, coordinate.pikkuskraad]}
                    icon={customIcon}
                    eventHandlers={{
                      click: (event) => {
                        callShowsData(event, coordinate.codeandyear)
                      },
                    }}
                  >
                    <Popup offset={[0, 200]} maxWidth="auto" maxHeight="500" className="map-popup">
                      <div style={{fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem"}}>Saadete nimekiri</div>
                      <ShowBox
                        data={showsData}
                        version={"map"}
                      />
                    </Popup>
                    <LeafletTooltip direction="top" offset={[0, 0]} opacity={1}>
                      <div style={{width: "200px", display: "flex", flexDirection: "column", gap: "0.3em"}}>
                        <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid lightgray"}}><div style={{fontWeight: "bold" }}>Koha nimi: </div> <div>{coordinate.nimetus}</div></div>
                        <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid lightgray"}}><div style={{fontWeight: "bold"}}>Koosmainimisi kokku: </div><div>{coordinate.kokku}</div></div>
                        <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid lightgray"}}><div style={{fontWeight: "bold"}}>Erinevaid saateid: </div><div>{coordinate.koodNr}</div></div>
                      </div>
                    </LeafletTooltip>
                  </Marker>
                )
              )}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
        : <CircularProgress style={{marginTop: "200px", marginLeft: "calc(50% - 50px)"}} size="100px" variant="indeterminate" />}

    </div>

  </div>
  );
}
