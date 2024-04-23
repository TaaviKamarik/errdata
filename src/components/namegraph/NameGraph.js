import React, {FC, useEffect, CSSProperties, useState} from "react";

import {SigmaContainer, useLoadGraph, useRegisterEvents, useSetSettings, useSigma} from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";
import {
  MultiDirectedGraph,
  NotFoundGraphError,
  UsageGraphError
} from "graphology";
import axios from "axios";
import {addFilterButton, tabValues, urlValue} from "../../constants/constants";
import EdgeCurveProgram, {DEFAULT_EDGE_CURVATURE, indexParallelEdgesIndex} from "@sigma/edge-curve";
import {EdgeArrowProgram} from "sigma/rendering";
import {Button, Chip, Popover, TextField, Tooltip} from "@mui/material";
import './style/nameGraph.css'
import GraphShowList from "./GraphShowList";
import sigma from "sigma";
import {buildGraph} from "./helperfunctions/buildGraph";
import {handleChipDelete} from "../helperfunctions/helperFunctions";
import AutoCompleteWithScroll from "../autocompletewithscroll/AutoCompleteWithScroll";
import {handleEnterPress} from "../nameTab/helperfunctions/helperFunctions";
import AddIcon from "@mui/icons-material/Add";

const sigmaStyle = { height: "800px", width: "1600px", border: "1px solid #000", margin: "auto auto"};
// Sigma settings
const sigmaSettings = { allowInvalidContainer: true, renderEdgeLabels: true, defaultEdgeType: "arrow", zIndex: true, edgeProgramClasses: {
    straight: EdgeArrowProgram,
    curved: EdgeCurveProgram,
  } };

const GraphSettings = ({hoveredNode, graph, inputArray}) => {
  const setSettings = useSetSettings();
  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const newData = { ...data, highlighted: data.highlighted || false };

        if (hoveredNode) {
          if (node === hoveredNode ) {
            newData.highlighted = true;
            newData.color = "green";
          } else if (graph.neighbors(hoveredNode).includes(node)) {
            newData.highlighted = true;
            newData.color = "blue";
          } else {
            newData.color = "#E2E2E2";
            newData.highlighted = false;
            newData.label = "";
            newData.hidden = true;
          }
        }
        return newData;
      },
      edgeReducer: (edge, data, index) => {
        const newData = { ...data, hidden: false };

        if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
          newData.hidden = true;
        }

        if (hoveredNode && graph.extremities(edge)[0] === hoveredNode) {
          newData.color = "green";
          newData.zIndex = 1;
        }

        if (hoveredNode && graph.extremities(edge)[1] === hoveredNode) {
          newData.color = "blue";
          newData.zIndex = 1;
        }

        return newData;
      },
    });
  }, [hoveredNode, setSettings, graph, inputArray]);
}

const GraphEvents = ({setOpen, setAnchorPosition, fetchNameConnectionMetadata, setHoveredNode, setGraph, loadGraph, graph, setNoValuesReturned}) => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState(null);
  const [startX, setStartX] = useState();
  const [startY, setStartY] = useState();

  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        const X = sigma.getGraph().getNodeAttribute(e.node, "x")
        const Y = sigma.getGraph().getNodeAttribute(e.node, "y")
        setStartX(X);
        setStartY(Y);
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
      },
      // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
      mousemovebody: (e) => {
        if (!draggedNode) return;
        // Get new position of node
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

        // Prevent sigma to move camera:
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      // On mouse up, we reset the autoscale and the dragging mode
      mouseup: (event) => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
          event.preventSigmaDefault();
        }
      },
      // Disable the autoscale at the first down interaction
      mousedown: (event) => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
        event.preventSigmaDefault();
      },
      clickNode: (event) => {
        const newX = sigma.getGraph().getNodeAttribute(event.node, "x");
        const newY = sigma.getGraph().getNodeAttribute(event.node, "y");
        if(newX === startX && newY === startY){
          let clickTimeOut = 300;
          let timeoutId = null;
          document.addEventListener("dblclick", handleDoubleClick);
          document.addEventListener("click",    handleSingleClick);

          const clickHandler = (e) => {
            document.removeEventListener("dblclick", handleDoubleClick);
            document.removeEventListener("click",    handleSingleClick);
            setOpen(true)
            const edges = sigma.getGraph().edges(event.node);
            const idArray = [];
            edges.forEach(edge => {
              idArray.push(sigma.getGraph().getEdgeAttribute(edge, 'id'));
            });
            fetchNameConnectionMetadata(idArray);
            setAnchorPosition({ top: event.event.y + 50, left: event.event.x + 150 });
          }

          function handleSingleClick(e){
            clearTimeout(timeoutId);
            timeoutId = setTimeout( function() { clickHandler(e);}, clickTimeOut);
          }

          function handleDoubleClick(e){
            clearTimeout(timeoutId);
            document.removeEventListener("dblclick", handleDoubleClick);
            document.removeEventListener("click",    handleSingleClick);
            return;
          }
        }
      },
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
      rightClickNode: (event) => {
      },
      doubleClickNode: (event) => {
        buildGraph(event.node, graph, setGraph, setNoValuesReturned);
      },
    });
  }, [registerEvents, sigma, draggedNode, graph]);

  return null;
};



