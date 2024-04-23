import {MultiDirectedGraph} from "graphology";

export const handleChipDelete = (chipToDelete, setInputArray, setGraph, graph) => {
  const clieckedChipText = chipToDelete.currentTarget.parentElement.innerText;
  setInputArray((chips) => chips.filter((chip) => chip !== clieckedChipText));
  setGraph(new MultiDirectedGraph());
};