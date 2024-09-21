import React, {useState} from 'react';
import {
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from "axios";
import NameKeywordsTable from "./NameKeywordsTable";
import {urlValue} from "../../constants/constants";

const NameThemesTable = (
  {

    tableRows,
    setFilterValues,
    filterValues,
    queryAnswer,
  }) => {
  const [valueClicked, setValueClicked] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")
  const [marksonaNimeData, setMarksonaNimeData] = useState(false)

  const getLemmaData = (e, textCodeArray) => {
    setValueClicked(true);
    setMarksonaNimeData(null);
    axios.post(urlValue + "getmarksonadnimedest", {
      tekst: textCodeArray,
      teema: [e.target.innerText],
      limit: 100000000,
      page: filterValues.page,
      sortBy: filterValues.sortBy,
      sortOrder: filterValues.sortOrder,
      dateMin: filterValues.dateMin,
      dateMax: filterValues.dateMax
    }).then((response) => {
      const responseAnswer = response.data;
      responseAnswer.forEach((val, index) => {
        const shows = val.tekstikood.split(",");
        const textcodes = [];
        const years = [];
        shows.forEach((show) => {
          const splitValue = show.split(":");
          textcodes.push(splitValue[0]);
          years.push(splitValue[1]);
        })
        responseAnswer[index].tekstikood = textcodes;
        responseAnswer[index].years = years;
      })
      setMarksonaNimeData(responseAnswer)
      setSelectedValue(e.target.innerText)
    })
  }

  console.log(marksonaNimeData)

  const handleChosenCategoryBack = () => {
    setValueClicked(false);
    setSelectedValue("");
  }


  return (
    <div>
      {queryAnswer &&
        <div>
          <div style={{display: "flex", paddingLeft: "2rem", alignItems: "center", gap: "1rem"}}>
            <IconButton onClick={() => handleChosenCategoryBack()} aria-label="delete" size="small">
              <ArrowBackIosIcon sx={{color: "#1976D2"}} fontSize="inherit" />
            </IconButton>
            <div>Valitud Kategooria: <span style={{fontWeight: "bold"}}>{selectedValue}</span></div>
          </div>
          <NameKeywordsTable
            queryAnswer={marksonaNimeData}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            tableRows = {tableRows}
          />
        </div>}
      {valueClicked && !marksonaNimeData && <div style={{width: "600px", height: "600px", display:"flex", alignItems: "center", justifyContent: "center"}}><CircularProgress/></div>}
    </div>
  );
};

export default NameThemesTable;