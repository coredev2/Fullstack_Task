import React, { useState, useEffect } from 'react';
import Parse from 'parse/dist/parse.min.js';
import { Button, Divider, Input, message } from 'antd';
import env from "react-dotenv";


Parse.initialize(env.PARSE_APPLICATION_ID, env.PARSE_JAVASCRIPT_KEY);
Parse.serverURL = env.PARSE_HOST_URL;

export const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const doUserLogIn = async () => {
    const emailValue = email;
    const passwordValue = password;

    if (!validateEmail(emailValue)) {
      message.error('Invalid email format.');
      return false;
    }

    if (!validatePassword(passwordValue)) {
      message.error('Password must be at least 8 characters long and include uppercase, lowercase, and a number.');
      return false;
    }

    try {
      const loggedInUser = await Parse.User.logIn(emailValue, passwordValue);
      message.success(`Success! User ${loggedInUser.get('username')} has successfully signed in!`);
      const currentUser = await Parse.User.current();
      console.log(loggedInUser === currentUser);
      setEmail('');
      setPassword('');
      getCurrentUser();
      return true;
    } catch (error) {
      message.error(`Error! ${error.message}`);
      return false;
    }
  };

  const doUserLogOut = async () => {
    try {
      await Parse.User.logOut();
      const currentUser = await Parse.User.current();
      if (currentUser === null) {
        message.success('Success! No user is logged in anymore!');
      }
      getCurrentUser();
      return true;
    } catch (error) {
      message.error(`Error! ${error.message}`);
      return false;
    }
  };

  const getCurrentUser = async () => {
    const currentUser = await Parse.User.current();
    setCurrentUser(currentUser);
    return currentUser;
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div>
      <div className="header">
        <p className="header_text_bold">{''}</p>
        <p className="header_text">{''}</p>
      </div>
      {currentUser === null && (
        <div className="container">
          <h2 className="heading">{'Login'}</h2>
          <Divider />
          <div className="form_wrapper">
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              size="large"
              className="form_input"
              type="email"
            />
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              size="large"
              type="password"
              className="form_input"
            />
          </div>
          <div className="form_buttons">
            <Button
              onClick={doUserLogIn}
              type="primary"
              className="form_button"
              color={'#208AEC'}
              size="large"
              block
            >
              Log In
            </Button>
          </div>
          <Divider />
          <p className="form__hint">Don't have an account? <a className="form__link" href="/sign-up">Sign up</a></p>
        </div>
      )}
      {currentUser !== null && (
        <div className="container">
          <h2 className="heading">{'User Screen'}</h2>
          <Divider />
          <h2 className="heading">{`Hello ${currentUser.get('username')}!`}</h2>
          <div className="form_buttons">
            <Button
              onClick={doUserLogOut}
              type="primary"
              className="form_button"
              color={'#208AEC'}
              size="large"
            >
              Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
