import React, {useState} from 'react';
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Button, Tab} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NameNameTab from "./KeywordNameTab";
import {NameGraph} from "../namegraph/NameGraph";
import MapComp2 from "../mapcomponent/MapComp2";
import NameInput from "./KeywordInput";
import RowsPerTable from "../RowsPerTable";
import NameKeywordsTable from "./KeywordKeywordsTable";
import KeywordInput from "./KeywordInput";
import KeywordKeywordsTable from "./KeywordKeywordsTable";

const KeywordViews = (
  {
    setIsKeywordsLoading,
    isKeywordsLoading,
    isLoading,
    filterValues,
    nameKeywordQueryAnswer,
    setNameKeywordQueryAnswer,
    setQueryButtonPressed,
    queryButtonPressed,
    setGraph,
    nameQueryAnswer,
    graph,
    nameArray,
    mapAnswer,
    setNameArray,
    setNameQueryAnswer,
    setMapAnswer,
    setIsLoading
  }) => {

  const [currentTabValue, setCurrentTabValue] = useState("nameTab");
  const [tableRows, setTableRows] = useState(20);
  const handleTabChange = (event, newValue) => {
    setCurrentTabValue(newValue);
  };

  console.log(isKeywordsLoading)

  return (
    <div className="App">
      <div>
        <div>
          <TabContext value={currentTabValue}>
            <div className="table-upper-container">
              <Button onClick={() => setQueryButtonPressed(false)} variant="contained" sx={{borderRadius: "10px", padding: "0.5em", minWidth: "30px", minHeight: "30px"}}><ArrowBackIosNewIcon fontSize={"medium"}/></Button>
              <Box>
                <TabList onChange={handleTabChange}>
                  <Tab label="Nimede seosed" value="nameTab" />
                  <Tab label="Märksõnade seosed" value="keywordTab" />
                  <Tab label="Kaardivaade" value="mapTab" />
                  {/*<Tab label="Graafivaade" value="GraphTab"/>*/}
                </TabList>
              </Box>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "20px"}}>
              <KeywordInput
                setIsKeywordsLoading={setIsKeywordsLoading}
                filterValues={filterValues}
                setNameKeywordQueryAnswer={setNameKeywordQueryAnswer}
                isTableView={true}
                nameArray={nameArray}
                setNameArray={setNameArray}
                setNameQueryAnswer={setNameQueryAnswer}
                setQueryButtonPressed={setQueryButtonPressed}
                setGraph={setGraph}
                setMapAnswer={setMapAnswer}
                setIsLoading={setIsLoading}
              />
              {["nameTab", "keywordTab"].includes(currentTabValue) && <RowsPerTable tableRows={tableRows} setTableRows={setTableRows}/>}
            </div>
            <TabPanel value="nameTab">
              <NameNameTab
                tableRows={tableRows}
                queryButtonPressed={queryButtonPressed}
                setGraph={setGraph}
                filterValues={filterValues}
                tabVal={"nameTab"}
                queryAnswer={nameQueryAnswer}
              />
            </TabPanel>
            <TabPanel value="keywordTab">
              {isKeywordsLoading ?
                <div style={{height: "600px", width: "100vw", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
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
                </div>
                :
                <KeywordKeywordsTable
                  queryAnswer={nameKeywordQueryAnswer}
                  filterValues={filterValues}
                  tableRows = {tableRows}
                />
              }
            </TabPanel>
           <TabPanel value="mapTab">
              <MapComp2 queryButtonPressed={queryButtonPressed} nameQueryAnswer={nameQueryAnswer} setGraph={setGraph} mapData={mapAnswer} tabVal={"nameTab"} />
            </TabPanel>
            {/*{currentTabValue === "GraphTab" && <NameGraph graph={graph} setGraph={setGraph} nameArray={nameArray} nameQueryAnswer={nameQueryAnswer}/>}*/}
          </TabContext>
        </div>
      </div>
    </div>
  );
};

export default KeywordViews;