import { expect, test } from 'vitest';
import timestampToDateRepresentation from './timestampToDateRepresentation';

test("Should correctly represent timestamp", () => {
  const timestamp = 1276345293000;
  const expectedRepresentation = "сб, 12 июня 2010 г. 15:21:33";

  const representation = timestampToDateRepresentation(timestamp);

  expect(representation).toBe(expectedRepresentation);
});