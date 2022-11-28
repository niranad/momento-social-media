import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Auth from '../../Auth/Auth.js';
import env from 'react-dotenv';
import { Provider } from 'react-redux';
import reducer from '../../../reducers/index.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createStore, applyMiddleware, compose } from 'redux';
import Thunk from 'redux-thunk';

const store = createStore(reducer, compose(applyMiddleware(Thunk)));

beforeEach(() =>
  render(
    <GoogleOAuthProvider clientId={env.CLIENT_ID}>
      <Provider store={store}>
        <Auth />
      </Provider>
    </GoogleOAuthProvider>,
  ),
);


it('renders authentication form correctly', () => {
  expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: "Don't have an account? Sign up" })).toBeInTheDocument();
  expect(screen.getByTestId('mui-password-field')).toBeInTheDocument();

  const textFields = screen.queryAllByRole('textbox');
  // only email field has textbox role
  expect(textFields).toHaveLength(1);
});

it('renders sign up form when user click sign up button', async () => {
  userEvent.click(
    screen.getByRole('button', { name: "Don't have an account? Sign up" }),
  );

  expect(await screen.findAllByRole('textbox')).toHaveLength(3);
  expect(
    screen.getByTestId('mui-confirmpassword-field'),
  ).toBeInTheDocument();
});
