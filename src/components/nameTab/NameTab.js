import React, {useEffect, useState} from 'react';
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {Button, Chip, CircularProgress, TextField, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NameTable from "../table/nametable/NameTable";
import fetchRequest from "../../queries/fetchRequest";
import {addFilterButton, tableLoadCircularProgress, tabValues} from "../../constants/constants";
import {handleEnterPress} from "./helperfunctions/helperFunctions";
import {tableDataProps} from "./constants/constants";
import {handleChipDelete} from "../helperfunctions/helperFunctions";
import {Alert} from "@mui/lab";
import YearSlider from "../yearslider/YearSlider";

export default function NameTab (
  {
    inputArray,
    textCodes,
    setInputArray,
    filterValues,
    queryAnswer,
    tabVal,
    setGraph,
    setFilterValues,
    selectedCode,
    queryButtonPressed
  }) {
  const [addFilterIsOpen, setAddFilterIsOpen] = useState(false);

  return (
    <div>
      <div className="table-upper-container">
        <div className="main-word-container">{tabValues.titleSelection[tabVal]}</div>
        {inputArray.map((filter, index) => {
          if(inputArray.length > 1) {
            return(
              <Chip label={filter} color="primary" style={{borderRadius: "10px", minHeight: "40px", fontSize: "1rem"}} onDelete={(e) => handleChipDelete(e, setInputArray, setGraph)} />
            )
          } else {
            return(
              <Chip label={filter} color="primary" style={{borderRadius: "10px", minHeight: "40px", fontSize: "1rem"}}/>
            )
          }
        })}
        {addFilterIsOpen && tabVal === "nameTab" &&
          <AutoCompleteWithScroll
            isMainPage={false}
            nimeData={inputArray}
            setNimeData={setInputArray}
            setAddFilterIsOpen={setAddFilterIsOpen}
          />}
        {addFilterIsOpen&& tabVal === "keywordTab" &&
          <TextField onKeyDown={(e) => {handleEnterPress(e, setInputArray, inputArray, setAddFilterIsOpen)}}></TextField>}
        <Tooltip title={"Lisa nimede filtreid"}>
          <Button
            onClick={() => setAddFilterIsOpen(true)}
            color={"success"}
            variant="contained"
            sx={addFilterButton}
          >
            <AddIcon fontSize={"medium"}/>
          </Button>
        </Tooltip>
      </div>
      {textCodes.length === 0 && <Alert severity="warning">Nime kohta ei leitud infot. Muuda filtrites aastaarve ja proovi uuesti!</Alert>}
      {queryAnswer &&
        <NameTable
          inputArray={inputArray}
          textCodes={textCodes}
          filterValues={filterValues}
          tabVal={tabVal}
          queryAnswer={queryAnswer}
          setFilterValues={setFilterValues}
          selectedCode={selectedCode}
          queryButtonPressed={queryButtonPressed}
        />
      }
      {!queryAnswer && textCodes.length > 0 &&
        <div style={tableLoadCircularProgress}><CircularProgress/></div>
      }
    </div>
  );
};