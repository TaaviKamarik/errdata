export const nameFilter = (filters, input, output) => {
  let filteredData = [...input]
  if (filters.nameFilter !== '') {
    filteredData = filteredData.filter((item) => {
      return item.nimetus.toLowerCase().includes(filters.nameFilter.toLowerCase())
    })
  }
  if (filters.categoryFilter.length > 0 && filters.categoryFilter.length < 3) {
    filteredData = filteredData.filter((item) => {
      return filters.categoryFilter.includes(item.tyyp)
    })
  }
  if (filters.totalFilter.length > 0) {
    filteredData = filteredData.filter(obj => obj.kokku <= filters.totalFilter[1] && obj.kokku >= filters.totalFilter[0]);
  }
  if (filters.sameSentFilter.length > 0) {
    filteredData = filteredData.filter(obj => obj.sama_lause_nr <= filters.sameSentFilter[1] && obj.sama_lause_nr >= filters.sameSentFilter[0]);
  }
  if (filters.differentShowFilter.length > 0) {
    filteredData = filteredData.filter(obj => obj.koodNr <= filters.differentShowFilter[1] && obj.koodNr >= filters.differentShowFilter[0]);
  }

  output(filteredData)
}

export const keywordFilter = (filters, input, output, uniquewords) => {
  let filteredData = [...input]
  if (filters.keywordFilter !== '') {
    filteredData = filteredData.filter((item) => {
      return item.lyhilemma.toLowerCase().includes(filters.keywordFilter.toLowerCase())
    })
  }
  if (filters.categoryFilter.length > 0 && filters.categoryFilter.length < uniquewords.length) {
    filteredData = filteredData.filter((item) => {
      return filters.categoryFilter.some((filter) => item.marksonad.includes(filter));
    })
  }
  if (filters.maxSmFilter.length > 0) {
    filteredData = filteredData.filter(obj => obj.suurim_sm <= filters.maxSmFilter[1] && obj.suurim_sm >= filters.maxSmFilter[0]);
  }
  if (filters.avgSmFilter.length > 0) {
    filteredData = filteredData.filter(obj => obj.keskmine_sm <= filters.avgSmFilter[1] && obj.keskmine_sm >= filters.avgSmFilter[0]);
  }
  if (filters.totalFilter.length > 0) {
    filteredData = filteredData.filter(obj => obj.total <= filters.totalFilter[1] && obj.total >= filters.totalFilter[0]);
  }
  if (filters.differentShowFilter.length > 0) {
    filteredData = filteredData.filter(obj => obj.koodNr <= filters.differentShowFilter[1] && obj.koodNr >= filters.differentShowFilter[0]);
  }

  output(filteredData)
}

