export const transformedObject = (dataArray) => {
  console.log(dataArray)
  return dataArray.reduce((acc, {teksti_kood, omadus, vaartus}) => {
    // Handle teksti_kood separately to ensure it's included only once
    if (!acc['teksti_kood']) {
      acc['teksti_kood'] = teksti_kood;
    }

    // Now handle the omadus and vaartus as before
    if (acc[omadus]) {
      // If it's not already an array, make it an array and add the new value
      if (!Array.isArray(acc[omadus])) {
        acc[omadus] = [acc[omadus]];
      }
      acc[omadus].push(vaartus);
    } else {
      // If it doesn't exist, simply add the key-value pair
      acc[omadus] = vaartus;
    }
    return acc;
  });
};

export const sortShowBoxArray = (array, direction, showData, setShowData) => {
  const sortedData = [...showData].sort((a, b) => {
    if(direction === "ASC"){
      return a[array] - b[array];
    } else {
      return b[array] - a[array];
    }
  })
  setShowData(sortedData);
}