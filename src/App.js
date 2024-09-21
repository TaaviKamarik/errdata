import './App.css';
import React, {useEffect, useState} from "react";
import axios from "axios";
import StartingView from "./components/startingwiew/StartingView";
import fetchRequest from "./queries/fetchRequest";
import {tabValues, urlValue} from "./constants/constants";
import {tableDataProps} from "./components/nameTab/constants/constants";
import NameViews from "./components/nameview/NameViews";
import { infinity } from 'ldrs'
import {FourSquare, ThreeDot} from "react-loading-indicators";
import KeywordViews from "./components/keywordview/KeywordViews";

infinity.register()



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
  const [nameKeywordQueryAnswer, setNameKeywordQueryAnswer] = useState();


  const [inputArray, setInputArray] = useState();

  const [queryAnswer, setQueryAnswer] = useState();
  const [mapAnswer, setMapAnswer] = useState();

  const [keywordList, setKeywordList] = useState([]);
  const [marksonaList, setMarksonaList] = useState([]);

  const [queryProps, setQueryProps] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [isKeywordsLoading, setIsKeywordsLoading] = useState(false);

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

  console.log(mapAnswer)
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
      {isLoading && <div style={{height: "100vh", width: "100vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <l-infinity
          size="100"
          stroke="10"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1"
          color="#004792"
        ></l-infinity>
        <div>
          <h1 style={{color: "#004792"}}>Päringu teostamine</h1>
        </div>
      </div>}
      {!queryButtonPressed && !isLoading &&
        <StartingView
          setIsKeywordsLoading={setIsKeywordsLoading}
          keywordArray={keywordArray}
          filterValues={filterValues}
          setNameArray={setNameArray}
          setKeywordArray={setKeywordArray}
          setQueryButtonPressed={setQueryButtonPressed}
          setGraph={setGraph}
          setNameQueryAnswer={setNameQueryAnswer}
          setMapAnswer={setMapAnswer}
          nameArray={nameArray}
          setIsLoading={setIsLoading}
          setNameKeywordQueryAnswer={setNameKeywordQueryAnswer}
        />}
      {queryButtonPressed === "name" && !isLoading &&
        <NameViews
          isKeywordsLoading={isKeywordsLoading}
          isLoading={isLoading}
          filterValues={filterValues}
          nameKeywordQueryAnswer={nameKeywordQueryAnswer}
          setNameKeywordQueryAnswer={setNameKeywordQueryAnswer}
          setIsLoading={setIsLoading}
          setIsKeywordsLoading={setIsKeywordsLoading}
          setQueryButtonPressed={setQueryButtonPressed}
          queryButtonPressed={queryButtonPressed}
          setGraph={setGraph}
          nameQueryAnswer={nameQueryAnswer}
          graph={graph}
          nameArray={nameArray}
          mapAnswer={mapAnswer}
          setNameArray={setNameArray}
          setNameQueryAnswer={setNameQueryAnswer}
          setMapAnswer={setMapAnswer}
        />}
      {queryButtonPressed === "keyword" && !isLoading &&
        <KeywordViews
          isKeywordsLoading={isKeywordsLoading}
          isLoading={isLoading}
          filterValues={filterValues}
          nameKeywordQueryAnswer={nameKeywordQueryAnswer}
          setNameKeywordQueryAnswer={setNameKeywordQueryAnswer}
          setIsLoading={setIsLoading}
          setIsKeywordsLoading={setIsKeywordsLoading}
          setQueryButtonPressed={setQueryButtonPressed}
          queryButtonPressed={queryButtonPressed}
          setGraph={setGraph}
          nameQueryAnswer={nameQueryAnswer}
          graph={graph}
          nameArray={keywordArray}
          mapAnswer={mapAnswer}
          setNameArray={setKeywordArray}
          setNameQueryAnswer={setNameQueryAnswer}
          setMapAnswer={setMapAnswer}
        />}
    </div>
  );
}

export default App;
