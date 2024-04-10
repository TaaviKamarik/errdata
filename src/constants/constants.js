import {styled, Switch} from "@mui/material";

export const iconButtonStyle = {
  width: "2.5rem",
  height: "2.5rem",
  fontSize: "2rem",
  '&:hover': {
    background: "none",
    color: "#004792"
  },
  '&:focus': {
    color: "#004792"
  }
}

export const tableLoadCircularProgress = {
  width: "50vw",
  height: "500px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

export const addFilterButton = {
  borderRadius: "10px",
  padding: "0.5em",
  minWidth: "30px",
  minHeight: "30px"
}

export const sliderStyle = {
  width: "20vw",
  marginLeft: "1rem"
}

export const sliderMarks = [
  {
    value: 1900,
    label: '1900',
  },
  {
    value: 2023,
    label: '2023',
  },
]

export const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 90,
  height: 55,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 60,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(35px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 51,
    height: 51,
    borderRadius: "50%",
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 55/ 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? '#17dc77' : '#12a765',
    boxSizing: 'border-box',
  },
}));

export const urlValue = "https://dti.tlu.ee/errlinked/api/src/"

export const sorterValues = [
  {key: "olemCount", order: "ASC", text: "Olemi järgi kasvavalt"},
  {key: "olemCount", order: "DESC", text: "Olemi järgi kahanevalt"},
  {key: "themeCount", order: "ASC", text: "Märksõna järgi kasvavalt"},
  {key: "themeCount", order: "DESC", text: "Märksõna järgi kahanevalt"}
]

export const tabValues = {
  urlProp: {name: "getnimednimedest", keyword: "getnimedmarksonadest"},
  titleSelection: {nameTab: "Valitud nimed:", keywordTab: "Valitud märksõnad:"},
}