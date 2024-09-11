import React, {useState} from 'react';
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Button, Tab} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import YearSlider from "../yearslider/YearSlider";
import NameNameTab from "./NameNameTab";
import {NameGraph} from "../namegraph/NameGraph";
import MapComp2 from "../mapcomponent/MapComp2";

const NameViews = ({setQueryButtonPressed, queryButtonPressed, setGraph, nameQueryAnswer, graph, nameArray, mapAnswer}) => {

  const [currentTabValue, setCurrentTabValue] = useState("nameTab");
  const handleTabChange = (event, newValue) => {
    setCurrentTabValue(newValue);
  };

  const [filterValues, setFilterValues] = useState({
    dateMin: 2000,
    dateMax: 2023,
    sortBy: "kokku",
    sortOrder: "DESC",
    page: 1,
    limit: 20,
  })

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
                  <Tab label="Graafivaade" value="GraphTab"/>
                </TabList>
              </Box>
            </div>
            <div><YearSlider filterValues={filterValues} setFilterValues={setFilterValues}/></div>
            <TabPanel value="nameTab">
              <NameNameTab queryButtonPressed={queryButtonPressed} setFilterValues={setFilterValues} setGraph={setGraph} filterValues={filterValues} tabVal={"nameTab"} queryAnswer={nameQueryAnswer}/>
            </TabPanel>
            {/*<TabPanel value="keywordTab">
              <ThemesTable queryButtonPressed={queryButtonPressed} setFilterValues={setFilterValues} setGraph={setGraph} tabVal={"nameTab"} themes={themes} textCodes={textCodes} inputArray={inputArray} setInputArray={setInputArray} filterValues={filterValues} queryAnswer={queryAnswer}/>
            </TabPanel>
            */}
           {/* <TabPanel value="mapTab">
              <MapComp2 queryButtonPressed={queryButtonPressed} nameQueryAnswer={nameQueryAnswer} setGraph={setGraph} mapData={mapAnswer} tabVal={"nameTab"} />
            </TabPanel>*/}
            {currentTabValue === "GraphTab" && <NameGraph graph={graph} setGraph={setGraph} nameArray={nameArray} nameQueryAnswer={nameQueryAnswer}/>}
          </TabContext>
        </div>
      </div>
    </div>
  );
};

export default NameViews;