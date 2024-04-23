import {FC, useEffect, CSSProperties, useState} from "react";

import {SigmaContainer, useLoadGraph, useRegisterEvents, useSetSettings, useSigma} from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";
import Graph, {
  DirectedGraph,
  MultiDirectedGraph,
  MultiGraph, MultiUndirectedGraph,
  NotFoundGraphError,
  UndirectedGraph,
  UsageGraphError
} from "graphology";
import {SampleGraph} from "./SampleGraph";
import axios from "axios";
import {urlValue} from "../../constants/constants";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import forceAtlas2 from "graphology-layout-forceatlas2";
import EdgeCurveProgram, {DEFAULT_EDGE_CURVATURE, indexParallelEdgesIndex} from "@sigma/edge-curve";
import {EdgeArrowProgram} from "sigma/rendering";

const sigmaStyle = { height: "900px", width: "1600px" };
// Sigma settings
const sigmaSettings = { allowInvalidContainer: true, renderEdgeLabels: true, defaultEdgeType: "arrow", zIndex: true, edgeProgramClasses: {
    straight: EdgeArrowProgram,
    curved: EdgeCurveProgram,
  }, };

export const LoadGraph = () => {
  const [nodesInput, setNodesInput] = useState();
  const [graphInput, setGraphInput] = useState();
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [hoveredNode, setHoveredNode] = useState(null);
  const setSettings = useSetSettings();

  useEffect(() => {
    const runFetches = async () => {
      const nodes = await axios.get(urlValue + "getconnectionnames");
      const response = await axios.get(urlValue + "getallconnections")

      setNodesInput(nodes.data);
      setGraphInput(response.data);
    }
    runFetches();
  }, [])

  console.log(graphInput)

  const colors = {per: "red", org: "blue", loc: "green"}

  const randColors = [
    "#F4BFF3", // Light Pink
    "#FFED86", // Pastel Yellow
    "#B0E57C", // Pastel Green
    "#D6A9E2", // Pastel Purple
    "#A2D7DD", // Pastel Blue
    "#FFD8B1", // Pastel Orange
    "#FCE8D8", // Creamy White
    "#FFB7B2" // Soft Coral
  ];

  const loadGraph = useLoadGraph();

  useEffect(() => {
    if (!nodesInput) return;

    const graph = new MultiDirectedGraph();
    console.log(graph)


    nodesInput.forEach((node, index) => {
      console.log(node)
      graph.addNode(node.olem1_kood, { x: Math.random() * 3000, y: Math.random() * 3000, label: node.nimetus, size: Math.sqrt(node.kokku) * 2, color: randColors[Math.floor(Math.random() * 8)]
      })});

    graphInput.forEach((edge, index) => {
      if(edge.olem1_kood !== edge.olem2_kood && edge.seose_tyyp !== 'root') {
        try {graph.addDirectedEdgeWithKey(edge.id, edge.olem1_kood, edge.olem2_kood, { label: edge.siduv_sona, multi: true, zIndex: 0, seos: edge.seose_tyyp, liik: edge.siduva_sona_liik });}
        catch (err){
          if(err instanceof NotFoundGraphError){
          } else if(err instanceof UsageGraphError){
            console.log("TERE")
          }
        }
      }
    });
    // Connect the first and last nodes to make it a circular graph
    indexParallelEdgesIndex(graph, { edgeIndexAttribute: "parallelIndex", edgeMaxIndexAttribute: "parallelMaxIndex" });

    // Adapt types and curvature of parallel edges for rendering:
    graph.forEachEdge((edge, { parallelIndex, parallelMaxIndex }) => {
      if (typeof parallelIndex === "number") {
        graph.mergeEdgeAttributes(edge, {
          type: "curved",
          curvature: DEFAULT_EDGE_CURVATURE + (3 * DEFAULT_EDGE_CURVATURE * parallelIndex) / (parallelMaxIndex || 1),
        });
      } else {
        graph.setEdgeAttribute(edge, "type", "straight");
      }
    });


    loadGraph(graph);

    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
    });

  }, [loadGraph, nodesInput]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
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
          }
        }
        return newData;
      },
      edgeReducer: (edge, data, index) => {
        const graph = sigma.getGraph();
        const newData = { ...data, hidden: false };

        if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
          newData.hidden = true;
        }

        if (hoveredNode && graph.extremities(edge)[0] === hoveredNode) {
          newData.color = "green";
          newData.zIndex = 1;
          newData.size = 2;
        }

        if (hoveredNode && graph.extremities(edge)[1] === hoveredNode) {
          newData.color = "blue";
          newData.zIndex = 1;
          newData.size = 2;
        }

        return newData;
      },
    });
  }, [hoveredNode, setSettings, sigma]);
}


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

export const NetworkGraph = ({ style }) => {
  return (
    <SigmaContainer style={sigmaStyle} settings={sigmaSettings} graph={MultiDirectedGraph}>
      <LoadGraph/>
    </SigmaContainer>
  );
};