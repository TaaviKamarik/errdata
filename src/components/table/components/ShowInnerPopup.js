import React, {useEffect, useState} from 'react';
import {Popover, Tooltip} from "@mui/material";
import '../style/showInnerPopup.css'
import axios from "axios";

const ShowInnerPopup = ({show, url, olemData, teemaVastus}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const cellRef = React.useRef();
  const id = open ? 'simple-popover' : undefined;

  /*useEffect(() => {
    const fetchRequests = async () => {
      const olemPromise = axios.get(url + "getolemcount", {
        params: {
          name: olemData,
          code: show.teksti_kood
        }
      })
      const teemaPromise = axios.get(url + "getthemecount", {
        params: {
          lemma: teemaVastus,
          code: show.teksti_kood
        }
      })
      const [olemResponse, teemaResponse] = await Promise.all([olemPromise, teemaPromise])
      setShowData({...show, olemCount: parseInt(olemResponse.data), themeCount: parseInt(teemaResponse.data)})
    }

    fetchRequests();
  }, [])*/

  const handleClose = () => {
    setAnchorEl(null);
  };

  if(typeof show.esineja === 'string'){
    show.esineja = [show.esineja];
  }

  if(typeof show.teema === 'string'){
    show.teema = [show.teema];
  }

  return (
    <div>
      <div key={show.saatenimi} ref={cellRef} onClick={(e) => setAnchorEl(e.currentTarget)} className="show sentence-inner">
        <div className="count-marks"><Tooltip title={olemData} placement={"top"}><div className="olem-bubble">{show.olemCount}</div></Tooltip> <Tooltip title={teemaVastus} placement={"top"}><div className="theme-bubble">{show.themeCount}</div></Tooltip></div>
        <div style={{padding: "0.5em"}}>{show.saatenimi}</div>
      </div>
      <Popover
        open={open}
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center',}}
        transformOrigin={{vertical: 'top', horizontal: 'center',}}
      >
        <div className="single-show">
          {show.saatenimi && <div><strong>Saate nimi:</strong> {show.saatenimi}</div>}
          {show.saatesari && <div><strong>Saatesari:</strong> {show.saatesari}</div>}
          {show.teksti_kood && <div><strong>id:</strong> {show.teksti_kood}</div>}
          {show.eetrikuupaev && <div><strong>Eetrikuupäev:</strong> {show.eetrikuupaev}</div>}
          {show.fonoteeginumber && <div><strong>Fonoteegi number:</strong> {show.fonoteeginumber}</div>}
          {show.autor && <div><strong>Autor:</strong> {show.autor}</div>}
          {show.esineja && <div><strong>Esinejad:</strong> {show.esineja.join(", ")}</div>}
          {show.teema && <div><strong>Teema:</strong> {show.teema.join(", ")}</div>}
          {show.kategooria && <div><strong>Kategooria:</strong> {show.kategooria}</div>}
          {show.kestus && <div><strong>Kestus:</strong> {show.kestus}</div>}
          {show.salvestuskoht && <div><strong>Salvestuskoht:</strong> {show.salvestuskoht}</div>}
          {show.oigused && <div><strong>Õigused:</strong> {show.oigused}</div>}
          {show.fonogrammitootja && <div><strong>Fonogrammi tootja:</strong> {show.fonogrammitootja}</div>}
          {show.helioperaator && <div><strong>Helioperaator:</strong> {show.helioperaator}</div>}
          {show.sailikunimi && <div><strong>Säiliku nimi:</strong> {show.sailikunimi}</div>}
          {show.toimetaja && <div><strong>Toimetaja:</strong> {show.toimetaja}</div>}
          {show.sisu && <div><strong>Sisu:</strong> {show.sisu}</div>}
        </div>
      </Popover>
    </div>
  );
};

export default ShowInnerPopup;