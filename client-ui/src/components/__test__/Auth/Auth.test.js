import { render, fireEvent, screen, waitFor, cleanup } from '@testing-library/react';
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

afterEach(cleanup);

it('renders authentication form correctly', () => {
  screen.getByTestId('auth-form');
  screen.getByRole('button', { name: 'Sign In' });
  screen.getByRole('button', { name: "Don't have an account? Sign up" });
  const textFields = screen.queryAllByRole('textbox');
  // only email field has textbox role
  expect(textFields).toHaveLength(1);
  screen.getByTestId('mui-password-field');
});

it('changes to sign up form when user click sign up button', async () => {
  fireEvent.click(
    screen.getByRole('button', { name: "Don't have an account? Sign up" }),
  );
  
  await waitFor(() => {
    // only firstName, lastName and email fields will have textbox role
    expect(screen.queryAllByRole('textbox')).toHaveLength(3);
    expect(
      screen.queryByTestId('mui-confirmpassword-field'),
    ).toBeInTheDocument();
  });
});
