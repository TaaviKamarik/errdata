import React from 'react';
import {IconButton} from "@mui/material";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const SortButton = ({handleHeaderClick, tableColumn, sortValues}) => {
  return (
    <IconButton onClick={(e) => {handleHeaderClick(tableColumn)}}>
      {sortValues[tableColumn] === "A" && <ArrowUpwardIcon style={{cursor: "pointer"}}/>}
      {sortValues[tableColumn] === "D" && <ArrowDownwardIcon style={{cursor: "pointer"}}/>}
      {sortValues[tableColumn] === "" && <SwapVertIcon style={{cursor: "pointer"}}/>}

    </IconButton>
  );
};

export default SortButton;