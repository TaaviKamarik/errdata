import {NotFoundGraphError, UsageGraphError} from "graphology";
import {DEFAULT_EDGE_CURVATURE, indexParallelEdgesIndex} from "@sigma/edge-curve";
import axios from "axios";
import {urlValue} from "../../../constants/constants";

export const buildGraph = async (nodesInput, graph, setGraph, setNoValuesReturned) => {
  let coordinateVal = {x: 0, y: 0};
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

  const runFetches = async (value) => {
    const nodes = await axios.get(urlValue + `getconnectionnamesselected?name=${value}`);
    const graphData = await axios.get(urlValue + `getallconnectionsselected?name=${value}&type=graph`);
    return {nodes: nodes.data[0], graphData: graphData.data};
  }

  const {nodes, graphData} = await runFetches(nodesInput);

  if(graphData !== "No rows") {
    if(graph.order < 1) {
      graph.addNode(nodes.olem1_kood, { x:0, y: 0, label: nodes.nimetus, size: Math.sqrt(nodes.kokku) * 5, color: randColors[Math.floor(Math.random() * 8)], highlighted: true, mainNode: true });
    } else {
      graph.updateNode(nodes.olem1_kood, attr => {return {...attr, size: Math.sqrt(nodes.kokku) * 5, mainNode: true}});
      coordinateVal = graph.getNodeAttributes(nodesInput);
      graphData.forEach((edge) => {
        if(graph.hasEdge(`${edge.olem1_kood}_${edge.siduv_sona}_${edge.olem2_kood}`)){
          graph.updateEdgeWithKey(`${edge.olem1_kood}_${edge.siduv_sona}_${edge.olem2_kood}`, edge.olem1_kood, edge.olem2_kood, attr => {return {...attr, size: 1}})
        }
      })
    }

    graphData.forEach((edge, index) => {
      const nodeKood = edge.olem2_kood === nodes.olem1_kood ? {kood: edge.olem1_kood, label: edge.olem1_nimetus} : {kood: edge.olem2_kood, label: edge.olem2_nimetus};
      try{ graph.addNode(nodeKood.kood, { x: coordinateVal.x + (Math.random() * 2 - 1), y: coordinateVal.y + (Math.random() * 2 - 1), label: nodeKood.label, size: 10, sizeGuide: 10, color: randColors[Math.floor(Math.random() * 8)], mainNode: false });
      }catch(err){
        if(err instanceof NotFoundGraphError){
        } else if(err instanceof UsageGraphError && !graph.getNodeAttribute(nodeKood.kood, 'mainNode')){
          graph.updateNode(nodeKood.kood, attr => {return {...attr, size: Math.sqrt(attr.sizeGuide) * 5, sizeGuide: attr.sizeGuide + 1}});
        }
      }
      if(!edge.siduv_sona.includes("=")) {
        try {graph.addDirectedEdgeWithKey(`${edge.olem1_kood}_${edge.siduv_sona}_${edge.olem2_kood}`, edge.olem1_kood, edge.olem2_kood, { label: edge.siduv_sona, multi: true, zIndex: 0, size: 1, seos: edge.seose_tyyp, liik: edge.siduva_sona_liik, id: edge.id });}
        catch (err){
          if(err instanceof NotFoundGraphError){
          } else if(err instanceof UsageGraphError){
            graph.updateEdgeWithKey(`${edge.olem1_kood}_${edge.siduv_sona}_${edge.olem2_kood}`, edge.olem1_kood, edge.olem2_kood, attr => {return {...attr, size: attr.size < 13 ? attr.size + 0.5 : 12}});
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

    setGraph(graph);
  } else {
    setNoValuesReturned(true);
  }
}