export default function parseLinkToGetParams() {
  const queryParams = {};
  const queryString = window.location.search.split('?')[1];
  if (queryString) {
    const pairs = queryString.split('&');
    let pair;
    for (let i = 0; i < pairs.length; i++) {
      pair = pairs[i].split('=');
      queryParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
  }
  return queryParams;
}