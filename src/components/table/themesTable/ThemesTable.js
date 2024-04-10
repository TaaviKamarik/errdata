import React, {useState} from 'react';
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField, Tooltip
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from "axios";
import './themesTable.css';
import NameTable from "../nametable/NameTable";
import {addFilterButton, tabValues, urlValue} from "../../../constants/constants";
import AutoCompleteWithScroll from "../../autocompletewithscroll/AutoCompleteWithScroll";
import {handleEnterPress} from "../../nameTab/helperfunctions/helperFunctions";
import AddIcon from "@mui/icons-material/Add";

const ThemesTable = ({tabVal, textCodes, inputArray, dateValue, themes, setInputArray}) => {
  const [valueClicked, setValueClicked] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")
  const [marksonaNimeData, setMarskonaNimeData] = useState(false)
  const [addFilterIsOpen, setAddFilterIsOpen] = useState(false);

  const getLemmaData = (e) => {
    axios.post(urlValue + "getmarksonadnimedest", {
      tekst: textCodes,
      teema: [e.target.innerText],
      limit: 20,
      page: 1,
      sortBy: "kokku",
      sortOrder: "DESC",
      dateMin: dateValue[0],
      dateMax: dateValue[1]
    }).then((response) => {
      setMarskonaNimeData(response.data)
      setValueClicked(true);
      setSelectedValue(e.target.innerText)
    })
  }

  const handleChosenCategoryBack = () => {
    setValueClicked(false);
    setSelectedValue("");
  }


  return (
    <div>
      <div className="table-upper-container">
        <div className="main-word-container">{tabValues.titleSelection[tabVal]}</div>
        {inputArray.map((filter, index) => {
          return(
            <div className="added-filter">{filter}</div>
          )
        })}
        {addFilterIsOpen && tabVal === "nameTab" &&
          <AutoCompleteWithScroll
            isMainPage={false}
            nimeData={inputArray}
            setNimeData={setInputArray}
            setAddFilterIsOpen={setAddFilterIsOpen}
          />}
        {addFilterIsOpen&& tabVal === "keywordTab" &&
          <TextField onKeyDown={(e) => {handleEnterPress(e, setInputArray, inputArray, setAddFilterIsOpen)}}></TextField>}
        <Tooltip title={"Lisa nimede filtreid"}>
          <Button
            onClick={() => setAddFilterIsOpen(true)}
            color={"success"}
            variant="contained"
            sx={addFilterButton}
          >
            <AddIcon fontSize={"medium"}/>
          </Button>
        </Tooltip>
      </div>
      {!valueClicked && <TableContainer>
        <Table sx={{maxWidth: 800}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: "bold", fontSize: "1rem"}}>Teema</TableCell>
              <TableCell sx={{fontWeight: "bold", fontSize: "1rem"}}>Esinemisi kokku</TableCell>
              <TableCell sx={{fontWeight: "bold", fontSize: "1rem"}}>Saateid kokku</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {themes && themes.map((row) => (
              <TableRow
                key={row.marksona}
              >
                <TableCell className="themes-tab-theme-click" onClick={(e) => getLemmaData(e)} scope="row">
                  {row.marksona}
                </TableCell>
                <TableCell>{row.kokku}</TableCell>
                <TableCell>{row.tekste}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      {valueClicked && marksonaNimeData &&
        <div>
          <div style={{display: "flex", paddingLeft: "2rem", alignItems: "center", gap: "1rem"}}>
            <IconButton onClick={() => handleChosenCategoryBack()} aria-label="delete" size="small">
              <ArrowBackIosIcon sx={{color: "#1976D2"}} fontSize="inherit" />
            </IconButton>
            <div>Valitud Kategooria: <span style={{fontWeight: "bold"}}>{selectedValue}</span></div>
          </div>
          <NameTable
            inputArray={inputArray}
            textCodes={textCodes}
            queryAnswer={marksonaNimeData}
            tabVal={tabVal}
            dateValue={dateValue}/>
        </div>
      }
    </div>
  );
};

export default ThemesTable;