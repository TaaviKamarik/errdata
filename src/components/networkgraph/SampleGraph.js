import { FC, useEffect, useState } from "react";

import { useSigma, useRegisterEvents, useLoadGraph, useSetSettings } from "@react-sigma/core";
import { useRandom } from "./useRandom";
import {useGenerateRandomGraph} from "./useGenerateRandomGraph";

export const SampleGraph= ({ disableHoverEffect }) => {
  const { randomGraph } =  useRandom();
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  const loadGraph = useLoadGraph();
  const [hoveredNode, setHoveredNode] = useState(null);

  /**
   * When component mount
   * => load the graph
   */
  useEffect(() => {
    // Create & load the graph
    const graph = randomGraph();
    console.log("Graph is ", graph.toJSON());
    loadGraph(graph);

    // Register the events
    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
    });
  }, [loadGraph, registerEvents, randomGraph]);


  /**
   * When component mount or hovered node change
   * => Setting the sigma reducers
   */
  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
        const newData = { ...data, highlighted: data.highlighted || false };

        if (!disableHoverEffect && hoveredNode) {
          if (node === hoveredNode || graph.neighbors(hoveredNode).includes(node)) {
            newData.highlighted = true;
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

        if (!disableHoverEffect && hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
          newData.hidden = true;
        }

        if (!disableHoverEffect && hoveredNode && graph.extremities(edge).includes(hoveredNode)) {
          newData.label = "TERE"
        }

        return newData;
      },
    });
  }, [hoveredNode, setSettings, sigma, disableHoverEffect]);

  return null;
};