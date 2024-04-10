import axios from "axios";
import {urlValue} from "../constants/constants";

export default function getAllPeopleForDropDown (page, word, amount, currentPage, setHasMore, setPeopleOptions, setOffset, setPage, setLoading) {
  axios.get(urlValue + "people", {
    params: {
      word: word,
      amount: amount,
      page: currentPage
    }
  }).then((response) => {
    if (response.data === "No rows") {
      setHasMore(false);
    } else {
      setPeopleOptions(prevOptions => [...prevOptions, ...response.data]);
      setOffset(page * amount);
      setPage(page + 1);
    }
    setLoading(false);
  }).catch(() => setLoading(false));
}