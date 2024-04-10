import React, {useState} from 'react';
import './style/startingView.css';
import {Box, Button, Paper, Tab} from "@mui/material";
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import TextField from "@mui/material/TextField";
import {startingWiewButton} from "./constants/constants";
import fetchRequest from "../../queries/fetchRequest";

const StartingView = ({setInputArray, setQueryButtonPressed, setTextCodes}) => {
  const [modeValue, setModeValue] = useState('names');
  const [selectedName, setSelectedName] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState([]);

  const handleModeChange = (event, newValue) => {
    setModeValue(newValue)
  }

  console.log(selectedName)
  const callNameQuery = async() => {
    setInputArray(selectedName);
    setQueryButtonPressed("name");
  }

  const callKeywordQuery = async() => {
    console.log(selectedKeyword)
    setInputArray(selectedKeyword)
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
            <div>
              <div className="starting-view-text">Nimi: </div>
              <AutoCompleteWithScroll
                isMainPage={true}
                setNimeData={setSelectedName}
                nimeData={selectedName}
              />
              <Button
                disabled={!selectedName[0]}
                sx={startingWiewButton}
                onClick={callNameQuery}
                variant={"contained"}
              >
                Saada päring
              </Button>
            </div>
          </TabPanel>
          <TabPanel value="keywords">
            <div>
              <div className="starting-view-text">Märksõna: </div>
              <TextField
                size={"small"}
                sx={{width: "100%"}}
                variant="outlined"
                onChange={(e) => setSelectedKeyword(e.currentTarget.value.trim().split(" "))}
              />
              <Button
                disabled={!selectedKeyword[0]}
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