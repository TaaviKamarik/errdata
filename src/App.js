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
import {tabValues} from "./constants/constants";
import {tableDataProps} from "./components/nameTab/constants/constants";
import MapComponent from "./components/mapcomponent/MapComponent";
import MapComp2 from "./components/mapcomponent/MapComp2";

function App() {
  const url = "https://dti.tlu.ee/errlinked/api/src/"
  const [dateQueryValue, setDateQueryValue] = useState([2000, 2023])
  const [marksonaData, setMarksonaData] = useState();
  const [themes, setThemes] = useState();
  const [queryButtonPressed, setQueryButtonPressed] = useState(false)
  const [currentTabValue, setCurrentTabValue] = useState("nameTab");

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
    const dataProps = tableDataProps(textCodes, dateQueryValue);
    if (queryButtonPressed === "name") {
      dataProps.nimi = inputArray;
    }

    const otherProps = {tekst: textCodes, dateMin: dateQueryValue[0], dateMax: dateQueryValue[1]}

    const fetchmapData = async () => {
      const mapData = await fetchRequest(otherProps, "getmapdata");
      console.log(mapData);
      setMapAnswer(mapData);
    }

    const callFetch = async () => {
      const queryRes = await fetchRequest(dataProps, tabValues.urlProp[queryButtonPressed]);
      setQueryAnswer(queryRes);
      fetchThemes(textCodes);
    }
    setMapAnswer(null);
    fetchmapData();
    callFetch();
  }, [textCodes]);

  useEffect(() => {
    if (!inputArray) return;
    if(queryButtonPressed === "name") {
      callNameQuery();
    }
    if(queryButtonPressed === "keyword") {
      callKeywordQuery();
    }
  },[inputArray])

  const callNameQuery = async() => {
    console.log(inputArray)
    const names = await fetchRequest({tekst: inputArray}, "gettextcodesbyname");
    console.log(names)
    setTextCodes(names);
  }

  const callKeywordQuery = async() => {
    const keywords = await fetchRequest({marksonad: inputArray}, "gettextcodesbykeyword");
    setTextCodes(keywords);
  }


  const fetchThemes = (val) => {
    axios.post(url + "getthemes",{
      tekst: val,
      limit: 20,
      page: 1,
      sortBy: "kokku",
      sortOrder: "DESC",
      dateMin: dateQueryValue[0],
      dateMax: dateQueryValue[1],

    }, {headers: 'application/json; charset=utf-8'}).then((response) => {
      setThemes(response.data);
    })
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTabValue(newValue);
  };

  function handleBackButtonPress() {
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

  console.log(queryAnswer);

  return (
    <div className="App">
      {!queryButtonPressed &&
        <StartingView
          setInputArray={setInputArray}
          setQueryButtonPressed={setQueryButtonPressed}
          setTextCodes={setTextCodes}
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
                </TabList>
              </Box>
            </div>
            <TabPanel value="nameTab">
              {inputArray && queryButtonPressed === "name" && <NameTab inputArray={inputArray} textCodes={textCodes} setInputArray={setInputArray} dateQueryValue={dateQueryValue} tabVal={"nameTab"} queryAnswer={queryAnswer}/>}
              {inputArray && queryButtonPressed === "keyword" && <NameTab inputArray={inputArray} textCodes={textCodes} setInputArray={setInputArray} dateQueryValue={dateQueryValue} tabVal={"keywordTab"} queryAnswer={queryAnswer}/>}
            </TabPanel>
            <TabPanel value="keywordTab">
              {inputArray && queryButtonPressed === "name" && <ThemesTable tabVal={"nameTab"} themes={themes} textCodes={textCodes} inputArray={inputArray} setInputArray={setInputArray} dateValue={dateQueryValue} queryAnswer={queryAnswer}/>}
              {inputArray && queryButtonPressed === "keyword" && <ThemesTable tabVal={"keywordTab"} themes={themes} textCodes={textCodes} inputArray={inputArray} setInputArray={setInputArray} dateValue={dateQueryValue} queryAnswer={queryAnswer}/>}
            </TabPanel>
            <TabPanel value="mapTab">
              {inputArray && queryButtonPressed === "name" && <MapComp2 mapData={mapAnswer} inputArray={inputArray} tabVal={"nameTab"} setInputArray={setInputArray} />}
              {inputArray && queryButtonPressed === "keyword" && <MapComp2 mapData={mapAnswer} inputArray={inputArray} tabVal={"nameTab"} setInputArray={setInputArray} />}
            </TabPanel>
          </TabContext>
        </div>
       {/* <Suspense fallback={""}>
          <NameTable allCodes={nameThemes.length} url={url} teemaData={teemaData}
                 olemKoodid={nameThemes} olemData={nimeData} dateValue={dateQueryValue}/>
        </Suspense>*/}
      </div>}
    </div>
  );
}

export default App;
