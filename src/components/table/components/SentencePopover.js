import React, {useEffect, useState} from 'react';
import {CircularProgress, Popover, Skeleton} from "@mui/material";
import axios, {CanceledError} from "axios";
import '../style/sentencePopover.css'
import {urlValue} from "../../../constants/constants";
import SentenceSkeleton from "./SentenceSkeleton";
import SentenceBox from "./SentenceBox";
import GraphShowList from "../../namegraph/GraphShowList";
import {buildGraph} from "../../namegraph/helperfunctions/buildGraph";

const SentencePopover = ({inputArray, rowVal, tyyp, data, selectedCode}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sentenceData, setSentenceData] = useState();
  const [renderData, setRenderData] = useState([]);
  const getOlemKood = async() => {
    const connections =  await axios.get(urlValue + `samesentence?nimi=${selectedCode}&kood=${data.olemi_kood}`)
    const connectionsData = connections.data;
    setRenderData(connectionsData);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleGetSentences = (event) => {
    getOlemKood();
    setAnchorEl(event.currentTarget)
  }

  const renderValues = () => {
    if(renderData === 'No rows') return "-";
    return renderData.length
  }

  return (
    <div>
      <div className={"same-sentence-click"} onClick={(e) => handleGetSentences(e)}><strong>{data.ykslause === 0 ? "-" : data.ykslause}</strong></div>
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