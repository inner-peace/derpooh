import React, {useCallback, useEffect, useState} from 'react';
import './App.css';

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
}

const BACKEND_URL = 'http://localhost:3001/api/';

function App(): JSX.Element {
    const [emailQuery, setEmailQuery] = useState('')
    const [passwordQuery, setPasswordQuery] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [authToken, setAuthToken] = useState<string | null>(null)

    const onEmailChange = useCallback(async (e: React.FormEvent<HTMLInputElement>) => {
        const email = e.currentTarget.value;
        setEmailQuery(email);

        try {
            const response = await fetch(`${BACKEND_URL}validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            });
            const {status} = await response.json();
            if (!status) {
                setErrorMessage('Wrong email');
            }
        } catch (e) {
            setErrorMessage(e.message);
        }
    }, []);

    const onPassChange = useCallback((e: React.FormEvent<HTMLInputElement>): void => {
        setPasswordQuery(e.currentTarget.value);
    }, []);

    const onSignIn = useCallback(async () => {
        try {
            const response = await fetch(`${BACKEND_URL}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailQuery,
                    password: passwordQuery,
                })
            });
            const {status, token} = await response.json();
            if (status) {
                setErrorMessage('');
                setAuthToken(token);
            } else {
                setErrorMessage('Wrong email or pass');
            }

        } catch (e) {
            setErrorMessage(e.message);
        }
    }, [emailQuery, passwordQuery]);

    const onSignOut = useCallback(() => {
        setAuthToken(null);
    }, []);

    useEffect(() => {
        if (!emailQuery) {
            return setErrorMessage('Email cannot be empty');
        }
        if (!isValidEmail(emailQuery)) {
            return setErrorMessage('Email format is not valid');
        }
        if (!passwordQuery) {
            return setErrorMessage('Password cannot be empty');
        }
        setErrorMessage('');
    }, [emailQuery, passwordQuery]);

    return (
        <div className="app-container d-flex container-fluid">
            <div className="row flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="auth-container col bg-white border rounded-lg py-4 px-5">
                    <div className="row mt-2 mb-4">
                        Status:&nbsp;
                        <span className={`${authToken ? 'text-success' : 'text-danger'}`}>
                          {authToken ? 'authorized' : 'is not autorized'}
                        </span>
                    </div>

                    <div className="row mt-2">
                        <input
                            type="text"
                            placeholder="user@email.com"
                            onChange={onEmailChange}
                            value={emailQuery}
                            className="form-control"
                        />
                    </div>
                    <div className="row mt-2">
                        <input
                            type="password"
                            placeholder="password"
                            onChange={onPassChange}
                            value={passwordQuery}
                            className="form-control"
                        />
                    </div>

                    {errorMessage && (
                        <div className="row my-3 text-danger justify-content-center">{errorMessage}</div>
                    )}

                    {!authToken && (
                        <div className="row mt-4">
                            <button
                                type="button"
                                className="col btn btn-primary"
                                onClick={onSignIn}
                                disabled={!!errorMessage}
                            >
                                Sign in
                            </button>
                        </div>
                    )}

                    {authToken && (
                        <div className="row mt-4">
                            <button
                                type="button"
                                className="col btn btn-primary"
                                onClick={onSignOut}
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
