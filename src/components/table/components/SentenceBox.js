import React from "react";

export default function SentenceBox({sentenceData}) {
  return(<div className={"sentence-container loaded-container"}>
    {sentenceData.map((data) => {
      return(
        <div className={"sentence-inner"}>{data.data}</div>
      )
    })}
  </div>)
}