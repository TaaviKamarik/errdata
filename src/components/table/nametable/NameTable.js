import React, {Suspense, useEffect, useRef, useState} from 'react';
import '../style/table.css'
import axios, {CanceledError} from "axios";
import {CircularProgress, Pagination, Stack, Tooltip} from "@mui/material";
import {loadingSmall} from "../../../constants/constants";
import SentencePopover from "../components/SentencePopover";
import TablePagination from "../components/TablePagination";
import Show from "../components/Show";
import LaunchIcon from '@mui/icons-material/Launch';
import TrendCell from "../components/TrendCell";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import HelpIcon from '@mui/icons-material/Help';

const NameTable = ({inputArray, textCodes, dateValue, tabVal, queryAnswer}) => {
  const [sameSentenceValues, setSameSentenceValues] = useState([])
  const [renderData, setRenderData] = useState([])
  const [textCodeArray, setTextCodeArray] = useState([])
  const [sentenceData, setSentenceData] = useState([])
  const [page, setPage] = useState(1);
  const [tableRows, setTableRows] = useState(20);
  const [sortBy, setSortBy] = useState("kokku");
  const [sortOrder, setSortOrder] = useState("DESC");
  const controller = new AbortController();

  const tyybid = {loc: "Asukoht", org: "Organisatsioon", per: "Isik"}

  const handlePageChange = (event, value) => {
    setPage(value);
    controller.abort()
  }

  const handleHeaderClick = (e) => {
    controller.abort();
    setSortBy(e.target.id);
    let attribute = e.target.getAttribute("data-order");
    if(attribute === ""){
      attribute = "DESC";
    }else if (attribute === "DESC"){
      attribute = "ASC";
    } else {
      attribute = "DESC";
    }
    setSortOrder(attribute)
    document.querySelectorAll(".data-table-header").forEach((val) => {val.setAttribute("data-order", "")});
    e.target.setAttribute("data-order", attribute);
  }

  return (
    <div>
      <table cellSpacing={"0"} cellPadding={"5"} className="data-table">
        <thead className={"table-header"}>
          <tr>
            <th
              className={"data-table-header"}
              id={"lyhilemma"}
              data-order=""
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Koos mainitud sõna<Tooltip title={"Tekstis esinenud märksõna teemalise sõna algvorm."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
            <th
              className={"data-table-header"}
              id={"kokku"}
              data-order="DESC"
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Koosmainimisi kokku<Tooltip title={"Mitu korda valitud olem ja märksõna tekstides koos esinesid."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
            {tabVal === "nameTab" && <th
              className={"data-table-header"}
              id={"tekstikood"}
            >
              Samas lauses<Tooltip title={"Mitu korda valitud olem ja märksõna tekstides koos esinesid."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>}
            {queryAnswer[0].smskoor && <th
              className={"data-table-header"}
              id={"smskoor"}
              data-order=""
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Sõna üldine SM skoor<Tooltip title={"Märksõna SM skoor. SM (Sõnade Mitmekesisuse) skoor mõõdab sõna kasutuse mitmekesisust erinevates kontekstides või tekstides, näidates, kui muutlikult sõna kasutatakse."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>}
            <th
              className={"data-table-header"}
              id={"tyyp"}
              data-order=""
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Nime kategooria<Tooltip title={"Mis kategooriasse nimi jaotatud on."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
            <th
              className={"data-table-header"}
              id={"koodNr"}
              data-order=""
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Erinevaid saateid<Tooltip title={"Mitmes erinevas saates olem ja märksõna koos esinenud on."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
            <th
              className={"data-table-header"}
            >
              Trend<Tooltip title={"Olemi ja märksõna koosesinemise trend aastate lõikes."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
          </tr>
        </thead>
        <tbody>
          {queryAnswer[0] && queryAnswer.map((data, index) => {
            return(
              <tr key={"row" + index}>
                <td>{data.lyhilemma || data.nimetus}</td>
                <td>{data.kokku}</td>
                {tabVal === "nameTab" &&<td>
                  <SentencePopover
                    key={data.lyhilemma || data.nimetus}
                    rowVal={data.lyhilemma || data.nimetus}
                    inputArray={inputArray}
                    controller={controller}
                    />
                </td>}
                {data.smskoor && <td>{parseFloat(data.smskoor).toFixed(3)}</td>}
                <td>{tyybid[data.tyyp]}</td>
                <td>
                  <Show
                    olemData={inputArray[0]}
                    data={data}
                    textCodes={textCodes}
                  />
                </td>
                <td><TrendCell data={data.tekstikood} dateValue={dateValue}/></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {/*Add pagination to table*/}
      {/*<TablePagination
        handlePageChange={handlePageChange}
        page={page}
        tableRows={tableRows}
        olemKoodid={olemKoodid}
        teemaVastus={teemaVastus}
        url={url}
        dateValue={dateValue}/>*/}
    </div>
  );
};

export default NameTable;