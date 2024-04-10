import React, {useEffect, useState} from "react";
import axios from "axios";
import {iconButtonStyle, sorterValues, urlValue} from "../../../constants/constants";
import {IconButton, Popover} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SentenceSkeleton from "./SentenceSkeleton";
import ShowInnerPopup from "./ShowInnerPopup";
import {sortShowBoxArray} from "../helperfunctions/helperFunctions";

export default function ShowBox({showMetaData, olemData, data}) {
  const[showData, setShowData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  useEffect(() => {
    const fetchDataAndUpdateArray = async () => {
      try {
        const updatedDataArray = await Promise.all(showMetaData.map(async (item) => {
          // Initiate both fetch requests in parallel for each item
          const fetchFirst = axios.get(urlValue + "getolemcount", {
            params: {
              name: olemData,
              code: item.teksti_kood
            }
          })
          const fetchSecond = axios.get(urlValue + "getthemecount", {
            params: {
              lemma: data.lyhilemma || data.nimetus,
              code: item.teksti_kood
            }
          })

          // Wait for both fetch requests to complete
          const [firstResponse, secondResponse] = await Promise.all([fetchFirst, fetchSecond]);

          // Update the item with new keys based on the responses
          return {
            ...item,
            olemCount: parseInt(firstResponse.data[0]), // Adjust based on actual response structure
            themeCount: parseInt(secondResponse.data[0]), // Adjust based on actual response structure
          };
        }));

        setShowData(updatedDataArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndUpdateArray();
  }, []);

  return(<div className={"sentence-container loaded-container"}>
    {showData.length !== 0 && <>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div style={{display: "flex", flexDirection: "column", gap: "0.1em"}}>
          <div style={{display: "flex", alignItems: "center", gap: "0.2em"}}>
            <div className="olem-bubble"></div> - <div style={{lineHeight: "16px"}}>{olemData}</div>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "0.2em"}}>
            <div className="theme-bubble"></div> - <div style={{lineHeight: "16px"}}>{data.lyhilemma || data.nimetus}</div>
          </div>
        </div>
        <IconButton sx={iconButtonStyle} onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="filter" size="small"><SwapVertIcon/></IconButton></div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className="show-sort-btn-container">
          <div>Sorteeri:</div>
          {sorterValues.map((sorter) => {
            return <div className="show-sort-btn" onClick={() => {sortShowBoxArray(sorter.key, sorter.order)}}>{sorter.text}</div>
          })}
        </div>
      </Popover></>}
    {showData.length > 0 && showData?.map((show, index) => {
      return(
        <div>
          <ShowInnerPopup show={show} index={index} olemData={olemData} teemaVastus={data.lyhilemma || data.nimetus}/>
        </div>
      )
    })}
  </div>)
}