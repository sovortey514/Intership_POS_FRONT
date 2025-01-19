import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function ForgotPassword() {
  const INITIAL_USER_OBJ = {
    emailId: '',
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (userObj.emailId.trim() === '') return setErrorMessage('Email Id is required! (use any value)');
    else {
      setLoading(true);
      // Call API to send password reset link
      setLoading(false);
      setLinkSent(true);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage('');
    setUserObj({ ...userObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="card w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-white">
          <div className="hidden md:block">
            <LandingIntro />
          </div>
          <div className="py-16 px-10">
            <h2 className="text-3xl font-bold mb-4 text-center">Forgot Password</h2>

            {linkSent ? (
              <>
                <div className="text-center mt-8">
                  <CheckCircleIcon className="inline-block w-24 h-24 text-green-500" />
                </div>
                <p className="my-4 text-xl font-bold text-center">Link Sent</p>
                <p className="mt-4 mb-8 font-semibold text-center">Check your email to reset your password</p>
                <div className="text-center mt-4">
                  <Link to="/login">
                    <button className="btn btn-primary w-full">Logout</button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="my-8 font-semibold text-center">We will send a password reset link to your email Id</p>
                <form onSubmit={submitForm}>
                  <div className="mb-4">
                    <InputText
                      type="email"
                      defaultValue={userObj.emailId}
                      updateType="email"
                      containerStyle="mt-4"
                      labelTitle="Email Id"
                      updateFormValue={updateFormValue}
                    />
                  </div>

                  <ErrorText styleClass="mt-4 text-red-500">{errorMessage}</ErrorText>
                  <button
                    type="submit"
                    className={`btn bg-yellow-500 w-full mt-4 text-white ${loading ? 'loading' : ''}`}
                  >
                    Send Reset Link
                  </button>

                  {/* <div className="text-center mt-4">
                    Don't have an account yet?{' '}
                    <Link to="/register">
                      <button className="inline-block text-primary hover:underline transition duration-200">
                        Register
                      </button>
                    </Link>
                  </div> */}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
