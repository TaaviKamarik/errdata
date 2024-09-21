import React, {useState} from 'react';
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {Box, Button} from "@mui/material";
import {startingWiewButton} from "../startingwiew/constants/constants";
import fetchRequest from "../../queries/fetchRequest";
import {MultiDirectedGraph} from "graphology";
import AutoCompleteWithScrollKeywords from "../autocompletewithscroll/AutoCompleteWithScrollKeywords";

const styles = {
  tableViewStyle: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "center",
    justifyContent: "start",
    height: "100%",
    borderRadius: "10px",
    margin: "10px",
    marginLeft: "20px",
    marginTop: "20px"
  },
  buttonStyle: {

  }
}

const KeywordInput = (
  {
    setIsKeywordsLoading,
    filterValues,
    nameArray,
    setNameArray,
    setNameQueryAnswer,
    setGraph,
    setQueryButtonPressed,
    setMapAnswer,
    setIsLoading,
    isTableView,
    setNameKeywordQueryAnswer
  }) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedKeywordCode, setSelectedKeywordCode] = useState([]);

  const callKeywordQuery = async() => {
    setIsLoading(true);
    setIsKeywordsLoading(true);
    console.log(selectedKeywords)
    const keywords = selectedKeywords[0];
    console.log(keywords)
    setNameArray(keywords);
    const namesTextCodesResult = await fetchRequest({marksonad: keywords, minYear: filterValues.dateMin, maxYear: filterValues.dateMax}, "gettextcodesbykeyword");
    console.log(namesTextCodesResult)
    if(namesTextCodesResult !== "No rows") {
      const props = {
        dateMin: 2000,
        dateMax: 2023,
        sortBy: "kokku",
        sortOrder: "DESC",
        page: 1,
        limit: 10000000000,
        tekst: namesTextCodesResult,
      }
      const queryRes = await fetchRequest(props, "getnimedmarksonadestcopy");
      setNameQueryAnswer(queryRes)
      setQueryButtonPressed("keyword");
      setGraph(new MultiDirectedGraph())
      const filteredQuery = queryRes.filter((val) => val.tyyp === 'loc');
      setIsLoading(false);

      const mapResponse = await fetchRequest({places: filteredQuery.map(value => value.olemi_kood)}, "getmapdatacopy");
      const mergedArray = filteredQuery.map(obj1 => {
        const obj2 = mapResponse.find(obj => obj.olemi_kood === obj1.olemi_kood);
        return { ...obj1, ...obj2 };
      }).filter(obj => 'laiuskraad' in obj && 'pikkuskraad' in obj);
      setMapAnswer(mergedArray);

      const keywordResponse = await fetchRequest({keywords: keywords, dateMin: filterValues.dateMin, dateMax: filterValues.dateMax}, "getmarksonadmarksonadest");
      console.log(keywordResponse)
      setNameKeywordQueryAnswer(keywordResponse)
      setIsKeywordsLoading(false);
    }
  }

  return (
    <Box sx={isTableView && styles.tableViewStyle}>
      {!isTableView && <div className="starting-view-text">Märksõnad: </div>}
      <AutoCompleteWithScrollKeywords
        keywordArray={nameArray}
        isMainPage={true}
        setSelectedKeywords={setSelectedKeywords}
        selectedKeywords={selectedKeywords}
      />
      <Button
        disabled={!selectedKeywords[0]}
        sx={isTableView ? styles.buttonStyle : startingWiewButton}
        onClick={callKeywordQuery}
        variant={"contained"}
      >
        Saada päring
      </Button>
    </Box>
  );
};

export default KeywordInput;