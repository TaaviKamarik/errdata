import {urlValue} from "../../constants/constants";
import axios from "axios";
import {useCallback, useEffect, useState} from "react";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import {MultiDirectedGraph, UndirectedGraph} from "graphology";
import {useLoadGraph} from "@react-sigma/core";

export const useGenerateRandomGraph = () => {
  const [nodesInput, setNodesInput] = useState();
  const [graphInput, setGraphInput] = useState();

  useEffect(() => {
    const runFetches = async () => {
      const nodes = await axios.get(urlValue + "getconnectionnames");
      const response = await axios.get(urlValue + "getallconnections")

      setNodesInput(nodes.data);
      setGraphInput(response.data);
    }
    runFetches();
  }, [])

  console.log(nodesInput)
  console.log(graphInput)

  const colors = {per: "red", org: "blue", loc: "green"}

  const loadGraph = useLoadGraph();

  useEffect(() => {
    if (!nodesInput) return;

    const graph = new MultiDirectedGraph();

    nodesInput.forEach((node, index) => {
      graph.addNode(node.olem1_kood, { x: Math.random(), y: Math.random(), label: node.nimi, size: Math.sqrt(node.kokku) * 50, color: colors[node.tyyp]
    })});

    graphInput.forEach((edge, index) => {
      graph.addEdgeWithKey(edge.id, edge.olem1_kood, edge.olem2_kood, { label: edge.siduv_sona });
    });

    console.log(graph);
// Connect the first and last nodes to make it a circular graph

    loadGraph(graph);

  }, [loadGraph, nodesInput]);


    // Create the graph
   /* const graph = erdosRenyi(UndirectedGraph, { order: nodesInput.length, probability: 0.1 });
    graph.nodes().forEach((node, index) => {
      graph.mergeNodeAttributes(node, {
        label: nodesInput[index].nimi,
        size: Math.sqrt(nodesInput[index].kokku) * 50,
        color: colors[nodesInput[index].tyyp],
        x: Math.random(),
        y: Math.random(),
        // for node-border
        borderColor: colors[nodesInput[index].tyyp],
        // for node-image
      });
    });
    console.log(graph)*/

  return(loadGraph)
};