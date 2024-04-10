import React from 'react';
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {Button, CircularProgress, TextField, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import YearSlider from "../yearslider/YearSlider";
import NameTable from "../table/nametable/NameTable";
import fetchRequest from "../../queries/fetchRequest";
import ThemesTable from "../table/themesTable/ThemesTable";

export default function KeywordTab (
  {
    keywordArray,
    textCodes,
  }) {

  /*  const dataProps = {
      tekst: nameTextCodes,
      limit: 20,
      page: 1,
      nimi: nimeData,
      sortBy: "kokku",
      sortOrder: "DESC",
      dateMin: dateQueryValue[0],
      dateMax: dateQueryValue[1]
    }*/

  return (
    <div>
      <div className="table-upper-container">
        <div className="main-word-container">{nimeData ? "Valitud nimed:" : "Valitud märksõnad:"}</div>
        {nimeData && <div className="added-filter">{nimeData}</div>}
        {(nimeData ? nameFilters : keywordArray).map((filter, index) => {
          return(
            <div className="added-filter">{filter}</div>
          )
        })}
        {addFilterIsOpen && nimeData && <AutoCompleteWithScroll url={url} isMainPage={false} nimeData={nameFilters} setNimeData={setNameFilters}/>}
        {addFilterIsOpen && marksonaData && <TextField onKeyDown={(e) => {if(e.key === "Enter"){addToMarksonaArray(e.target.value)}}}></TextField>
        }
        <Tooltip title={"Lisa märksõnade filtreid"}>
          <Button onClick={() => setAddFilterIsOpen(true)} color={"success"} variant="contained" sx={{borderRadius: "10px", padding: "0.5em", minWidth: "30px", minHeight: "30px"}}><AddIcon fontSize={"medium"}/></Button>
        </Tooltip>
      </div>
      <div><YearSlider setDateQueryValue={setDateQueryValue}/></div>
      <div>
        {nameThemes.length === 0 && <div style={{width: "50vw", height: "500px", display: "flex", alignItems: "center", justifyContent: "center"}}><CircularProgress/></div>}
        {nameThemes === "No rows" && <div>Valitud nimega ei leitud seoseid</div>}
        {nameThemes.length > 0 && nameThemes !== "No rows" && <ThemesTable nimeData={nimeData} tabVal={currentTabValue} nameThemes={nameThemes} nameTextCodes={nameTextCodes} url={url} dateValue={dateQueryValue}/>}
      </div>
    </div>
  );
};