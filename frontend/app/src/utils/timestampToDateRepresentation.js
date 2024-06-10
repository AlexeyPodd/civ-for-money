export default function timestampToDateRepresentation(timestamp) {
  const date = new Date(timestamp);
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return date.toLocaleDateString(undefined, options)
    + " " + date.toLocaleTimeString()
}