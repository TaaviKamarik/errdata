import React, {useState} from 'react';
import {IconButton, Popover} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const FilterPopUp = ({filterElement, queryAnswer, setfFilteredData}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const togglePopper = (event) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <div>
      <IconButton className={"same-sentence-click"} onClick={(e) => togglePopper(e)}><FilterAltIcon/></IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {filterElement}
      </Popover>
    </div>
  );
};

export default FilterPopUp;