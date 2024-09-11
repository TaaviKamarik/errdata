import React, {useState} from 'react';
import { CircularProgress} from "@mui/material";
import {tableLoadCircularProgress, tabValues} from "../../constants/constants";
import {Alert} from "@mui/lab";
import NameNameTable from "./NameNameTable";

export default function NameNameTab (
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
      <div className="table-upper-container">
        <div className="main-word-container">{tabValues.titleSelection[tabVal]}</div>
      </div>
      {!queryAnswer.length === 0 && <Alert severity="warning">Nime kohta ei leitud infot. Muuda filtrites aastaarve ja proovi uuesti!</Alert>}
      {queryAnswer &&
        <NameNameTable
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