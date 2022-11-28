import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import reducer from './reducers/index';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

const store = createStore(reducer, compose(applyMiddleware(thunk)));

beforeEach(() => {
  render(<Provider store={store}><App /></Provider>)
})
afterEach(cleanup);

it('renders app without crashing', () => {
  expect(screen.getByTestId('app-container')).toBeInTheDocument();
});

it('renders authentication page initially', () => {
  expect(screen.getByTestId('auth-form')).toBeInTheDocument();
})

