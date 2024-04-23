import React, {useEffect, useState} from 'react';
import {Pagination, Stack} from "@mui/material";
import axios from "axios";
import {urlValue} from "../../../constants/constants";

const NameTablePagination = ({handlePageChange, page, queryValue, tableRows, olemKoodid, teemaVastus, filterValues}) => {

/*
  useEffect(() => {
    const handlePaginationQuery = () => {
      if(olemKoodid.length === 0 || teemaVastus.length === 0) return;
      axios.post(urlValue + "tablepagination", {
        tekst: olemKoodid,
        teema: teemaVastus,
        dateMin: filterValues.dateMin,
        dateMax: filterValues.dateMax,
      }).then((response) => {setQueryAnswer(response.data)})
    }
    handlePaginationQuery();
  }, [teemaVastus, olemKoodid, filterValues])*/

  return (
    <section className="table-pagination">
      <Stack spacing={2}>
        <Pagination count={Math.floor(queryValue.length / 20)} page={page} onChange={handlePageChange} showFirstButton showLastButton color="primary" />
      </Stack>
    </section>
  );
};

export default NameTablePagination;