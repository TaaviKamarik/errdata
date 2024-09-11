import React, {useEffect, useState} from "react";
import axios from "axios";
import {iconButtonStyle, sorterValues, urlValue} from "../../../constants/constants";
import {CircularProgress, IconButton, Popover} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ShowInnerPopup from "./ShowInnerPopup";
import {sortShowBoxArray} from "../helperfunctions/helperFunctions";
import getShowData from "../queries/getShowData";

export default function ShowBox({data, queryButtonPressed, version}) {

  const [changedShowMetadata, setChangedShowMetadata] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  console.log("LAENBOXI")

  /*useEffect(() => {
    getShowData(data.codeandyear.map(code => code.tekstikood), setShowMetaData)
    const fetchDataAndUpdateArray = async () => {
      try {
        const updatedDataArray = await Promise.all(data.tekstikood.map(async (item) => {
          // Initiate both fetch requests in parallel for each item
          const fetchFirst = axios.get(urlValue + "getnamescount", {
            params: {
              name: olemData,
              code: item.teksti_kood
            }
          })
          const fetchSecond = axios.get(urlValue + `getolemcount?name=${data.nimetus}&code=${item.teksti_kood}`)

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
  }, []);*/

  /*useEffect(() => {
    if(!showMetaData) return;

    if(queryButtonPressed === "name") {
      const queryList = data.tekstikood.map((item) => {
        return axios.get(urlValue + `getnamescount?name=${olemData}&name2=${data.nimetus}&code=${item}`)
      })

      Promise.all(queryList).then(response=> {
        const tempData = [...showMetaData];
        response.forEach((item, index) => {
          console.log(item.data)
          tempData[index].olemCount = item.data[0].nimi1;
          tempData[index].themeCount = item.data[0].nimi2;
        })
        setChangedShowMetadata(tempData);
      })
    } else {
    }
  }, [showMetaData])*/


  return(<div className={"sentence-container loaded-container"}>
    {/*{data && <>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div style={{display: "flex", flexDirection: "column", gap: "0.1em"}}>
          <div style={{display: "flex", alignItems: "center", gap: "0.2em"}}>

            <div className="olem-bubble"></div> - <div style={{lineHeight: "16px"}}>{olemData}</div>

          </div>
          <div style={{display: "flex", alignItems: "center", gap: "0.2em"}}>
            <div className="theme-bubble"></div> - <div style={{lineHeight: "16px"}}>{data.nimetus}</div>
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
            return <div className="show-sort-btn" onClick={() => {sortShowBoxArray(sorter.key, sorter.order, changedShowMetadata, setChangedShowMetadata)}}>{sorter.text}</div>
          })}
        </div>
      </Popover></>}*/}
    {!data && <div style={{display: "flex", minHeight: version === "table" && "600px",  justifyContent: "center", alignItems: "center"}}><CircularProgress/></div>}
    {data && data?.map((show, index) => {
      return(
          <ShowInnerPopup show={show} index={index} teemaVastus={data.nimetus}/>
      )
    })}
  </div>)
}