import React, {useState} from 'react';
import { CircularProgress} from "@mui/material";
import {tableLoadCircularProgress, tabValues} from "../../constants/constants";
import {Alert} from "@mui/lab";
import NameNameTable from "./KeywordNameTable";

export default function KeywordNameTab (
  {
    tableRows,
    filterValues,
    queryAnswer,
    tabVal,
    setGraph,
    queryButtonPressed
  }) {

  return (
    <div>
      {/*<div className="table-upper-container">
        <div className="main-word-container">{tabValues.titleSelection[tabVal]}</div>
      </div>*/}
      {!queryAnswer.length === 0 && <Alert severity="warning">Nime kohta ei leitud infot. Muuda filtrites aastaarve ja proovi uuesti!</Alert>}

        <NameNameTable
          tableRows={tableRows}
          filterValues={filterValues}
          tabVal={tabVal}
          queryAnswer={queryAnswer}
          queryButtonPressed={queryButtonPressed}
        />
    </div>
  );
};