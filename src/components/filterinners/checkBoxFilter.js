import React, {useState} from 'react';
import {Button, Checkbox, FormControlLabel, FormGroup} from "@mui/material";
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
const CheckBoxFilter = ({queryAnswer, setFilteredData, filterBooleans, setFilterBooleans}) => {
  const [checkedLabels, setCheckedLabels] = useState(filterBooleans.categoryFilter);

  const handleCheckBoxChange = (event) => {
    const label = event.target.value;
    if (event.target.checked) {
      // Add label if checked
      setCheckedLabels((prev) => [...prev, label]);
    } else {
      // Remove label if unchecked
      setCheckedLabels((prev) => prev.filter((item) => item !== label));
    }
  }

  const handleSubmit = () => {
    const filterBoolCopy = {...filterBooleans};
    filterBoolCopy.categoryFilter = checkedLabels;
    setFilterBooleans(filterBoolCopy);
    nameFilter(filterBoolCopy, queryAnswer, setFilteredData);
  };

  return (
    <div style={styles.divStyle}>
      <FormGroup onChange = { handleCheckBoxChange }>
        <FormControlLabel control={<Checkbox defaultChecked={filterBooleans.categoryFilter.includes("loc")} />} value={"loc"} label="Asukoht" />
        <FormControlLabel control={<Checkbox defaultChecked={filterBooleans.categoryFilter.includes("per")} />} value={"per"} label="Isik" />
        <FormControlLabel control={<Checkbox defaultChecked={filterBooleans.categoryFilter.includes("org")} />} value={"org"} label="Organisatsioon" />
      </FormGroup>
      <Button variant="contained" onClick={handleSubmit} style={styles.buttonStyle}>Rakenda filtrid</Button>
    </div>
  );
};

export default CheckBoxFilter;