import React, {useEffect, useState} from 'react';
import {CircularProgress, Popover, Skeleton} from "@mui/material";
import axios, {CanceledError} from "axios";
import '../style/sentencePopover.css'
import {urlValue} from "../../../constants/constants";
import SentenceSkeleton from "./SentenceSkeleton";
import SentenceBox from "./SentenceBox";
import GraphShowList from "../../namegraph/GraphShowList";
import {buildGraph} from "../../namegraph/helperfunctions/buildGraph";
import fetchRequest from "../../../queries/fetchRequest";

const SentencePopover = ({data}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [renderData, setRenderData] = useState([]);
   const getOlemKood = async() => {
    const connections =  await fetchRequest({codes: data.sama_lause}, "samesentencecopy")
    setRenderData(connections);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleGetSentences = (event) => {
    console.log(data.sama_lause)
    if(data.sama_lause.length === 0) return;
    getOlemKood();
    setAnchorEl(event.currentTarget)
  }

  const renderValues = () => {
    if(renderData === 'No rows') return "-";
    return renderData.length
  }

  return (
    <div>
      <div className={"same-sentence-click"} onClick={(e) => handleGetSentences(e)}><strong>{data.sama_lause_nr === 0 ? "-" : data.sama_lause_nr}</strong></div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {!renderData ? <SentenceSkeleton/> : <GraphShowList showData={renderData}/>}
      </Popover>
    </div>
  );
};

export default SentencePopover;