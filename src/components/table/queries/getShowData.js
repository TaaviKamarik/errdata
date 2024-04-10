import axios from "axios";
import {urlValue} from "../../../constants/constants";
import {transformedObject} from "../helperfunctions/helperFunctions";

export default function getShowData(event, setAnchorEl, shows, setShowMetadata) {
  if(event.latlng) {
    console.log(event.target)
    setAnchorEl(event.target._icon.children[0])
  } else {
    setAnchorEl(event.currentTarget)
  }
  const promises = []
  shows.forEach((show) => {
    console.log(show)
    promises.push(axios.get(urlValue + "getshowdata", {
      params: {
        tekst: show,
      }
    }).then((response) => {
      return transformedObject(response.data);
    }))})

  Promise.all(promises).then((response) => {
    setShowMetadata(response);
  })
}