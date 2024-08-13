import React, { useState } from 'react';
import Parse from 'parse/dist/parse.min.js';
import { Button, Divider, Input, message } from 'antd';
import env from "react-dotenv";
import { useNavigate } from 'react-router-dom';

Parse.initialize(env.PARSE_APPLICATION_ID, env.PARSE_JAVASCRIPT_KEY);
Parse.serverURL = env.PARSE_HOST_URL;

export const UserRegistration = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const doUserRegistration = async () => {
    const usernameValue = username;
    const passwordValue = password;
    const emailValue = email;

    if (!validateEmail(emailValue)) {
      message.error('Invalid email format.');
      return false;
    }

    if (!validatePassword(passwordValue)) {
      message.error('Password must be at least 8 characters long and include uppercase, lowercase, one special character and a number.');
      return false;
    }

    try {
      const createdUser = await Parse.User.signUp(usernameValue, passwordValue, {
        email: emailValue,
      });
      alert(`Success! User ${createdUser.getUsername()} was successfully created!`);
      navigate('/barchart')
      return true;
    } catch (error) {
      alert(`Error! ${error}`);
      return false;
    }
  };

  const client = new Parse.LiveQueryClient({
    applicationId: env.PARSE_APPLICATION_ID,
    serverURL: env.LIVE_SERVER_URL,
    javascriptKey: env.PARSE_JAVASCRIPT_KEY,
  });
  client.open();
  
  const query = new Parse.Query(Parse.User);
  query.ascending('createdAt').limit(5);
  const subscription = client.subscribe(query);

  subscription.on('create', (User) => {
    console.log('User created');
  });

  return (
    <div>
      <div className="header">
        <p className="header_text_bold">{''}</p>
        <p className="header_text">{''}</p>
      </div>
      <div className="container">
        <h2 className="heading">{'Registration'}</h2>
        <Divider />
        <div className="form_wrapper">
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            size="large"
            className="form_input"
          />
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
            onClick={doUserRegistration}
            type="primary"
            className="form_button"
            color={'#208AEC'}
            size="large"
          >
            Sign Up
          </Button>
        </div>
        <Divider />
        <p className="form__hint">
          Already have an account? <a className="form__link" href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};
