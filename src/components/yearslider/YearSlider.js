import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {Button, IconButton, Popover} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function valuetext(value) {
  return `${value}°C`;
}

export default function YearSlider({filterValues, setFilterValues}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeValues = () => {
    setFilterValues({...filterValues, dateMin: value[0], dateMax: value[1]});
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [value, setValue] = React.useState([filterValues.dateMin, filterValues.dateMax]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{marginLeft: "1rem"}}>
      <Button onClick={(e) => handleClick(e)} variant="contained" sx={{borderRadius: "10px", padding: "0.5em", minWidth: "30px", minHeight: "30px"}}>
        <FilterAltIcon fontSize={"medium"}/>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{display: "flex", gap: "1rem", padding: "1rem", alignItems: "center"}}>
          <Box>Aastate Vahemik: </Box>
          <Box>1990</Box>
          <Box sx={{ width: 200 }}>
            <Slider
              min={1990}
              max={2024}
              step={1}
              getAriaLabel={() => 'Temperature range'}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
            />
          </Box>
          <Box>2024</Box>
          <Button onClick={changeValues} variant="contained">Rakenda aastad</Button>
        </Box>
      </Popover>
    </div>
  );
}