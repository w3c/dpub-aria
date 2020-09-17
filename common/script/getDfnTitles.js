function getDfnTitles(elem) {
  const titleSet = new Set();
  // data-lt-noDefault avoid using the text content of a definition
  // in the definition list.
  // ltNodefault is === "data-lt-noDefault"... someone screwed up 😖
  const normText = (elem.dataset && ("ltNodefault" in elem.dataset)) ? "" : norm(elem.textContent);
  const child = /** @type {HTMLElement | undefined} */ (elem.children[0]);
  if (elem.dataset.lt) {
    // prefer @data-lt for the list of title aliases
    elem.dataset.lt
      .split("|")
      .map(item => norm(item))
      .forEach(item => titleSet.add(item));
  } else if (
    elem.childNodes.length === 1 &&
    elem.getElementsByTagName("abbr").length === 1 &&
    child.title
  ) {
    titleSet.add(child.title);
  } else if (elem.textContent === '""') {
    titleSet.add("the-empty-string");
  }

  titleSet.add(normText);
  titleSet.delete("");

  // We could have done this with @data-lt (as the logic is same), but if
  // @data-lt was not present, we would end up using @data-local-lt as element's
  // id (in other words, we prefer textContent over @data-local-lt for dfn id)
  if (elem.dataset.localLt) {
    const localLt = elem.dataset.localLt.split("|");
    localLt.forEach(item => titleSet.add(norm(item)));
  }

  const titles = [...titleSet];
  return titles;
}

function norm(str) {
  if (str) {
    return str.trim().replace(/\s+/g, " ");
  }
}