import './App.css';
import React, {useEffect, useState} from "react";
import axios from "axios";
import StartingView from "./components/startingwiew/StartingView";
import fetchRequest from "./queries/fetchRequest";
import {tabValues, urlValue} from "./constants/constants";
import {tableDataProps} from "./components/nameTab/constants/constants";
import NameViews from "./components/nameview/NameViews";

function App() {
  const url = "https://dti.tlu.ee/errlinked/api/src/"
  const [filterValues, setFilterValues] = useState({
    dateMin: 2000,
    dateMax: 2023,
    sortBy: "kokku",
    sortOrder: "DESC",
    page: 1,
    limit: 20,
  })

  const [marksonaData, setMarksonaData] = useState();
  const [themes, setThemes] = useState();
  const [queryButtonPressed, setQueryButtonPressed] = useState(false)
  const [currentTabValue, setCurrentTabValue] = useState("nameTab");

  const [selectedCode, setSelectedCode] = useState();

  const [graph, setGraph] = useState();

  const [nameTextCodes, setNameTextCodes] = useState([]);
  const [keywordTextCodes, setKeywordTextCodes] = useState([]);
  const [textCodes, setTextCodes] = useState([]);

  const [keywordArray, setKeywordArray] = useState([]);

  const [nameArray, setNameArray] = useState([]);
  const [nameQueryAnswer, setNameQueryAnswer] = useState();


  const [inputArray, setInputArray] = useState();

  const [queryAnswer, setQueryAnswer] = useState();
  const [mapAnswer, setMapAnswer] = useState();

  const [keywordList, setKeywordList] = useState([]);
  const [marksonaList, setMarksonaList] = useState([]);

  const [queryProps, setQueryProps] = useState();

  useEffect(() => {
    if (!inputArray) return;
    const dataProps = tableDataProps(textCodes, filterValues);
    if (queryButtonPressed === "name") {
      dataProps.nimi = inputArray;
      dataProps.mainOlem = selectedCode;
    }

    const callFetch = async () => {
      if(textCodes.length === 0) return;
      setMapAnswer(null);
      const queryRes = await fetchRequest(dataProps, tabValues.urlProp[queryButtonPressed]);
      queryRes.forEach((val, index) => {
        const shows = val.tekstikood.split(",");
        const textcodes = [];
        const years = [];
        shows.forEach((show) => {
          const splitValue = show.split(":");
          textcodes.push(splitValue[0]);
          years.push(splitValue[1]);
        })
        queryRes[index].tekstikood = textcodes;
        queryRes[index].years = years;
      })
      console.log(queryRes);
      setQueryAnswer(queryRes);
      const promiseArray = [];
      const filteredQuery = queryRes.filter((val) => val.tyyp === 'loc');

     /* filteredQuery.forEach((val) => {
        promiseArray.push(axios.get(urlValue + `getmapcoordinates?code=${val.olemi_kood}`))
      });*/

      Promise.all(promiseArray).then((res) => {
        res.forEach((val, index) => {
          if(val.data !== "No rows") {
            filteredQuery[index].laiuskraad = val.data[0].laiuskraad;
            filteredQuery[index].pikkuskraad = val.data[0].pikkuskraad;
          }
        })
        const newQuery = filteredQuery.filter((val) => val.hasOwnProperty("laiuskraad"));
        setMapAnswer(newQuery);
      })
      fetchThemes(textCodes);
    }

    callFetch();
  }, [textCodes, filterValues]);

  useEffect(() => {
    if (!inputArray) return;
    setQueryAnswer(null)
    if(queryButtonPressed === "keyword") {
      callKeywordQuery();
    }
  },[inputArray, filterValues])


  const callKeywordQuery = async() => {
    const keywords = await fetchRequest({marksonad: inputArray[0]}, "gettextcodesbykeyword");
    console.log(keywords);
    setTextCodes(keywords);
  }

  const fetchThemes = (val) => {
    axios.post(url + "getthemes",{
      tekst: val,
      limit: 20,
      page: filterValues.page,
      sortBy: filterValues.sortBy,
      sortOrder: filterValues.sortOrder,
      dateMin: filterValues.dateMin,
      dateMax: filterValues.dateMax,

    }, {headers: 'application/json; charset=utf-8'}).then((response) => {
      const responseAnswer = response.data;
      responseAnswer.forEach((val, index) => {
        const shows = val.tekstikood.split(",");
        const textcodes = [];
        const years = [];
        shows.forEach((show) => {
          const splitValue = show.split(":");
          textcodes.push(splitValue[0]);
          years.push(splitValue[1]);
        })
        responseAnswer[index].tekstikood = textcodes;
        responseAnswer[index].years = years;
      })
      setThemes(responseAnswer);
    })
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTabValue(newValue);
  };

  function handleBackButtonPress() {
    setTextCodes([]);
    setQueryButtonPressed(false);
    setThemes([]);
    setMarksonaData(null);
    setNameArray([]);
  }

  const callMarksonaQuery = () => {
    if(keywordArray.length === 0) return;
    axios.post(url + "gettextcodesbymarksona", {
      marksonad: keywordArray,
    }, {headers: 'application/json; charset=utf-8'}).then((response) => {
      console.log(response.data);
      setNameTextCodes(response.data);
      fetchThemes(response.data);
    });
  }

  return (
    <div className="App">
      {!queryButtonPressed &&
        <StartingView
          setNameArray={setNameArray}
          setKeywordArray={setKeywordArray}
          setQueryButtonPressed={setQueryButtonPressed}
          setGraph={setGraph}
          setNameQueryAnswer={setNameQueryAnswer}
          setMapAnswer={setMapAnswer}
        />}
      {queryButtonPressed &&
        <NameViews
          setQueryButtonPressed={setQueryButtonPressed}
          queryButtonPressed={queryButtonPressed}
          setGraph={setGraph}
          nameQueryAnswer={nameQueryAnswer}
          graph={graph}
          nameArray={nameArray}
          mapAnswer={mapAnswer}
        />}
    </div>
  );
}

export default App;
