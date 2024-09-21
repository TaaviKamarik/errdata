import React, { useState, useEffect } from 'react';
import {Checkbox, FormControlLabel, FormGroup, Button, TextField} from '@mui/material';
import {keywordFilter, nameFilter} from "../../functions/filterFunction";

const styles = {
  divStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px'
  },
  buttonStyle: {
    flex: '1',
  }
}


const KeywordTypeFilter = ({ queryAnswer, setFilteredData, filterBooleans, setFilterBooleans, uniqueValues }) => {
  const [checkedLabels, setCheckedLabels] = useState([]);
  const [search, setSearch] = useState([]);
  const [allChecked, setAllChecked] = useState(filterBooleans.categoryFilter.length === uniqueValues.length);
  const [isIndeterminate, setIsIndeterminate] = useState(filterBooleans.categoryFilter.length > 0 && filterBooleans.categoryFilter.length < uniqueValues.length);


  useEffect(() => {
    // Initialize checkedLabels with the current filter values
    setCheckedLabels(filterBooleans.categoryFilter);
  }, [filterBooleans]);

  const updateCheckStates = (newCheckedLabels) => {
    setCheckedLabels(newCheckedLabels);
    setAllChecked(newCheckedLabels.length === uniqueValues.length);
    setIsIndeterminate(newCheckedLabels.length > 0 && newCheckedLabels.length < uniqueValues.length);
  };

  const handleCheckBoxChange = (event) => {
    const label = event.target.value;
    const newCheckedLabels = event.target.checked
      ? [...checkedLabels, label]
      : checkedLabels.filter((item) => item !== label);

    updateCheckStates(newCheckedLabels);
  };

  const handleSubmit = () => {
    const filterBoolCopy = { ...filterBooleans };
    filterBoolCopy.categoryFilter = checkedLabels;
    setFilterBooleans(filterBoolCopy);
    keywordFilter(filterBoolCopy, queryAnswer, setFilteredData, uniqueValues);
   /* nameFilter(filterBoolCopy, queryAnswer, setFilteredData);*/
  };

  const handleMarkAll = (event) => {
    const checked = event.target.checked;
    const newCheckedLabels = checked ? uniqueValues : [];
    updateCheckStates(newCheckedLabels);
  };

  return (
    <div style={styles.divStyle}>
      <div style={{maxWidth: "300px"}}>
        <FormControlLabel
          style={{width: "100%"}}
          control={
            <Checkbox
              checked={allChecked}
              indeterminate={isIndeterminate}
              onChange={handleMarkAll}
            />
          }
          label={"Märgi/eemalda kõik"}
        />
        <TextField
          style={{width: "100%"}}
          label="Otsi"
          size={"small"}
          variant="outlined"
          onChange={(event) => setSearch(event.target.value)}/>
      </div>
      <div style={{maxHeight: "500px", overflowY: "scroll", width: "100%"}}>
      <FormGroup>
        {uniqueValues.map(value => {

          if (search.length > 0 && !value.toLowerCase().includes(search.toLowerCase())){
            return null;
          } else {
            return(
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={checkedLabels.includes(value)}
                    onChange={handleCheckBoxChange}
                    value={value}
                  />
                }
                label={value}
              />
            )
          }

        })}
      </FormGroup>
      </div>
      <Button fullWidth variant="contained" onClick={handleSubmit} style={styles.buttonStyle}>Rakenda filtrid</Button>
    </div>
  );
};

export default KeywordTypeFilter;
