export const handleScroll = (event, fetchOlem, inputValue, offset, page, peopleOptions) => {
  const listboxNode = event.currentTarget;
  if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
    // User has scrolled to the bottom of the list
    fetchOlem(inputValue, offset, page, peopleOptions);
  }
};