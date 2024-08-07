export default function secondsDurationToRepresentation(seconds) {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds - days * 86_400) / 3_600);
  const minutes = Math.floor((seconds - days * 86_400 - hours *3_600) / 60);

  let representationParts = [];
  if (days) representationParts.push(`${days} day(s)`);
  if (hours) representationParts.push(`${hours} hour(s)`);
  if (minutes) representationParts.push(`${minutes} minute(s)`);

  if (days || hours || minutes) return representationParts.join(', ');
  else return `${seconds} second(s)`;
}