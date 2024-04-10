export const tableDataProps = (textCodes, dateQueryValue) => {
  return {
    tekst: textCodes,
    limit: 20,
    page: 1,
    sortBy: "kokku",
    sortOrder: "DESC",
    dateMin: dateQueryValue[0],
    dateMax: dateQueryValue[1]
  }
}