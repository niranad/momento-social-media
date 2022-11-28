import { render, fireEvent, screen } from '@testing-library/react';
import Input from '../../Auth/Input';

it('renders input component correctly', () => {
  render(<Input type='text' autoFocus={true}/>);
  const textInput = screen.getByRole('textbox');
  expect(textInput).toBeRequired();
  expect(textInput).toHaveFocus();
})

it('calls handleChange when value changes', () => {
  const handleChange = jest.fn();
  render(<Input handleChange={handleChange} type='text' />);
  fireEvent.change(screen.getByRole('textbox'), { target: {value: 'ab'} });
  expect(handleChange).toHaveBeenCalledTimes(1);
})