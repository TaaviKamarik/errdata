import {useMapEvents} from "react-leaflet";

export default function MapHelper() {
  const map = useMapEvents({
    dragend: (e) => {
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