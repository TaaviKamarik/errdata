import React, {useState} from 'react';
import './style/startingView.css';
import {Box, Button, Paper, Tab} from "@mui/material";
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import TextField from "@mui/material/TextField";
import {startingWiewButton} from "./constants/constants";
import fetchRequest from "../../queries/fetchRequest";
import {MultiDirectedGraph} from "graphology";
import AutoCompleteWithScrollKeywords from "../autocompletewithscroll/AutoCompleteWithScrollKeywords";
import {tabValues, urlValue} from "../../constants/constants";
import axios from "axios";
import NameInput from "../nameview/NameInput";
import KeywordInput from "../keywordview/KeywordInput";

const StartingView = (
  {
    setIsKeywordsLoading,
    keywordArray,
    filterValues,
    nameArray,
    setNameArray,
    setKeywordArray,
    setQueryButtonPressed,
    setGraph,
    setNameQueryAnswer,
    setMapAnswer,
    setIsLoading,
    setNameKeywordQueryAnswer
  }) => {
  const [modeValue, setModeValue] = useState('names');


  const [selectedKeywords, setSelectedKeywords] = useState([]);


  const handleModeChange = (event, newValue) => {
    setModeValue(newValue)
  }

  const callKeywordQuery = async() => {
    setKeywordArray(selectedKeywords)
    setQueryButtonPressed("keyword");
  }

  return (
    <div className={"start-screen-container"}>
      <Paper className="selection-container">
        <TabContext value={modeValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleModeChange} aria-label="lab API tabs example">
              <Tab sx={{width: "50%"}} label="Nimepäring" value="names" />
              <Tab sx={{width: "50%"}} label="Märksõnapäring" value="keywords" />
            </TabList>
          </Box>
          <TabPanel value="names">
            <NameInput
              filterValues={filterValues}
              setNameKeywordQueryAnswer={setNameKeywordQueryAnswer}
              isTableView={false}
              setNameArray={setNameArray}
              nameArray={nameArray}
              setNameQueryAnswer={setNameQueryAnswer}
              setQueryButtonPressed={setQueryButtonPressed}
              setGraph={setGraph}
              setMapAnswer={setMapAnswer}
              setIsLoading={setIsLoading}
              setIsKeywordsLoading={setIsKeywordsLoading}
            />
          </TabPanel>
          <TabPanel value="keywords">
            <KeywordInput
              filterValues={filterValues}
              setNameKeywordQueryAnswer={setNameKeywordQueryAnswer}
              isTableView={false}
              setNameArray={setKeywordArray}
              nameArray={keywordArray}
              setNameQueryAnswer={setNameQueryAnswer}
              setQueryButtonPressed={setQueryButtonPressed}
              setGraph={setGraph}
              setMapAnswer={setMapAnswer}
              setIsLoading={setIsLoading}
              setIsKeywordsLoading={setIsKeywordsLoading}
            />
          </TabPanel>
        </TabContext>
      </Paper>
    </div>

  );
};

export default StartingView;