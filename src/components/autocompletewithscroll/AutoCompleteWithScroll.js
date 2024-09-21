import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import getAllPeopleForDropDown from "../../queries/getAllPeopleForDropDown";
import {handleScroll} from "./helperfunctions/helperFunctions";
import useFetchOnPeopleInputChange from "./hooks/useFetchOnPeopleInputChange";
import {Chip} from "@mui/material";

export default function AutoCompleteWithScroll (props) {
  const [inputValue, setInputValue] = useState('');
  const [prevInputValue, setPrevInputValue] = useState();
  const [peopleOptions, setPeopleOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const amount = 20;

  const fetchOlem = (word, currentPage, innerPage, innerPeopleOptions) => {
    if (loading || !hasMore) return;
    setLoading(true);
    if (innerPeopleOptions.length > 0 && innerPage === 0) return
    getAllPeopleForDropDown(innerPage, word, amount, currentPage, setHasMore, setPeopleOptions, setOffset, setPage, setLoading);
  }

  // Fetch initial data
  useFetchOnPeopleInputChange(inputValue, offset, fetchOlem, prevInputValue, setPrevInputValue, peopleOptions, page)

  const callHandleScroll = (event) => {
    handleScroll(event, fetchOlem, inputValue, offset, page, peopleOptions);
  }

  const handleSelect = (event, value) => {
    props.setNimeData(value)
  }

  console.log(props.nameArray)

  return (
    <Autocomplete
      sx={{width: "auto !important"}}
      noOptionsText=""
      size="small"
      defaultValue={() => props.nameArray.map((person) => ({"nimetus": person}))}
      fullWidth
      multiple
      options={peopleOptions}
      getOptionLabel={(option) => option.nimetus}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        setPeopleOptions([]); // Clear options on input change
        setPage(0); // Reset page counter
        setHasMore(true);// Reset hasMore flag
      }}
      renderInput={(params) =>
        <TextField
          fullWidth
          variant={"outlined"}
          {...params}
          label={props.label}
          style={props.isTableView ? {minWidth: "300px"} : {width: "100%"}}
           />}
      onChange={
        (event, value) => handleSelect(event, value)
      }
      ListboxProps={{
        onScroll: callHandleScroll
      }}
    />
  );
};