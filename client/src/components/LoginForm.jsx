// see SignupForm.js for comments
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
  // Set initial form state
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  // Set state for form validation
  const [validated, setValidated] = useState(false);
  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  // Use useMutation hook to execute LOGIN_USER mutation
  const [loginUser] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Check if form is valid
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Execute the LOGIN_USER mutation
      const { data } = await loginUser({
        variables: { ...userFormData },
      });

      // Ensure the data contains the expected structure
      if (data && data.login) {
        const { token } = data.login;

        // Log user in
        Auth.login(token);

        // Clear form data
        setUserFormData({
          email: '',
          password: '',
        });

        setValidated(true);
      } else {
        throw new Error('Unexpected response structure from mutation');
      }
    } catch (err) {
      console.error('Error during login:', err.message);
      setShowAlert(true);
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            id='email'
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            id='password'
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
