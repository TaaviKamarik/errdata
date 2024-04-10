export const handleEnterPress = (e, setTabInputArray, tabInputArray, setAddFilterIsOpen) => {
  if (e.key === "Enter") {
    setTabInputArray([...tabInputArray, e.target.value.split(" ")])
    setAddFilterIsOpen(false);
  }
}