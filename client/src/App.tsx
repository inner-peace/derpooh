import React, { useState } from 'react';
import './App.css';

function App(): JSX.Element {
    const [emailQuery, setEmailQuery] = useState('')
    const [passwordQuery, setPasswordQuery] = useState('')

    let isShowError = false
    let isAuthorized = false
    let authStatus = 'is not authorized'
    let errorMessage = ''
    let authToken = null
    let isSignOutButtonVisible = false
    let isSignInButtonVisible = true
    let isAuthStatusPositive = false

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        return emailRegex.test(email);
    }

    const validateLoginForm = () => {
        if (!emailQuery) {
            isShowError = true;
            errorMessage = 'Email cannot be empty';
            return false;
        }
        if (errorMessage === 'Email cannot be empty') {
            isShowError = false;
            errorMessage = '';
        }

        if (!isValidEmail(emailQuery)) {
            isShowError = true;
            errorMessage = 'Email format is not valid';
            return false;
        }
        if (errorMessage === 'Email format is not valid') {
            isShowError = false;
            errorMessage = '';
        }

        if (!passwordQuery) {
            isShowError = true;
            errorMessage = 'Password cannot be empty';
            return false;
        }
        if (errorMessage === 'Password cannot be empty') {
            isShowError = false;
            errorMessage = '';
        }

        return true;
    }

    const validateCredentials = async (email: string, password: string): Promise<boolean> => new Promise((resolve) => {
        if (email === 'demo@demo.com' && password === 'demo') {
            setTimeout(() => {
                resolve(true)
            }, 1000)
        } else {
            setTimeout(() => {
                resolve(false)
            }, 1000)
        }
    })

    const login = async (email: string, password: string, validationResult: boolean) => new Promise((resolve) => {
        setTimeout(() => {
            if (validationResult && email === 'demo@demo.com' && password === 'demo') {
                resolve(true)
            }
        })
    })

    const onAuthChanged = () => {
        if (isAuthorized) {
            isSignInButtonVisible = false;
            isSignOutButtonVisible = true;
            authStatus = 'authorized';
            isAuthStatusPositive = true;
        } else {
            isSignInButtonVisible = true;
            isSignOutButtonVisible = false;
            authStatus = 'is not autorized';
            isAuthStatusPositive = false;
        }
    }

    return (
        <div className="app-container d-flex container-fluid">
            <div className="row flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="auth-container col bg-white border rounded-lg py-4 px-5">
                    <div className="row mt-2 mb-4">
                        Status:&nbsp;
                        <span className={`${isAuthStatusPositive ? 'text-success' : 'text-danger'}`}>
                          {authStatus}
                        </span>
                    </div>

                    <div className="row mt-2">
                        <input
                            type="text"
                            placeholder="user@email.com"
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                                setEmailQuery(e.currentTarget.value)
                            }}
                            value={emailQuery}
                            className="form-control"
                        />
                    </div>
                    <div className="row mt-2">
                        <input
                            type="password"
                            placeholder="password"
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                                setPasswordQuery(e.currentTarget.value);
                            }}
                            value={passwordQuery}
                            className="form-control"
                        />
                    </div>

                    {isShowError && (
                        <div className="row my-3 text-danger justify-content-center">{errorMessage}</div>
                    )}

                    {isSignInButtonVisible && (
                        <div className="row mt-4">
                            <button
                                type="button"
                                className="col btn btn-primary"
                                onClick={async () => {
                                    if (!validateLoginForm()) {
                                        return;
                                    }

                                    try {
                                        const validationResult = await validateCredentials(emailQuery, passwordQuery);
                                        const authorizationToken = await login(
                                            emailQuery,
                                            passwordQuery,
                                            validationResult,
                                        );

                                        isAuthorized = true;
                                        isShowError = false;
                                        errorMessage = '';
                                        authToken = authorizationToken;
                                        onAuthChanged()
                                    } catch (e) {
                                        errorMessage = e.message;
                                        isShowError = true;
                                    }
                                }}
                            >
                                Sign in
                            </button>
                        </div>
                    )}

                    {isSignOutButtonVisible && (
                        <div className="row mt-4">
                            <button
                                type="button"
                                className="col btn btn-primary"
                                onClick={(): void => {
                                    isAuthorized = false;
                                    authToken = '';
                                    onAuthChanged()
                                }}
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
