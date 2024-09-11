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

const StartingView = ({setNameArray, setKeywordArray, setQueryButtonPressed, setGraph, setNameQueryAnswer, setMapAnswer}) => {
  const [modeValue, setModeValue] = useState('names');


  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const [filterValues, setFilterValues] = useState({
    dateMin: 2000,
    dateMax: 2023,
    sortBy: "kokku",
    sortOrder: "DESC",
    page: 1,
  })

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
              setNameArray={setNameArray}
              setNameQueryAnswer={setNameQueryAnswer}
              setQueryButtonPressed={setQueryButtonPressed}
              setGraph={setGraph}
              setMapAnswer={setMapAnswer}
            />
          </TabPanel>
          <TabPanel value="keywords">
            <div>
              <div className="starting-view-text">Märksõna: </div>
              <AutoCompleteWithScrollKeywords
                isMainPage={true}
                setSelectedKeywords={setSelectedKeywords}
                selectedKeywords={selectedKeywords}
              />
              <Button
                disabled={!selectedKeywords[0]}
                sx={startingWiewButton}
                variant={"contained"}
                onClick={callKeywordQuery}
              >
                Saada päring
              </Button>
            </div>
          </TabPanel>
        </TabContext>
      </Paper>
    </div>

  );
};

export default StartingView;