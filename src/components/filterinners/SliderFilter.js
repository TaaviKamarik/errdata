import React, {useState} from 'react';
import {Button, TextField} from "@mui/material";
import {nameFilter} from "../../functions/filterFunction";
import Slider from "@mui/material/Slider";

const styles = {
  divStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px',
    borderRadius: '5px'
  },
  sliderStyle: {
    flex: 1,
    width: '100%',
    minWidth: '200px',
    paddingRight: '20px',
    paddingLeft: '20px',
    paddingTop: "40px"
  },
  buttonStyle: {
    flex: '1',
  }
}

const InputFilter = ({queryAnswer, setFilteredData, filterBooleans, setFilterBooleans, filterName, attributeName}) => {
  const { smallest, largest } = queryAnswer.reduce((acc, obj) => {
    acc.smallest = obj[attributeName] < acc.smallest ? obj[attributeName] : acc.smallest;
    acc.largest = obj[attributeName] > acc.largest ? obj[attributeName] : acc.largest;
    return acc;
  }, { smallest: Infinity, largest: -Infinity });
  const initialValues = filterBooleans[filterName].length === 0 ? [smallest, largest] : filterBooleans[filterName]
  const [value, setValue] = useState(initialValues);

  const filterValues = () => {
    if (value[0] === initialValues[0] && value[1] === initialValues[1]) return
    const filterBoolCopy = {...filterBooleans};
    filterBoolCopy[filterName] = value;
    setFilterBooleans(filterBoolCopy);
    nameFilter(filterBoolCopy, queryAnswer, setFilteredData);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={styles.divStyle}>
      <div style={styles.sliderStyle}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          min={smallest}
          max={largest}
          step={1}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="on"
        />
      </div>
      <Button fullWidth style={styles.buttonStyle} variant="contained" onClick={() => filterValues()}>Rakenda filter</Button>
    </div>
  );
};

export default InputFilter;