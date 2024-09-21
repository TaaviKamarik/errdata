import React from 'react';
import {Button, TextField} from "@mui/material";
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

const KeywordsInputFilter = ({queryAnswer, setFilteredData, filterBooleans, setFilterBooleans, uniqueValues}) => {
  const [value, setValue] = React.useState('');

  const filterValues = () => {
    const filterBoolCopy = {...filterBooleans};
    filterBoolCopy.keywordFilter = value;
    setFilterBooleans(filterBoolCopy);
    keywordFilter(filterBoolCopy, queryAnswer, setFilteredData, uniqueValues);
  }

  return (
    <div style={styles.divStyle}>
      <TextField placeholder="Otsi" defaultValue={filterBooleans.nameFilter} onChange={(e) => setValue(e.target.value)}/>
      <Button fullWidth style={styles.buttonStyle} variant="contained" onClick={() => filterValues()}>Rakenda filter</Button>
    </div>
  );
};

export default KeywordsInputFilter;