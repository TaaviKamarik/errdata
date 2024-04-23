import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import getAllPeopleForDropDown from "../../queries/getAllPeopleForDropDown";
import {handleScroll} from "./helperfunctions/helperFunctions";
import useFetchOnPeopleInputChange from "./hooks/useFetchOnPeopleInputChange";

export default function AutoCompleteWithScroll (props) {
  const [inputValue, setInputValue] = useState('');
  const [prevInputValue, setPrevInputValue] = useState();
  const [peopleOptions, setPeopleOptions] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const amount = 20;

  const fetchOlem = (word, currentPage) => {
    if (loading || !hasMore) return;
    setLoading(true);
    getAllPeopleForDropDown(page, word, amount, currentPage, setHasMore, setPeopleOptions, setOffset, setPage, setLoading);
  }

  // Fetch initial data
  useFetchOnPeopleInputChange(inputValue, offset, fetchOlem, prevInputValue, setPrevInputValue)

  const callHandleScroll = (event) => {
    handleScroll(event, fetchOlem, inputValue, offset);
  }

  const handleSelect = (event, value) => {
    props.isMainPage ? props.setNimeData([value]) : props.setNimeData([...props.nimeData, value])
    !props.isMainPage && props.setAddFilterIsOpen(false);
  }

  return (
    <Autocomplete
      sx={{width: "auto !important", transform: "translateY(0.3em)"}}
      noOptionsText=""
      size="small"
      fullWidth
      options={peopleOptions}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        setPeopleOptions([]); // Clear options on input change
        setPage(0); // Reset page counter
        setHasMore(true); // Reset hasMore flag
      }}
      renderInput={(params) =>
        <TextField
          fullWidth
          variant={"outlined"}
          {...params}
          label={props.label}
          style={!props.isMainPage ? {width: "300px"} : {}}
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