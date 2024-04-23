import React from 'react';

const GraphShowList = ({showData}) => {
  const showList = [];
  console.log(showData)
  return (
    <div className="graph-shows">
      {showData.map((data, index) => {
        if(!showList.includes(data.lause_kood)){
          data.lause = data.lause[0].toUpperCase() + data.lause.substring(1);
          showList.push(data.lause_kood);
          return (
            <>
              <div className="graph-show-single" key={index}>
                <span className="graph-show-title">{data.olem1_nimetus} - {data.siduv_sona} - {data.olem2_nimetus}</span>
                <div className="graph-show-lause">{data.lause.replace(/ ([.,!?])/g, "$1")}</div>
              </div>
              <hr/>
            </>)
        }
      })}
    </div>
  );
};

export default GraphShowList;