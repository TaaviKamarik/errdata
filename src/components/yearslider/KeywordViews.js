import React from 'react';
import StartingView from "./startingwiew/StartingView";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Button, Tab} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import YearSlider from "./yearslider/YearSlider";
import NameTab from "./nameTab/NameTab";
import NameTabKeyword from "./nameTab/NameTabKeyword";
import ThemesTable from "./table/themesTable/ThemesTable";
import ThemesTableKeyword from "./table/themesTable/ThemesTableKeyword";
import MapComp2 from "./mapcomponent/MapComp2";
import {NameGraph} from "./namegraph/NameGraph";

const KeywordViews = () => {
  return (
    <div className="App">
      <div>
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
              <NameTabKeyword queryButtonPressed={queryButtonPressed} selectedCode={selectedCode} setFilterValues={setFilterValues} setGraph={setGraph} inputArray={inputArray} textCodes={textCodes} setInputArray={setInputArray} filterValues={filterValues} tabVal={"keywordTab"} queryAnswer={queryAnswer}/>
            </TabPanel>
            <TabPanel value="keywordTab">
              <ThemesTableKeyword queryButtonPressed={queryButtonPressed} setFilterValues={setFilterValues} setGraph={setGraph} tabVal={"keywordTab"} themes={themes} textCodes={textCodes} inputArray={inputArray} setInputArray={setInputArray} filterValues={filterValues} queryAnswer={queryAnswer} keywordArray={marksonaList}/>
            </TabPanel>
            <TabPanel value="mapTab">
              <MapComp2 queryButtonPressed={queryButtonPressed} setGraph={setGraph} mapData={mapAnswer} inputArray={inputArray} tabVal={"nameTab"} setInputArray={setInputArray} />
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </div>
  );
};

export default KeywordViews;