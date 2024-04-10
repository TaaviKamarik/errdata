import {Skeleton} from "@mui/material";
import React from "react";

export default function SentenceSkeleton() {
  return(
    <div className={"sentence-container loading-container"}>
      {[...Array(7)].map((e, i) => {
        return(
          <Skeleton variant="rounded" width={"100%"} height={60} key={i}/>
        )
      })}
    </div>
  )
}