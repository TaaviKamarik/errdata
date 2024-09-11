import React, {useState} from 'react';
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {Button} from "@mui/material";
import {startingWiewButton} from "../startingwiew/constants/constants";
import fetchRequest from "../../queries/fetchRequest";
import {MultiDirectedGraph} from "graphology";

const NameInput = ({setNameArray, setNameQueryAnswer, setGraph, setQueryButtonPressed, setMapAnswer}) => {
  const [selectedName, setSelectedName] = useState([]);
  const [selectedNameCode, setSelectedNameCode] = useState([]);

  const callNameQuery = async() => {
    const names = selectedName.map(name => name.nimetus);
    const codes = selectedName.map(name => name.kood);
    setNameArray(names);
    const namesTextCodesResult = await fetchRequest({tekst: names}, "gettextcodesbyname");
    console.log(names)
    if(namesTextCodesResult !== "No rows") {
      const props = {
        dateMin: 2000,
        dateMax: 2023,
        sortBy: "sama_lause",
        sortOrder: "DESC",
        page: 1,
        nimi: names,
        limit: 10000000000,
        tekst: namesTextCodesResult,
        codes: codes
      }
      const queryRes = await fetchRequest(props, "getnimednimedestcopy");
      console.log(queryRes)
      setNameQueryAnswer(queryRes)
      setQueryButtonPressed("name");
      setGraph(new MultiDirectedGraph())
      const filteredQuery = queryRes.filter((val) => val.tyyp === 'loc');
      console.log(filteredQuery)

      const newQuery = filteredQuery.filter((val) => val.hasOwnProperty("laiuskraad"));
      setMapAnswer(newQuery);
    }
  }

  return (
    <div>
      <div className="starting-view-text">Nimi: </div>
      <AutoCompleteWithScroll
        isMainPage={true}
        setNimeData={setSelectedName}
        nimeData={selectedName}
        selectedNameCode={selectedNameCode}
        setSelectedNameCode={setSelectedNameCode}
      />
      <Button
        disabled={!selectedName[0]}
        sx={startingWiewButton}
        onClick={callNameQuery}
        variant={"contained"}
      >
        Saada päring
      </Button>
    </div>
  );
};

export default NameInput;