import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

export default function YearSlider({setDateQueryValue}) {
  const [value, setValue] = React.useState([2000, 2023]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
    </Box>

  );
}