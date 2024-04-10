import React, {Suspense, useEffect, useState} from 'react';
import '../style/trendCell.css'
import axios from "axios";
import {AreaPlot, ChartContainer, LineChart} from "@mui/x-charts";
import {Box, CircularProgress, Popover, Popper, styled, Tooltip, Typography} from "@mui/material"
import {urlValue} from "../../../constants/constants";

const ChartsTooltipRoot = styled(Popper, {
  name: "MuiChartsTooltip",
  slot: "Root",
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  zIndex: theme.zIndex.modal,
}));

const TrendWindow = ({textCode, years, chartData}) => {
  const [trendData, setTrendData] = useState();
  const trendPopper = React.useRef();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [trendProps, setTrendProps] = React.useState(null);

  useEffect(() => {
    axios.post(urlValue + "gettrend", {
        tekst: textCode,
    }).then((response) => {
      setTrendData(response.data)
    })

  }, [textCode]);

  const CustomTooltip = (props) => {

    return (
      <ChartsTooltipRoot
        open={true}
        {...props}
        anchorEl={trendPopper.current}
        placement={"bottom"}
      >
        <Box className={"trend-tooltip"}>
          <h4 style={{position: "absolute", background: "white", top: "-50px", height: "2.5em", width: "auto", padding: "0.5em", border: "1px solid #e5e5e5", borderRadius: "5px"}}>{props.children.props.axisData.x.value}</h4>
          {trendData && trendData.map((data) => {
            const kuupaev = data.kuupaev.split("-")[2] + "." + data.kuupaev.split("-")[1] + "." + data.kuupaev.split("-")[0];
            if(data.kuupaev.slice(0, 4) === (props.children.props.axisData.x.value).toString()){
              return(
                <div className="single-trend-tooltip">
                  <Typography>{data.vaartus} <Box component="span" sx={{fontSize: "0.7em", color:"gray"}}>({kuupaev})</Box></Typography>
                </div>
              )
            }}
          )}
        </Box>
      </ChartsTooltipRoot>
    );
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return(
    <div>
      <LineChart
        ref={trendPopper}
        width={700}
        height={300}
        axisHighlight={{x: 'line', y: 'none'}}
        series={[{ data: chartData, label: 'saateid', area: true, showMark: false, color: "#007FFF" }]}
        xAxis={[{data: years, label: 'aasta', tickMinStep: 1}]}
        yAxis={[{tickMinStep: 1, label: 'saateid'}]}
        sx={{
          '.MuiLineElement-root': {
            display: 'none',
          },
        }}
        slots={{popper: CustomTooltip}}
      >
      </LineChart>
      <Popper
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
TERE
      </Popper>
    </div>
  )
}

const TrendCell = ({data, dateValue}) => {
  const shows = data.split(",");
  const [years, setYears] = useState([])
  const [chartData, setChartData] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);

  const fillYearArray = () => {
    let tempArray = [];
    for(let i = dateValue[0]; i <= dateValue[1]; i++){
      tempArray.push(i)
    }
    return tempArray;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  useEffect(() => {
    const tempYears = fillYearArray();
    axios.post(urlValue + "getnimetrend", {
      tekst: shows,
    }).then((response) => {
      let tempArray = [];
      tempYears.forEach((year) => {
        if(response.data !== "No rows"){
          let index = response.data.findIndex((element) => element.year === year);
          if(index === -1){
            tempArray.push(0)
          } else {
            tempArray.push(parseInt(response.data[index].kokku))
          }
        }
      })
      setYears(tempYears);
      setChartData(tempArray);
    })
  }, [data, dateValue])

  return (
    <div>
      <div onClick={handleClick} style={{height: "30px", display: "flex", alignItems: "center", cursor: "pointer"}}>
        {chartData.length === 0
          ?
          <CircularProgress size={10} color="primary" />
          :
          <div>
            <ChartContainer
              width={200}
              height={40}
              margin={{ top: 5, right: 0, bottom: 0, left: 5 }}
              series={[
                {
                  data: chartData,
                  type: 'line',
                  area: true,
                  color: "#007FFF"
                },
              ]}
              xAxis={[{ scaleType: 'point', data: years }]}
              yAxis={[{tickMinStep: 1}]}
            >
              <AreaPlot />
            </ChartContainer>
          </div>
        }
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <TrendWindow textCode={shows} years={years} chartData={chartData}/>
      </Popover>
    </div>
  );
};

export default TrendCell;