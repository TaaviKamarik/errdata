import React, {useState} from 'react';
import '../table/style/table.css'
import {Button, IconButton, Tooltip} from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import SentencePopover from "../table/components/SentencePopover";
import Show from "../table/components/Show";
import TrendCell from "../table/components/TrendCell";
import FilterPopUp from "../FilterPopUp";
import InputFilter from "../filterinners/InputFilter";
import CheckBoxFilter from "../filterinners/checkBoxFilter";
import SliderFilter from "../filterinners/SliderFilter";
import NameTablePagination from "../table/components/NameTablePagination";
import SortButton from "../SortButton";
import KeywordTypeFilter from "../filterinners/KeywordTypeFilter";
import KeywordsInputFilter from "../filterinners/KeywordsInputFilter";
import KeywordsSliderFilter from "../filterinners/KeywordsSliderFilter";

const KeywordKeywordsTable = (
  {
    filterValues,
    tabVal,
    queryAnswer,
    queryButtonPressed,
    tableRows
  }) => {
  const [sameSentenceValues, setSameSentenceValues] = useState([])
  const [renderData, setRenderData] = useState([])
  const [textCodeArray, setTextCodeArray] = useState([])
  const [sentenceData, setSentenceData] = useState([])
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("kokku");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [localQuery, setLocalQuery] = useState(queryAnswer);
  const controller = new AbortController();
  const tyybid = {loc: "Asukoht", org: "Organisatsioon", per: "Isik"}
  const [sortValues, setSortValues] = useState({lyhilemma: "", tyyp: "", suurim_sm: "D", keskmine_sm: "", total: "", koodNr: "", minYear: "", maxYear: ""})
  const [filteredData, setFilteredData] = useState(queryAnswer);
  const [uniqueValues, setUniqueValues] = useState([...new Set(queryAnswer.flatMap(item => item.marksonad))])
  const [filterBooleans, setFilterBooleans] = useState({keywordFilter: "", categoryFilter: uniqueValues, maxSmFilter: [], avgSmFilter: [], totalFilter: [], differentShowFilter: [], yearFilter: []})

  console.log(queryAnswer)
  const handlePageChange = (event, value) => {
    setPage(value);
    controller.abort()
  }

  const handleHeaderClick = (ID) => {
    const currentDirection = sortValues[ID] || "";

    const newDirection = currentDirection === "" || currentDirection === "A" ? "D" : "A";

    const newSortValues = {lyhilemma: "", tyyp: "", suurim_sm: "", keskmine_sm: "", total: "", saateid: "", minYear: "", maxYear: ""}
    newSortValues[ID] = newDirection;

    setSortValues(newSortValues);

    const sortedQueryAnswer = [...filteredData].sort((a, b) => {
      // Check if the property exists in the objects
      if (!(ID in a) || !(ID in b)) {
        console.error(`Property ${ID} not found in one or both objects:`, a, b);
        return 0;  // Don't change order if property is missing
      }

      let valueA = a[ID];
      let valueB = b[ID];

      // Handle undefined or null values
      if (valueA == null) return newDirection === "A" ? -1 : 1;
      if (valueB == null) return newDirection === "A" ? 1 : -1;

      // Determine if values are numeric
      const isNumericA = !isNaN(parseFloat(valueA)) && isFinite(valueA);
      const isNumericB = !isNaN(parseFloat(valueB)) && isFinite(valueB);

      // Convert to appropriate type
      if (isNumericA && isNumericB) {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      } else {
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
      }

      // Compare values
      if (valueA < valueB) return newDirection === "A" ? -1 : 1;
      if (valueA > valueB) return newDirection === "A" ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedQueryAnswer);
  }

  return (
    <div>
      <table cellSpacing={"0"} cellPadding={"5"} className="data-table">
        <thead className={"table-header"}>
        <tr>
          <th
            className={"data-table-header"}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>Märksõna<Tooltip title="Valitud nime(de)ga saadetes koos esinev nimi." placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip></span>
              <span style={{display: "flex", alignItems: "center"}}>
                <SortButton handleHeaderClick={handleHeaderClick} tableColumn={"lyhilemma"} sortValues={sortValues}/>
                <FilterPopUp filterElement = {
                  <KeywordsInputFilter
                    uniqueValues={uniqueValues}
                    filterBooleans={filterBooleans}
                    setFilterBooleans={setFilterBooleans}
                    queryAnswer={queryAnswer}
                    setFilteredData={setFilteredData}/>}
                />
              </span>
            </div>
          </th>
          <th
            className={"data-table-header"}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>Liigitus<Tooltip title="Nimed jaotuvad kolme rühma: isikud, asukohad ja organisatsioonid." placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip></span>
              <span style={{display: "flex", alignItems: "center"}}>
                <FilterPopUp
                  filterElement =
                    {<KeywordTypeFilter
                      uniqueValues={uniqueValues}
                      filterBooleans={filterBooleans}
                      setFilterBooleans={setFilterBooleans}
                      queryAnswer={queryAnswer}
                      setFilteredData={setFilteredData}/>}
                />
              </span>
            </div>
          </th>
          {/*<th
            className={"data-table-header"}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>Suurim SM<Tooltip title="Kui mitu korda esinevad nimed samas lauses, nii et need on seotud ühise tegevuse\n või omaduse kaudu. Seoste arvul klõpsates avaneb täpsem info." placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip></span>
              <span style={{display: "flex", alignItems: "center"}}>
                <SortButton handleHeaderClick={handleHeaderClick} tableColumn={"suurim_sm"} sortValues={sortValues}/>
                <FilterPopUp
                  filterElement =
                    {<KeywordsSliderFilter
                      filterBooleans={filterBooleans}
                      setFilterBooleans={setFilterBooleans}
                      queryAnswer={queryAnswer}
                      setFilteredData={setFilteredData}
                      filterName={"maxSmFilter"}
                      attributeName={"suurim_sm"}
                      uniqueValues={uniqueValues}
                      step={0.0001}
                    />}
                />
              </span>
            </div>
          </th>*/}
          <th
            className={"data-table-header"}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>Keskmine SM<Tooltip title="Kui mitu korda esinevad nimed samas lauses, nii et need on seotud ühise tegevuse\n või omaduse kaudu. Seoste arvul klõpsates avaneb täpsem info." placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip></span>
              <span style={{display: "flex", alignItems: "center"}}>
                <SortButton handleHeaderClick={handleHeaderClick} tableColumn={"keskmine_sm"} sortValues={sortValues}/>
                <FilterPopUp
                  filterElement =
                    {<KeywordsSliderFilter
                      filterBooleans={filterBooleans}
                      setFilterBooleans={setFilterBooleans}
                      queryAnswer={queryAnswer}
                      setFilteredData={setFilteredData}
                      filterName={"avgSmFilter"}
                      attributeName={"keskmine_sm"}
                      uniqueValues={uniqueValues}
                      step={0.0001}
                    />}
                />
              </span>
            </div>
          </th>
          <th
            className={"data-table-header"}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>Koosmainimisi<Tooltip title="Kui mitu korda nimed saadetes koos esinevad." placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip></span>
              <span style={{display: "flex", alignItems: "center"}}>
                <SortButton handleHeaderClick={handleHeaderClick} tableColumn={"total"} sortValues={sortValues}/>
                <FilterPopUp
                  filterElement =
                    {<KeywordsSliderFilter
                      filterBooleans={filterBooleans}
                      setFilterBooleans={setFilterBooleans}
                      queryAnswer={queryAnswer}
                      setFilteredData={setFilteredData}
                      filterName={"totalFilter"}
                      attributeName={"total"}
                      uniqueValues={uniqueValues}
                      step={1}
                    />}
                />
              </span>
            </div>
          </th>
          <th
            className={"data-table-header"}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>Erinevaid saateid<Tooltip title="Kui mitu korda esinevad nimed samas lauses, nii et need on seotud ühise tegevuse\n või omaduse kaudu. Seoste arvul klõpsates avaneb täpsem info." placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip></span>
              <span style={{display: "flex", alignItems: "center"}}>
                <SortButton handleHeaderClick={handleHeaderClick} tableColumn={"koodNr"} sortValues={sortValues}/>
                <FilterPopUp
                  filterElement =
                    {<KeywordsSliderFilter
                      filterBooleans={filterBooleans}
                      setFilterBooleans={setFilterBooleans}
                      queryAnswer={queryAnswer}
                      setFilteredData={setFilteredData}
                      filterName={"differentShowFilter"}
                      attributeName={"koodNr"}
                      uniqueValues={uniqueValues}
                      step={1}
                    />}
                />
              </span>
            </div>
          </th>
          <th
            className={"data-table-header"}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>Aastavahemik<Tooltip title="Kui mitmes saates nimed koos esinevad." placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip></span>
            </div>
          </th>
          <th
            className={"data-table-header"}
          >
            Trend<Tooltip title={"Nimede koosesinemise trend aastate lõikes."} placement={"top"}><HelpIcon sx={{fontSize: "0.8em", lineHeight: "0.8em"}}/></Tooltip>
          </th>
        </tr>
        </thead>
        <tbody>
        {filteredData?.map((data, index) => {
          if (index < (page - 1) * tableRows || index >= page * tableRows) {
            return null;
          }
          return(
            <tr key={"row" + index}>
              <td>{data.lyhilemma}</td>
              <td>{data.marksonad.join(", ")}</td>
              {/*<td>{data.suurim_sm}</td>*/}
              <td>{data.keskmine_sm}</td>
              <td>{data.total}</td>
              <td>
               <Show
                  data={data}
                  queryButtonPressed={queryButtonPressed}
                />
              </td>
              {/*<td>
                <SentencePopover data={data}/>
              </td>*/}
              <td>
                {data.min_aasta} - {data.max_aasta}
              </td>
              <td><TrendCell data={data} filterValues={filterValues}/></td>
            </tr>
          )
        })}
        </tbody>
      </table>
      <NameTablePagination
        handlePageChange={handlePageChange}
        tableRows={tableRows}
        filterValues={filterValues}
        queryValue={filteredData}
      />
    </div>
  );
};

export default KeywordKeywordsTable;