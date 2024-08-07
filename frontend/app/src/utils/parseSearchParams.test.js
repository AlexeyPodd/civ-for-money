import { expect, test } from 'vitest';
import parseSearchParams from './parseSearchParams';

test("Should correctly parse params", () => {
  const searchParams = [
    ['name', 'Bob'],
    ['age', '56'],
    ['sex', 'male'],
  ];
  const expectedParams = {
    name: 'Bob',
    age: '56',
    sex: 'male',
  };

  const params = parseSearchParams(searchParams);

  expect(Object.keys(params).length).to.be.equal(Object.keys(expectedParams).length);
  for (let key in params) {
    expect(params[key]).to.be.equal(expectedParams[key]);
  }  
});