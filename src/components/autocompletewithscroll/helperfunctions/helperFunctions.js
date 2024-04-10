export const handleScroll = (event, fetchOlem, inputValue, offset) => {
  const listboxNode = event.currentTarget;
  if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
    // User has scrolled to the bottom of the list
    fetchOlem(inputValue, offset);
  }
};