import { expect, test } from 'vitest';
import secondsDurationToRepresentation from './secondsDurationToRepresentation';

test("Should return correct amount of seconds", () => {
  const seconds = 12;
  const expectedRepresentation = "12 second(s)";

  const representation = secondsDurationToRepresentation(seconds);

  expect(representation).toBe(expectedRepresentation);
});

test("Should return correct amount of minutes", () => {
  const seconds = 1_920;
  const expectedRepresentation = "32 minute(s)";

  const representation = secondsDurationToRepresentation(seconds);

  expect(representation).toBe(expectedRepresentation);
});

test("Should return correct amount of hours", () => {
  const seconds = 50_400;
  const expectedRepresentation = "14 hour(s)";

  const representation = secondsDurationToRepresentation(seconds);

  expect(representation).toBe(expectedRepresentation);
});

test("Should return correct amount of days", () => {
  const seconds = 345_600;
  const expectedRepresentation = "4 day(s)";

  const representation = secondsDurationToRepresentation(seconds);

  expect(representation).toBe(expectedRepresentation);
});

test("Should return correct amount of days, hours and minutes", () => {
  const seconds = 193_080;
  const expectedRepresentation = "2 day(s), 5 hour(s), 38 minute(s)";

  const representation = secondsDurationToRepresentation(seconds);

  expect(representation).toBe(expectedRepresentation);
});