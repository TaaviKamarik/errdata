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
    filterValues,
    queryAnswer,
    tabVal,
    setGraph,
    setFilterValues,
    queryButtonPressed
  }) {
  const [addFilterIsOpen, setAddFilterIsOpen] = useState(false);

  return (
    <div>
{/*      <div className="table-upper-container">
        <div className="main-word-container">{tabValues.titleSelection[tabVal]}</div>
      </div>*/}
      {!queryAnswer.length === 0 && <Alert severity="warning">Nime kohta ei leitud infot. Muuda filtrites aastaarve ja proovi uuesti!</Alert>}
      {queryAnswer &&
        <NameTable
          filterValues={filterValues}
          tabVal={tabVal}
          queryAnswer={queryAnswer}
          setFilterValues={setFilterValues}
          queryButtonPressed={queryButtonPressed}
        />
      }
      {!queryAnswer &&
        <div style={tableLoadCircularProgress}><CircularProgress/></div>
      }
    </div>
  );
};