import React, {Suspense, useEffect, useRef, useState} from 'react';
import '../style/table.css'
import axios, {CanceledError} from "axios";
import {CircularProgress, Pagination, Stack, Tooltip} from "@mui/material";
import {loadingSmall} from "../../../constants/constants";
import SentencePopover from "../components/SentencePopover";
import TablePagination from "../components/NameTablePagination";
import Show from "../components/Show";
import LaunchIcon from '@mui/icons-material/Launch';
import TrendCell from "../components/TrendCell";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import HelpIcon from '@mui/icons-material/Help';
import NameTablePagination from "../components/NameTablePagination";

const NameTable = ({filterValues, setFilterValues, tabVal, queryAnswer, queryButtonPressed}) => {
  const [sameSentenceValues, setSameSentenceValues] = useState([])
  const [renderData, setRenderData] = useState([])
  const [textCodeArray, setTextCodeArray] = useState([])
  const [sentenceData, setSentenceData] = useState([])
  const [page, setPage] = useState(1);
  const [tableRows, setTableRows] = useState(20);
  const [sortBy, setSortBy] = useState("kokku");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [localQuery, setLocalQuery] = useState(queryAnswer);
  const controller = new AbortController();
  const tyybid = {loc: "Asukoht", org: "Organisatsioon", per: "Isik"}

  const handlePageChange = (event, value) => {
    setPage(value);
    controller.abort()
  }

  const handleHeaderClick = (e) => {
    const ID = e.target.id;
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

    const sortedQueryAnswer = [...queryAnswer]

    if(attribute === "ASC"){
      sortedQueryAnswer.sort((a,b) => (a[ID] > b[ID]) ? 1 : ((b[ID] > a[ID]) ? -1 : 0))
    } else {
      sortedQueryAnswer.sort((a,b) => (a[ID] < b[ID]) ? 1 : ((b[ID] < a[ID]) ? -1 : 0))
    }

    setLocalQuery(sortedQueryAnswer);

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
              id={tabVal === "nameTab" ? "nimetus" :"lyhilemma"}
              data-order=""
              onClick={(e) => {handleHeaderClick(e)}}
            >
              {tabVal === "nameTab" ? "Koos mainitud nimi" : "Koos mainitus sõna"}<Tooltip title={tabVal === "nameTab" ? "Valitud nime(de)ga saadetes koos esinev nimi." : "Valitud nime(de)ga saadetes koos esinev märksõna."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
            {tabVal === "nameTab" && <th
              className={"data-table-header"}
              id={"tyyp"}
              data-order=""
              onClick={(e) => {
                handleHeaderClick(e)
              }}
            >
              Nime kategooria<Tooltip title={"Nimed jaotuvad kolme rühma: isikud, asukohad ja organisatsioonid."} placement={"top"}><HelpIcon
              sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>}
            <th
              className={"data-table-header"}
              id={"kokku"}
              data-order="DESC"
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Koosmainimisi kokku<Tooltip title={tabVal === "nameTab" ? "Kui mitu korda nimed saadetes koos esinevad." : "Kui mitu korda esineb leitud märksõna saadetes, kus on mainitud valitud nime(sid)."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
            {tabVal === "nameTab" && <th
              className={"data-table-header"}
              id={"ykslause"}
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Seosed lauses<Tooltip title={"Kui mitu korda esinevad nimed samas lauses, nii et need on seotud ühise tegevuse\n" +
              "või omaduse kaudu. Seoste arvul klõpsates avaneb täpsem info."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>}
            {queryAnswer[0].smskoor && <th
              className={"data-table-header"}
              id={"smskoor"}
              data-order=""
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Olulisuse skoor<Tooltip title={"Skoor näitab sõna olulisust võtmesõnana. Mida suurem skoor, seda suurem on sõna statistiline olulisus ehk seda paremini iseloomustab see ERR-i kultuurisaadete arhiivi sisu."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>}
            <th
              className={"data-table-header"}
              id={"koodNr"}
              data-order=""
              onClick={(e) => {handleHeaderClick(e)}}
            >
              Erinevaid saateid<Tooltip title={"Kui mitmes saates nimed koos esinevad."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
            <th
              className={"data-table-header"}
            >
              Trend<Tooltip title={"Nimede koosesinemise trend aastate lõikes."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
            </th>
          </tr>
        </thead>
        <tbody>
          {/*{queryAnswer[0] && localQuery.map((data, index) => {
              return(
                <tr key={"row" + index}>
                  <td>{data.lyhilemma || data.nimetus}</td>
                  {tabVal === "nameTab" && <td>{tyybid[data.tyyp]}</td>}
                  <td>{data.kokku}</td>
                  {data.smskoor && <td>{parseFloat(data.smskoor).toFixed(3)}</td>}
                  {tabVal === "nameTab" && inputArray.length === 1 &&<td>
                    <SentencePopover
                    key={data.lyhilemma || data.nimetus}
                    data={data}
                    inputArray={inputArray}
                    tyyp={data.tyyp}
                    />
                  </td>}
                  <td>
                    <Show
                      olemData={inputArray[0]}
                      data={data}
                      textCodes={textCodes}
                      queryButtonPressed={queryButtonPressed}
                    />
                  </td>
                  <td><TrendCell data={data} olemData={inputArray[0]} filterValues={filterValues}/></td>
                </tr>
              )
          })}*/}
        </tbody>
      </table>
      {/*<NameTablePagination
        handlePageChange={handlePageChange}
        tableRows={tableRows}
        filterValues={filterValues}
        queryValue={queryAnswer}
      />*/}
    </div>
  );
};

export default NameTable;