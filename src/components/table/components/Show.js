import React, {useState} from 'react';
import '../style/show.css';
import {Popover} from "@mui/material";
import SentenceSkeleton from "./SentenceSkeleton";
import ShowBox from "./ShowBox";
import getShowData from "../queries/getShowData";

export default function Show({data, olemData, textCodes}) {
  const shows = data.tekstikood?.split(",");
  const cellRef = React.useRef();
  const [showMetadata, setShowMetadata] = useState()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  console.log(showMetadata)
  return (
    <div className="shows-cell" ref={cellRef}>
      <div onClick={(e) => getShowData(e, setAnchorEl, shows, setShowMetadata)}>
        <span>
          <strong className="show-number-color">
            {data.koodNr}
          </strong>
          <span className="show-percentage-value">
            (${(parseInt(data.koodNr) * 100 / textCodes.length).toFixed(0)}%)
          </span>
        </span>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() =>  setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {!showMetadata
          ?
          <div className="sentence-container loading-container">
            <SentenceSkeleton/>
          </div>
          :
          <ShowBox
            showMetaData={showMetadata}
            olemData={olemData}
            data={data}
          />
        }
      </Popover>
    </div>
  );
};