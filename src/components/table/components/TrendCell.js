import React, {useEffect, useState} from 'react';
import '../style/trendCell.css'
import axios from "axios";
import {AreaPlot, ChartContainer, LineChart} from "@mui/x-charts";
import {Box, CircularProgress, Popover, Popper, styled, Tooltip, Typography} from "@mui/material"
import {urlValue} from "../../../constants/constants";
import getShowData from "../queries/getShowData";

const ChartsTooltipRoot = styled(Popper, {
  name: "MuiChartsTooltip",
  slot: "Root",
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  zIndex: theme.zIndex.modal,
}));

const TrendWindow = ({data, years, chartData}) => {
  const [trendData, setTrendData] = useState();
  const trendPopper = React.useRef();
  const [showData, setShowData] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [axisYear, setAxisYear] = React.useState(null);

  console.log(data.lyhilemma)
  useEffect(() => {
    axios.post(urlValue + "gettrend", {
        tekst: data.codeandyear.map(item => item.tekstikood),
    }).then((response) => {
      setTrendData(response.data)
    })

  }, [data]);

  const CustomTooltip = (props) => {
    setAxisYear(props.children.props.axisData.x.value);

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

  const callClick = (d) => {
    console.log(d)
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
      />
      <div>
        <Box className={"trend-tooltip"} style={{cursor: "pointer"}}>
          <h4 style={{position: "absolute", background: "white", top: "-50px", height: "2.5em", width: "auto", padding: "0.5em", border: "1px solid #e5e5e5", borderRadius: "5px"}}>{axisYear}</h4>
          {trendData && trendData.map((data) => {
            const kuupaev = data.kuupaev.split("-")[2] + "." + data.kuupaev.split("-")[1] + "." + data.kuupaev.split("-")[0];
            if(axisYear && data.kuupaev.slice(0, 4) === (axisYear).toString()){
              return(
                <div className="single-trend-tooltip" onClick={(e) => {
                  getShowData([data.teksti_kood], setShowData);
                  setAnchorEl(e.currentTarget)}
                }>
                  <Typography>{data.vaartus} <Box component="span" sx={{fontSize: "0.7em", color:"gray"}}>({kuupaev})</Box></Typography>
                </div>
              )
            }}
          )}
        </Box>
        {showData && <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center',}}
          transformOrigin={{vertical: 'top', horizontal: 'center',}}
        >
          <div className="single-show">
            {showData[0].saatenimi && <div><strong>Saate nimi:</strong> {showData[0].saatenimi}</div>}
            {showData[0].saatesari && <div><strong>Saatesari:</strong> {showData[0].saatesari}</div>}
            {showData[0].teksti_kood && <div><strong>id:</strong> {showData[0].teksti_kood}</div>}
            {showData[0].eetrikuupaev && <div><strong>Eetrikuupäev:</strong> {showData[0].eetrikuupaev}</div>}
            {showData[0].fonoteeginumber && <div><strong>Fonoteegi number:</strong> {showData[0].fonoteeginumber}</div>}
            {showData[0].autor && <div><strong>Autor:</strong> {showData[0].autor}</div>}
            {showData[0].esineja && <div><strong>Esinejad:</strong> {showData[0].esineja.join(", ")}</div>}
            {showData[0].teema && <div><strong>Teema:</strong> {showData[0].teema.join(", ")}</div>}
            {showData[0].kategooria && <div><strong>Kategooria:</strong> {showData[0].kategooria}</div>}
            {showData[0].kestus && <div><strong>Kestus:</strong> {showData[0].kestus}</div>}
            {showData[0].salvestuskoht && <div><strong>Salvestuskoht:</strong> {showData[0].salvestuskoht}</div>}
            {showData[0].oigused && <div><strong>Õigused:</strong> {showData[0].oigused}</div>}
            {showData[0].fonogrammitootja && <div><strong>Fonogrammi tootja:</strong> {showData[0].fonogrammitootja}</div>}
            {showData[0].helioperaator && <div><strong>Helioperaator:</strong> {showData[0].helioperaator}</div>}
            {showData[0].sailikunimi && <div><strong>Säiliku nimi:</strong> {showData[0].sailikunimi}</div>}
            {showData[0].toimetaja && <div><strong>Toimetaja:</strong> {showData[0].toimetaja}</div>}
            {showData[0].sisu && <div><strong>Sisu:</strong> {showData[0].sisu}</div>}
          </div>
        </Popover>}
      </div>
    </div>
  )
}

const fillYearArray = (filterValues) => {
  let tempArray = {};
  for(let i = filterValues.dateMin; i <= filterValues.dateMax; i++){
    tempArray[parseInt(i)] = 0
  }
  return tempArray;
}

const TrendCell = ({data, filterValues}) => {
  const years = fillYearArray(filterValues)
  const [chartData, setChartData] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);

  console.log(data.lyhilemma)
  useEffect(() => {
    data.codeandyear.forEach((show, index) => {
      years[show.year] += 1;
    })
    setChartData(Object.values(years));
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

  console.log(chartData)

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
              xAxis={[{ scaleType: 'point', data: Object.keys(years)}]}
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
        <TrendWindow data={data} years={Object.keys(years)} chartData={chartData}/>
      </Popover>
    </div>
  );
};

export default TrendCell;