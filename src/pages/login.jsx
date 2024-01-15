import { Navigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';
import AltErrPage from '../components/altErrPage.jsx';

function Login() {
    const queryClient = useQueryClient();
    const authCheckQ = useAuthCheckQuery(false);

    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const [submitStatus, setSubmitStatus] = useState(null);

    const loginM = useMutation({
        mutationFn: ({ username, password }) => axios.post('http://localhost:3000/api/login', { username, password }).then((res) => res.data),
        onError: (error) => {
            switch (error.response.status) {
                case 400:
                    setSubmitStatus(`${error.response.data.error.message}, please try again `);
                    break;
                case 401:
                    setSubmitStatus(`${error.response.data.error.message}, please try again `);
                    break;
                case 403:
                    setSubmitStatus(`${error.response.data.error.message}`);
                    queryClient.invalidateQueries({ queryKey: ['authCheckQ'] });
                    break;
                default:
                    setSubmitStatus('Uh Oh, An error occured while logging you in, please try again');
                    break;
            }
        },
        onSuccess: (data) => {
            // this will cause a navigate since the cookies are applied
            queryClient.invalidateQueries({ queryKey: ['authCheckQ'] });
        },
    });

    if (authCheckQ.isPending) {
        return <div></div>;
    } else if (authCheckQ.isError) {
        return <AltErrPage e={authCheckQ.error} />;
    }

    if (authCheckQ.data.isAuth) {
        return <Navigate to={`../boxes/${authCheckQ.data.username}`}></Navigate>;
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (usernameValue === '' || passwordValue === '') {
            setSubmitStatus('Please fill out both fields');
        } else if (usernameError === null && passwordError === null) {
            setSubmitStatus('Logging In ...');
            loginM.mutate({ username: usernameValue, password: passwordValue });
        } else {
            setSubmitStatus('Please fix both fields before submitting');
        }
    }

    function handleUsernameChange(event) {
        const value = event.target.value;
        setUsernameValue(value);

        if ((value.length === 0 || value.length > 20)) {
            setUsernameError('Username must have between 1 to 20 characters');
        } else if (value.match(/^[a-zA-Z0-9-_]+$/) === null) {
            setUsernameError('Username can only include letters, numbers, hyphen, or underscore');
        } else {
            setUsernameError(null);
            setSubmitStatus(null);
        }
    }

    function handlePasswordChange(event) {
        const value = event.target.value;
        setPasswordValue(value);

        if ((value.length < 5 || value.length > 40)) {
            setPasswordError('Password must have between 5 to 40 characters');
        } else {
            setPasswordError(null);
            setSubmitStatus(null);
        }
    }

    return (
        <div className='flex h-screen items-center justify-center'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 overflow-auto max-w-[500px] max-h-[550px] px-3 pt-2.5 pb-2.5 xxs:px-4 xxs:pt-3.5  w-[90%] h-[90%] rounded-2xl bg-bgTwo'>
                <h1 className='text-3xl font-bold'>Login</h1>

                <p className='font-medium text-lg mt-3'>Username</p>
                <input className={`bg-bgThree block px-2 py-1 mr-1 focus:ring-fillPrimary focus:ring-2 ${usernameError !== null ? 'ring-1 ring-errorPrimary' : ''}  rounded-lg focus:outline-none`} value={usernameValue} onChange={handleUsernameChange} />
                <p className={`text-xs text-errorPrimary ${usernameError !== null ? '' : 'hidden'}`}>{usernameError}</p>

                <p className='font-medium text-lg mt-4'>Password</p>
                <input className={`bg-bgThree block px-2 py-1 mr-1 focus:ring-fillPrimary focus:ring-2 ${passwordError !== null ? 'ring-1 ring-errorPrimary' : ''}  rounded-lg focus:outline-none`} value={passwordValue} onChange={handlePasswordChange}/>
                <p className={`text-xs text-errorPrimary ${passwordError !== null ? '' : 'hidden'}`}>{passwordError}</p>

                <button className='bg-bgFour hover:ring-1 hover:ring-fillPrimary active:bg-bgFive rounded-lg font-medium mt-6 py-2 px-6 self-start'>Submit</button>
                <p className={`text-xs ${submitStatus === null ? 'hidden' : ''} ${submitStatus === 'Logging In ...' ? 'text-green-400' : 'text-errorPrimary'}`}>{submitStatus}</p>

                <div className='flex gap-6 xxs:gap-8 mt-auto'>
                    <Link to="../signup" className='text-sm pt-1 hover:text-fillPrimary'>Sign Up</Link>
                    <Link to="../" className='text-sm pt-1 hover:text-fillPrimary'>Home Page</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;