import React, {useState} from 'react';
import {
  Button, Chip, CircularProgress,
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
import {handleChipDelete} from "../../helperfunctions/helperFunctions";

const ThemesTable = ({tabVal, textCodes, setFilterValues, inputArray, filterValues, themes, setInputArray, setGraph}) => {
  const [valueClicked, setValueClicked] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")
  const [marksonaNimeData, setMarksonaNimeData] = useState(false)
  const [addFilterIsOpen, setAddFilterIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="table-upper-container">
        <div className="main-word-container">{tabValues.titleSelection[tabVal]}</div>
        {inputArray.map((filter, index) => {
          if(inputArray.length > 1) {
            return(
              <Chip label={filter} color="primary" style={{borderRadius: "10px", minHeight: "40px", fontSize: "1rem"}} onDelete={(e) => handleChipDelete(e, setInputArray, setGraph)} />
            )
          } else {
            return(
              <Chip label={filter} color="primary" style={{borderRadius: "10px", minHeight: "40px", fontSize: "1rem"}}/>
            )
          }
        })}
        {addFilterIsOpen && tabVal === "nameTab" &&
          <AutoCompleteWithScroll
            isMainPage={false}
            nimeData={inputArray}
            setNimeData={setInputArray}
            setAddFilterIsOpen={setAddFilterIsOpen}
          />}
        {addFilterIsOpen && tabVal === "keywordTab" &&
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
      {!themes && <div style={{width: "600px", height: "600px", display:"flex", alignItems: "center", justifyContent: "center"}}><CircularProgress/></div>}
      {!valueClicked && themes &&  <TableContainer>
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
                <TableCell className="themes-tab-theme-click" onClick={(e) => getLemmaData(e, row.tekstikood)} scope="row">
                  {row.marksona}
                </TableCell>
                <TableCell>{row.kokku}</TableCell>
                <TableCell>{row.tekste}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      }
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
            tabVal={"themesTab"}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
          />
        </div>}
      {valueClicked && !marksonaNimeData && <div style={{width: "600px", height: "600px", display:"flex", alignItems: "center", justifyContent: "center"}}><CircularProgress/></div>}
    </div>
  );
};

export default ThemesTable;