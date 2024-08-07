import { expect, test } from 'vitest';
import createGetLink from "./createGetLink";

test('Should create correct link', () => {
  const baseURL = 'https://google.com';
  const params = {
    name: 'Bob',
    age: '56',
    sex: 'male',
  };
  const expectedURL = 'https://google.com/?name=Bob&age=56&sex=male';

  const URL = createGetLink(baseURL, params);

  expect(URL).to.be.equal(expectedURL);
});