// Create the Component that listen to all events
/*const GraphEvents = () => {

  const registerEvents = useRegisterEvents();

  useEffect(() => {
    console.log("register events");
    // Register the events
    registerEvents({
      // node events
      clickNode: (event) => console.log("clickNode", event.event, event.node, event.preventSigmaDefault),
      doubleClickNode: (event) => console.log("doubleClickNode", event.event, event.node, event.preventSigmaDefault),
      rightClickNode: (event) => console.log("rightClickNode", event.event, event.node, event.preventSigmaDefault),
      wheelNode: (event) => console.log("wheelNode", event.event, event.node, event.preventSigmaDefault),
      downNode: (event) => console.log("downNode", event.event, event.node, event.preventSigmaDefault),
      enterNode: (event) => console.log("enterNode", event.node),
      leaveNode: (event) => console.log("leaveNode", event.node),
      // edge events
      clickEdge: (event) => console.log("clickEdge", event.event, event.edge, event.preventSigmaDefault),
      doubleClickEdge: (event) => console.log("doubleClickEdge", event.event, event.edge, event.preventSigmaDefault),
      rightClickEdge: (event) => console.log("rightClickEdge", event.event, event.edge, event.preventSigmaDefault),
      wheelEdge: (event) => console.log("wheelEdge", event.event, event.edge, event.preventSigmaDefault),
      downEdge: (event) => console.log("downEdge", event.event, event.edge, event.preventSigmaDefault),
      enterEdge: (event) => console.log("enterEdge", event.edge),
      leaveEdge: (event) => console.log("leaveEdge", event.edge),
      // stage events
      clickStage: (event) => console.log("clickStage", event.event, event.preventSigmaDefault),
      doubleClickStage: (event) => console.log("doubleClickStage", event.event, event.preventSigmaDefault),
      rightClickStage: (event) => console.log("rightClickStage", event.event, event.preventSigmaDefault),
      wheelStage: (event) => console.log("wheelStage", event.event, event.preventSigmaDefault),
      downStage: (event) => console.log("downStage", event.event, event.preventSigmaDefault),
      // default mouse events
      click: (event) => console.log("click", event.x, event.y),
      doubleClick: (event) => console.log("doubleClick", event.x, event.y),
      wheel: (event) => console.log("wheel", event.x, event.y, event.delta),
      rightClick: (event) => console.log("rightClick", event.x, event.y),
      mouseup: (event) => console.log("mouseup", event.x, event.y),
      mousedown: (event) => console.log("mousedown", event.x, event.y),
      mousemove: (event) => console.log("mousemove", event.x, event.y),
      // default touch events
      touchup: (event) => console.log("touchup", event.touches),
      touchdown: (event) => console.log("touchdown", event.touches),
      touchmove: (event) => console.log("touchmove", event.touches),
      // sigma kill
      kill: () => console.log("kill"),
      resize: () => console.log("resize"),
      beforeRender: () => console.log("beforeRender"),
      afterRender: () => console.log("afterRender"),
      // sigma camera update
      updated: (event) => console.log("updated", event.x, event.y, event.angle, event.ratio),
    });
  }, [registerEvents]);

  return null;
};*/

export const NameGraph = ({ inputArray, graph, setGraph, setInputArray }) => {
  console.log("rerendering")
  const [olemKood, setOlemKood] = useState()
  const [noValuesReturned, setNoValuesReturned] = useState(false)
  const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: -1000 });
  const [open, setOpen] = useState(null);
  const [showData, setShowData] = useState();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [addFilterIsOpen, setAddFilterIsOpen] = useState(false);


  const getOlemKood = async() => {
    console.log(graph)
    const response = await axios.get(urlValue + `getolemkood?name=${inputArray[0]}`);
    setOlemKood(response.data[0].kood);
    buildGraph(response.data[0].kood, graph, setGraph, setNoValuesReturned);
  }



  const fetchNameConnectionMetadata = (idArray) => {
    axios.post(urlValue + 'getnameconnectionmetadata', {id: idArray}).then(response => {
      setShowData(response.data);
    })
  }

  const handleClose = () => {
    setShowData(null);
    setOpen(null);
    setAnchorPosition({ top: 0, left: -1000 })
  };

  useEffect(() => {
    getOlemKood();
    setNoValuesReturned(false);
  }, [])

  console.log(olemKood)
  console.log(inputArray[0])

  return (
    <div>
      {noValuesReturned && <h1>Valitud nimel puuduvad seosed.</h1>}
      {olemKood && !noValuesReturned &&
        <SigmaContainer style={sigmaStyle} settings={sigmaSettings} graph={graph}>
          <GraphEvents
            setAnchorPosition={setAnchorPosition}
            setOpen={setOpen}
            fetchNameConnectionMetadata={fetchNameConnectionMetadata}
            setHoveredNode={setHoveredNode}
            graph={graph}
            setGraph={setGraph}
            setNoValuesReturned={setNoValuesReturned}
          />
          <GraphSettings hoveredNode={hoveredNode} graph={graph} inputArray={inputArray}/>
      </SigmaContainer>}
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        {open && showData && <GraphShowList showData={showData} />}
      </Popover>
    </div>
  );
};