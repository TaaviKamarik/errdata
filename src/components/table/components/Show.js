import React, {useState} from 'react';
import '../style/show.css';
import {Popover} from "@mui/material";
import SentenceSkeleton from "./SentenceSkeleton";
import ShowBox from "./ShowBox";
import getShowData from "../queries/getShowData";
import fetchRequest from "../../../queries/fetchRequest";

export default function Show({data, queryButtonPressed}) {
  const cellRef = React.useRef();
  const [showMetadata, setShowMetadata] = useState()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const callTextMetadata = async (e) => {
    const metadata = await fetchRequest({data: data.codeandyear.map((codeandyear) => codeandyear.tekstikood)}, "getshowsmetadata");
    setShowMetadata(metadata);
    console.log(metadata)
    console.log(e.target)
    setAnchorEl(e.target)
  }

  return (
    <div className="shows-cell" ref={cellRef}>
      <div onClick={(e) => callTextMetadata(e)}>
        <span>
          <strong className="show-number-color">
            {data.koodNr}
          </strong>
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
            data={showMetadata}
            queryButtonPressed={queryButtonPressed}
            version={"table"}
          />
        </div>

      </Popover>
    </div>
  );
};