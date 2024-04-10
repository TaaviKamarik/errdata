import React, {useEffect, useState} from 'react';
import {CircularProgress, Popover, Skeleton} from "@mui/material";
import axios, {CanceledError} from "axios";
import '../style/sentencePopover.css'
import {urlValue} from "../../../constants/constants";
import SentenceSkeleton from "./SentenceSkeleton";
import SentenceBox from "./SentenceBox";

const SentencePopover = ({inputArray, controller, rowVal}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [sentenceData, setSentenceData] = useState();
  const [renderData, setRenderData] = useState([]);

  useEffect(() => {
      axios.get(urlValue + "samesentence", {
        params: {
          olem: inputArray[0],
          teema: rowVal,
        },
        signal: controller.signal
      }).then(response => {
        console.log(response.data)
        setRenderData(response.data);
      }).catch((e) => {
        if (e instanceof CanceledError) {
          console.log("Request was cancelled")
        }
      })
  }, [])

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleGetSentences = (event) => {
    setAnchorEl(event.currentTarget)
    const promises = [];
    renderData.forEach((entry) => {
      console.log(entry)
      const inputs = entry.lause_kood.split("_");
      promises.push(axios.get(urlValue + "getsamesentences", {
        params: {
          code: inputs[0],
          sentence: inputs[1]
        }
      }))
    })

    Promise.all(promises).then((res) => {
      setSentenceData(res); // Use the callback to ensure the latest state
    })
  }

  const renderValues = () => {
    if(renderData === 'No rows') return "-";
    return renderData.length
  }

  return (
    <div>
      {renderData.length === 0
        ?
        <CircularProgress size={10} color="primary" />
        :
        <div className={"same-sentence-click"} onClick={(e) => handleGetSentences(e)}><strong>{renderValues()}</strong></div>
      }
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
        {!sentenceData ? <SentenceSkeleton/> : <SentenceBox sentenceData={sentenceData}/>}
      </Popover>
    </div>
  );
};

export default SentencePopover;