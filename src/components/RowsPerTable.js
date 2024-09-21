import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const RowsPerTable = ({tableRows, setTableRows}) => {

  const handleChange = (event) => {
    setTableRows(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Ridu tabelis</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={tableRows}
        label="Ridu tabelis"
        onChange={handleChange}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
    </FormControl>
  );
};

export default RowsPerTable;