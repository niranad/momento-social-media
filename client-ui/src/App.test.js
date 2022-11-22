import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import reducer from './reducers/index';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

let store;

beforeEach(() => {
  store = createStore(reducer, compose(applyMiddleware(thunk)));
  render(<Provider store={store}><App /></Provider>)
})
afterEach(() => {
  store = null;
  cleanup();
});

it('renders app container', () => {
  const appContainer = screen.getByTestId('app-container');
  expect(appContainer).toBeInTheDocument();
});

it('renders authentication page initially', () => {
  const authForm = screen.getByTestId('auth-form');
  expect(authForm).toBeInTheDocument();
})


