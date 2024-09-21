import React from 'react';
import {Button, TextField} from "@mui/material";
import {nameFilter} from "../../functions/filterFunction";

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

const InputFilter = ({queryAnswer, setFilteredData, filterBooleans, setFilterBooleans}) => {
  const [value, setValue] = React.useState('');

  const filterValues = () => {
    const filterBoolCopy = {...filterBooleans};
    filterBoolCopy.nameFilter = value;
    setFilterBooleans(filterBoolCopy);
    nameFilter(filterBoolCopy, queryAnswer, setFilteredData);
  }

  return (
    <div style={styles.divStyle}>
      <TextField placeholder="Otsi" defaultValue={filterBooleans.nameFilter} onChange={(e) => setValue(e.target.value)}/>
      <Button fullWidth style={styles.buttonStyle} variant="contained" onClick={() => filterValues()}>Rakenda filter</Button>
    </div>
  );
};

export default InputFilter;