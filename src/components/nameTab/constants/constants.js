export const tableDataProps = (textCodes, filterValues) => {
  return {
    tekst: textCodes,
    limit: 1000000,
    page: filterValues.page,
    sortBy: filterValues.sortBy,
    sortOrder: filterValues.sortOrder,
    dateMin: filterValues.dateMin,
    dateMax: filterValues.dateMax
  }
}