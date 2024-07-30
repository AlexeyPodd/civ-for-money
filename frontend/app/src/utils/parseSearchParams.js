export default function parseSearchParams(searchParams) {
  const params = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
}