import React, {useEffect, useState} from 'react';
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {Button, CircularProgress, TextField, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NameTable from "../table/nametable/NameTable";
import fetchRequest from "../../queries/fetchRequest";
import {addFilterButton, tableLoadCircularProgress, tabValues} from "../../constants/constants";
import {handleEnterPress} from "./helperfunctions/helperFunctions";
import {tableDataProps} from "./constants/constants";

export default function NameTab (
  {
    inputArray,
    textCodes,
    setInputArray,
    dateQueryValue,
    queryAnswer,
    tabVal
  }) {
  const [addFilterIsOpen, setAddFilterIsOpen] = useState(false);

  console.log(queryAnswer)

  return (
    <div>
      <div className="table-upper-container">
        <div className="main-word-container">{tabValues.titleSelection[tabVal]}</div>
        {inputArray.map((filter, index) => {
          return(
            <div className="added-filter">{filter}</div>
          )
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
      {/*<div><YearSlider setDateQueryValue={setDateQueryValue}/></div>*/}
      {queryAnswer ?
        <NameTable
          inputArray={inputArray}
          textCodes={textCodes}
          dateValue={dateQueryValue}
          tabVal={tabVal}
          queryAnswer={queryAnswer}
        />
        :
        <div style={tableLoadCircularProgress}><CircularProgress/></div>
      }
    </div>
  );
};