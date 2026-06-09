import { render, screen } from '@testing-library/react';
import App from './App';

test('renders survey header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Household Welfare & Benefits Survey/i);
  expect(headerElement).toBeInTheDocument();
});
