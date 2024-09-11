import axios from "axios";
import {urlValue} from "../../../constants/constants";
import {transformedObject} from "../helperfunctions/helperFunctions";

export default function getShowData(data, setShowData) {
  const promises = []
  data.forEach((show) => {
    promises.push(axios.get(urlValue + "getshowdata", {
      params: {
        tekst: show,
      }
    }).then((response) => {
      return transformedObject(response.data);
    }))})

  Promise.all(promises).then((response) => {
    setShowData(response);
  })
}