import React, {useEffect, useState} from 'react';
import {Pagination, Stack} from "@mui/material";
import axios from "axios";

const TablePagination = ({handlePageChange, page, tableRows, olemKoodid, teemaVastus, url, dateValue}) => {

  const [queryAnswer, setQueryAnswer] = useState(0);

  useEffect(() => {
    const handlePaginationQuery = () => {
      if(olemKoodid.length === 0 || teemaVastus.length === 0) return;
      axios.post(url + "tablepagination", {
        tekst: olemKoodid,
        teema: teemaVastus,
        dateMin: dateValue[0],
        dateMax: dateValue[1],
      }).then((response) => {setQueryAnswer(response.data)})
    }
    handlePaginationQuery();
  }, [teemaVastus, olemKoodid, dateValue])

  return (
    <section className="table-pagination">
      <Stack spacing={2}>
        <Pagination count={Math.ceil(queryAnswer.kokku / tableRows)} page={page} onChange={handlePageChange} showFirstButton showLastButton color="primary" />
      </Stack>
    </section>
  );
};

export default TablePagination;