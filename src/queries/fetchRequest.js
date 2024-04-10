import axios from "axios";
import {urlValue} from "../constants/constants";

export default async function fetchRequest(dataProps, urlParam) {
  const names = await axios.post(urlValue + urlParam, dataProps);
  return names.data;
}