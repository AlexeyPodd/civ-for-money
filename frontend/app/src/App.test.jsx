import { render } from '@testing-library/react';
import DuelMastersApp from './App';

test("Should render without crashing", () => {
  render(<DuelMastersApp />);
});