import React, {useState} from 'react';
import '../style/show.css';
import {Popover} from "@mui/material";
import SentenceSkeleton from "./SentenceSkeleton";
import ShowBox from "./ShowBox";
import getShowData from "../queries/getShowData";

export default function Show({data, olemData, textCodes, queryButtonPressed}) {
  const cellRef = React.useRef();
  const [showMetadata, setShowMetadata] = useState()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  return (
    <div className="shows-cell" ref={cellRef}>
      <div onClick={(e) => setAnchorEl(e.currentTarget)}>
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
        <div style={{minHeight: "600px", padding: "0.5rem"}}>
          <div style={{fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem"}}>Saadete nimekiri</div>
          <ShowBox
            olemData={olemData}
            data={data}
            queryButtonPressed={queryButtonPressed}
            version={"table"}
          />
        </div>

      </Popover>
    </div>
  );
};