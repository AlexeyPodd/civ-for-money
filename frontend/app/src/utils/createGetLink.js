export default function createGetLink(baseURL, params = {}) {
  // Constructing URL with parameters
  let url = new URL(baseURL);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  return url.toString();
}
