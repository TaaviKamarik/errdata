import './App.css';
import {Box, Button, CircularProgress, Tab, TextField, Tooltip} from "@mui/material";
import React, {Suspense, useEffect, useState} from "react";
import NameTable from "./components/table/nametable/NameTable";
import axios from "axios";
import StartingView from "./components/startingwiew/StartingView";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import {TabContext, TabList, TabPanel} from "@mui/lab";
import AutoCompleteWithScroll from "./components/autocompletewithscroll/AutoCompleteWithScroll";
import ThemesTable from "./components/table/themesTable/ThemesTable";
import YearSlider from "./components/yearslider/YearSlider";
import NameTab from "./components/nameTab/NameTab";
import KeywordTab from "./components/keywordTab/KeywordTab";
import fetchRequest from "./queries/fetchRequest";
import {tabValues, urlValue} from "./constants/constants";
import {tableDataProps} from "./components/nameTab/constants/constants";
import MapComponent from "./components/mapcomponent/MapComponent";
import MapComp2 from "./components/mapcomponent/MapComp2";
import {NetworkGraph} from "./components/networkgraph/NetworkGraph";
import {NameGraph} from "./components/namegraph/NameGraph";
import {MultiDirectedGraph} from "graphology";

function App() {
  const url = "https://dti.tlu.ee/errlinked/api/src/"
  const [filterValues, setFilterValues] = useState({
    dateMin: 2000,
    dateMax: 2023,
    sortBy: "kokku",
    sortOrder: "DESC",
    page: 1,
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
  const [inputArray, setInputArray] = useState();

  const [queryAnswer, setQueryAnswer] = useState();
  const [mapAnswer, setMapAnswer] = useState();

  const [nimeList, setNimeList] = useState([]);
  const [marksonaList, setMarksonaList] = useState([]);

  const [queryProps, setQueryProps] = useState();

  useEffect (() => {
    if(!marksonaData) return;
    setMarksonaList([marksonaData]);
    callMarksonaQuery();
  }, [keywordArray]);

  useEffect(() => {
    if (nameTextCodes.length === 0) return;
  }, [nameTextCodes]);

  useEffect(() => {
    if (!inputArray) return;
    const dataProps = tableDataProps(textCodes, filterValues);
    if (queryButtonPressed === "name") {
      dataProps.nimi = inputArray;
      dataProps.mainOlem = selectedCode;
    }

    const otherProps = {tekst: textCodes, dateMin: filterValues.dateMin, dateMax: filterValues.dateMax}

    const callFetch = async () => {
      if(textCodes.length === 0) return;
      setMapAnswer(null);
      const queryRes = await fetchRequest(dataProps, tabValues.urlProp[queryButtonPressed]);
      console.log(queryRes);
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

      filteredQuery.forEach((val) => {
        promiseArray.push(axios.get(urlValue + `getmapcoordinates?code=${val.olemi_kood}`))
      });

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
    if(queryButtonPressed === "name") {
      callNameQuery();
    }
    if(queryButtonPressed === "keyword") {
      callKeywordQuery();
    }
  },[inputArray, filterValues])

  const callNameQuery = async() => {
    const nameCode = await axios.get(urlValue + `getolemkood?name=${inputArray[0]}`);
    const names = await fetchRequest({tekst: inputArray}, "gettextcodesbyname");
    if(names !== "No rows") {
      setTextCodes(names);
      setSelectedCode(nameCode.data[0].kood)
    }
  }

  const callKeywordQuery = async() => {
    const keywords = await fetchRequest({marksonad: inputArray}, "gettextcodesbykeyword");
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
      setNameTextCodes(response.data);
      fetchThemes(response.data);
    });
  }

  const addToMarksonaArray = (val) => {
    const stringArray = val.trim().split(" ");
    const tempArray = [...keywordArray];
    stringArray.forEach((val) => {
      tempArray.push(val);
    });
    setKeywordArray(tempArray);
  }

  console.log(queryAnswer)

  return (
    <div className="App">
      {!queryButtonPressed &&
        <StartingView
          setInputArray={setInputArray}
          setQueryButtonPressed={setQueryButtonPressed}
          setGraph={setGraph}
        />}
      {queryButtonPressed &&  <div>
        <div>
          <TabContext value={currentTabValue}>
            <div className="table-upper-container">
              <Button onClick={() => handleBackButtonPress()} variant="contained" sx={{borderRadius: "10px", padding: "0.5em", minWidth: "30px", minHeight: "30px"}}><ArrowBackIosNewIcon fontSize={"medium"}/></Button>
              <Box>
                <TabList onChange={handleTabChange}>
                  <Tab label="Nimede seosed" value="nameTab" />
                  <Tab label="Märksõnade seosed" value="keywordTab" />
                  <Tab label="Kaardivaade" value="mapTab" />
                  {queryButtonPressed === "name" && <Tab label="Graafivaade" value="GraphTab"/>}
                </TabList>
              </Box>
            </div>
            <div><YearSlider filterValues={filterValues} setFilterValues={setFilterValues}/></div>
            <TabPanel value="nameTab">
              {inputArray && queryButtonPressed === "name" && <NameTab queryButtonPressed={queryButtonPressed} selectedCode={selectedCode} setFilterValues={setFilterValues} setGraph={setGraph} inputArray={inputArray} textCodes={textCodes} setInputArray={setInputArray} filterValues={filterValues} tabVal={"nameTab"} queryAnswer={queryAnswer}/>}
              {inputArray && queryButtonPressed === "keyword" && <NameTab queryButtonPressed={queryButtonPressed} selectedCode={selectedCode} setFilterValues={setFilterValues} setGraph={setGraph} inputArray={inputArray} textCodes={textCodes} setInputArray={setInputArray} filterValues={filterValues} tabVal={"keywordTab"} queryAnswer={queryAnswer}/>}
            </TabPanel>
            <TabPanel value="keywordTab">
              {inputArray && queryButtonPressed === "name" && <ThemesTable queryButtonPressed={queryButtonPressed} setFilterValues={setFilterValues} setGraph={setGraph} tabVal={"nameTab"} themes={themes} textCodes={textCodes} inputArray={inputArray} setInputArray={setInputArray} filterValues={filterValues} queryAnswer={queryAnswer}/>}
              {inputArray && queryButtonPressed === "keyword" && <ThemesTable queryButtonPressed={queryButtonPressed} setFilterValues={setFilterValues} setGraph={setGraph} tabVal={"keywordTab"} themes={themes} textCodes={textCodes} inputArray={inputArray} setInputArray={setInputArray} filterValues={filterValues} queryAnswer={queryAnswer}/>}
            </TabPanel>
            <TabPanel value="mapTab">
              {inputArray && queryButtonPressed === "name" && <MapComp2 queryButtonPressed={queryButtonPressed} setGraph={setGraph} mapData={mapAnswer} inputArray={inputArray} tabVal={"nameTab"} setInputArray={setInputArray} />}
              {inputArray && queryButtonPressed === "keyword" && <MapComp2 queryButtonPressed={queryButtonPressed} setGraph={setGraph} mapData={mapAnswer} inputArray={inputArray} tabVal={"nameTab"} setInputArray={setInputArray} />}
            </TabPanel>

            {queryButtonPressed === "name" && currentTabValue === "GraphTab" && <NameGraph graph={graph} setGraph={setGraph} setInputArray={setInputArray} inputArray={inputArray}/>}

          </TabContext>
        </div>
        {/*<Suspense fallback={""}>
          <NameTable allCodes={nameThemes.length} url={url} teemaData={teemaData}
                 olemKoodid={nameThemes} olemData={nimeData} dateValue={dateQueryValue}/>
        </Suspense>*/}
      </div>}
    </div>
  );
}

export default App;
