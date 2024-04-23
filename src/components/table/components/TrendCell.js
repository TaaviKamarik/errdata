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
        xAxis={[{data: years, label: 'aasta', tickMinStep: 1, valueFormatter: (v) => `${v}`}]}
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

const fillYearArray = (filterValues) => {
  let tempArray = [];
  for(let i = filterValues.dateMin; i <= filterValues.dateMax; i++){
    tempArray.push(parseInt(i))
  }
  return tempArray;
}

const TrendCell = ({data, filterValues}) => {
  const [years, setYears] = useState(fillYearArray(filterValues))
  const [chartData, setChartData] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    const valuesArray = []
    const showArray = new Array(years.length).fill(0);
    data.years.forEach((show, index) => {
      valuesArray.push({code: data.tekstikood[index], year: parseInt(show)})
    })

    years.forEach((year, index) => {
      showArray[index] = valuesArray.filter((value) => value.year === year).length
    })

    setChartData(showArray);
  }, [data])
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  useEffect(() => {
    /*axios.post(urlValue + "getnimetrend", {
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
    })*/
  }, [])

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
              xAxis={[{ scaleType: 'point', data: years}]}
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
        <TrendWindow textCode={data.tekstikood} years={years} chartData={chartData}/>
      </Popover>
    </div>
  );
};

export default TrendCell;