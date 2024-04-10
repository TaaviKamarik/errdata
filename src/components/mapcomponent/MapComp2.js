import "leaflet/dist/leaflet.css"
import {MapContainer, Marker, Popup, TileLayer, useMapEvents, Tooltip as LeafletTooltip} from "react-leaflet";
import React, {useEffect, useState} from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import"./mapcomp2.css";
import {divIcon} from "leaflet/src/layer";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton, Popover,
  Switch,
  TextField, Tooltip, Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import AspectRatioRoundedIcon from '@mui/icons-material/AspectRatioRounded';
import SentenceSkeleton from "../table/components/SentenceSkeleton";
import ShowBox from "../table/components/ShowBox";
import getShowData from "../table/queries/getShowData";
import {addFilterButton, tabValues} from "../../constants/constants";
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {handleEnterPress} from "../nameTab/helperfunctions/helperFunctions";

export default function MapComp2({mapData, inputArray, tabVal, setInputArray}) {
  const [inputText, setInputText] = useState("")
  const [keyList, setkeyList] = useState([])
  const [textObjList, setObjTextList] = useState([])
  const [hasMoreData, setHasMoreData] = useState(true)
  const [renderItems, setRenderItems] = useState([])
  const [sliceCounter, setSliceCounter] = useState(50)
  const [renderCoordinates, setRenderCoordinates] = useState([])
  const [textList, setTextList] = useState([])
  const [metaData, setMetaData] = useState([])
  const [listOfMetadata, setListOfMetadata] = useState([])
  const [listOfMetaText, setListOfMetaText] = useState([])
  const [textWindow, setTextWindow] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedText, setSelectedText] = useState()
  const [sidePanelWidth, setSidePanelWidth] = useState(0)
  const [textInnerJoin, setTextInnerJoin] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [showMetadata, setShowMetadata] = useState()
  const locationTexts = {};

  const [locationData, setLocationData] = useState();
  const [addFilterIsOpen, setAddFilterIsOpen] = useState(false);

  const colors = ["red-background", "blue-background", "yellow-background", "orange-background", "green-background", "dark-blue-background", "purple-background", "pink-background"]
  const chipColors= ["#ffadad", "#9bf6ff", "#fdffb6", "#ffd6a5", "#caffbf", "#a0c4ff", "#bdb2ff", "#ffc6ff"]
  const coordinates= [{"koht":"Aabla","laiuskraad":"34.1510867","pikkuskraad":"36.2740782","kogus":1.0},{"koht":"Aakre","laiuskraad":"58.1015159","pikkuskraad":"26.197324","kogus":1.0},{"koht":"Aardlapalu","laiuskraad":"58.3277779","pikkuskraad":"26.7655999","kogus":1.0},{"koht":"Aaspere","laiuskraad":"59.4313995","pikkuskraad":"26.1338481","kogus":1.0},{"koht":"Aavere","laiuskraad":"59.0701127","pikkuskraad":"26.0641192","kogus":1.0},{"koht":"Adavere","laiuskraad":"58.7086403","pikkuskraad":"25.8976836","kogus":1.0},{"koht":"Adila","laiuskraad":"11.3344149","pikkuskraad":"27.0000778","kogus":1.0},{"koht":"Adiste","laiuskraad":"58.1053357","pikkuskraad":"27.1412277","kogus":1.0},{"koht":"Adra","laiuskraad":"36.748834","pikkuskraad":"-3.0203617","kogus":1.0},{"koht":"Adraku","laiuskraad":"58.9225098","pikkuskraad":"26.8442503","kogus":1.0},{"koht":"Ahja","laiuskraad":"58.2087709","pikkuskraad":"27.0820855","kogus":1.0},{"koht":"Ahtme","laiuskraad":"59.3289416","pikkuskraad":"27.4220282","kogus":1.0}]

  const customIcon = new divIcon({
    html:
      `<div class="round-icon">
        </div>`,
    className: "cluster-others"
  })

  function MyComponent() {
    const map = useMapEvents({
      dragend: (e) => {
        setSelectedIndex(-1)
        const coordList = []
        coordinates.forEach(coord => {
          if (coord.laiuskraad > e.target.getBounds()["_southWest"]["lat"] && coord.pikkuskraad > e.target.getBounds()["_southWest"]["lng"] && coord.laiuskraad < e.target.getBounds()["_northEast"]["lat"] && coord.pikkuskraad < e.target.getBounds()["_northEast"]["lng"]){
            coordList.push(coord);
          }
        })

        const newTextList = []
        coordList.forEach(coord => {
          if (locationTexts[coord.koht.toLowerCase()]) {
            locationTexts[coord.koht.toLowerCase()].split(",").map(val => {
              newTextList.push(val.replace(".txt", ""))
            })
          }
        })

        setRenderItems(textList.filter(txt => newTextList.includes(txt)));
      },
      zoomend: (e) => {
        setSelectedIndex(-1)
        const coordList = []
        coordinates.forEach(coord => {
          if (coord.laiuskraad > e.target.getBounds()["_southWest"]["lat"] && coord.pikkuskraad > e.target.getBounds()["_southWest"]["lng"] && coord.laiuskraad < e.target.getBounds()["_northEast"]["lat"] && coord.pikkuskraad < e.target.getBounds()["_northEast"]["lng"]){
            coordList.push(coord);
          }
        })

        const newTextList = []
        coordList.forEach(coord => {
          if (locationTexts[coord.koht.toLowerCase()]) {
            locationTexts[coord.koht.toLowerCase()].split(",").map(val => {
              newTextList.push(val.replace(".txt", ""))
            })
          }
        })

        setRenderItems(textList.filter(txt => newTextList.includes(txt)));
      }
    });
    return null;
  }

  useEffect(() => {
    const getData = (value) => {
      return new Promise((resolve, reject) => {
        fetch("https://minitorn.tlu.ee/~jaagup/oma/too/22/12/tekstid/"+value).then(resp => resp.text()).then(data => resolve(data))
      })
    }

    const loadData = () => {
      const textArrayTemp = []
      const metaArrayTemp = []
      renderItems.forEach((value) => {
        metaArrayTemp.push(metaData[value.split('.')[0].substring(1)])
        textArrayTemp.push(getData(value))
      })

      setListOfMetadata(metaArrayTemp)

      Promise.all(textArrayTemp).then((allData) => {
        setListOfMetaText(allData)
      })
    }

    if(renderItems){
      loadData()
    }
  }, [renderItems])

  const renderMeta = (txt, index) => {
    const metaKey = txt.replace("t", "");
    const metaValue = metaData[metaKey];
    if(metaValue) {
      return(
        <div className="entry-container" >
          <div className="entry-bubbles-container" style={{gap: "5px"}}></div>
          <div className="entry-body-container">
            <div style={{fontWeight: "bold"}}>{metaValue["saatenimi"]}</div>
            <div>{metaValue["salvestuskoht"]}</div>
            <div style={{fontSize: "0.7rem", color: "darkgray"}}>{metaValue["salvestusaeg"] ? metaValue["salvestusaeg"] : metaValue["eetrikuupaev"]}</div>
          </div>
        </div>
      )
    }
  }

  const changeSideWidth = (initial, toggleVal) => {
    {sidePanelWidth === initial ? setSidePanelWidth(toggleVal) : setSidePanelWidth(initial)}
  }

  const txtInnerJoinFunction = () => {
    if(textObjList.length > 1){
      let tempList = textObjList[0][keyList[0]]
      textObjList.forEach((val, index) => {
        if(index < textObjList.length - 1){
          tempList = tempList.filter(item => textObjList[index + 1][keyList[index + 1]].includes(item))
        }
      })
      setTextList(tempList)
      setRenderItems(tempList)
    }
  }

  const closeBtnPress = () => {
    setTextWindow(false)
    setSidePanelWidth(500)
  }

  const handleSwitchChange = () => {
    if(textObjList.length > 1){
      if(!textInnerJoin){
        txtInnerJoinFunction();
        setTextInnerJoin(true)
      }else if(textInnerJoin) {
        const tempList = []
        textObjList.forEach((val, index) => {
          val[keyList[index]].forEach(item => tempList.push(item))
        })
        setTextList(tempList)
        setRenderItems(tempList)
        setTextInnerJoin(false)
      }}
  }

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

  return (
    <div>
    <div className="table-upper-container">
      <div className="main-word-container">{tabValues.titleSelection[tabVal]}</div>
      {inputArray.map((filter, index) => {
        return(
          <div className="added-filter">{filter}</div>
        )
      })}
      {addFilterIsOpen && tabVal === "nameTab" &&
        <AutoCompleteWithScroll
          isMainPage={false}
          nimeData={inputArray}
          setNimeData={setInputArray}
          setAddFilterIsOpen={setAddFilterIsOpen}
        />}
      {addFilterIsOpen&& tabVal === "keywordTab" &&
        <TextField onKeyDown={(e) => {handleEnterPress(e, setInputArray, inputArray, setAddFilterIsOpen)}}></TextField>}
      <Tooltip title={"Lisa nimede filtreid"}>
        <Button
          onClick={() => setAddFilterIsOpen(true)}
          color={"success"}
          variant="contained"
          sx={addFilterButton}
        >
          <AddIcon fontSize={"medium"}/>
        </Button>
      </Tooltip>
    </div>
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
                        getShowData(event, setAnchorEl, coordinate.tekstikood.split(","), setShowMetadata);
                        setLocationData(coordinate);
                        event.target.openPopup();
                      },
                    }}
                  >
                    <Popup offset={[0, 200]} maxWidth="auto" maxHeight="500" className="map-popup">
                      <div style={{fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem"}}>Saadete nimekiri</div>
                        {showMetadata &&
                          <ShowBox
                            showMetaData={showMetadata}
                            olemData={inputArray[0]}
                            data={locationData}
                          />
                        }
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
            <MyComponent/>
          </MapContainer>
        </div>

        : <CircularProgress style={{marginTop: "200px", marginLeft: "calc(50% - 50px)"}} size="100px" variant="indeterminate" />}

    </div>

  </div>
  );
}
