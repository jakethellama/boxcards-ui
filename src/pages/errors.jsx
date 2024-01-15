import { useRouteError } from 'react-router-dom';
import { AxiosError } from 'axios';
import HeaderBar from '../components/headerBar.jsx';

function Errors() {
    const e = useRouteError();

    if (e instanceof AxiosError) { // server error
        if (e.code === 'ERR_NETWORK' && e.message === 'Network Error') {
            return (
                <>
                    <div className='mt-8 px-8 text-xl text-center'>
                        <h1>Uh oh, you couldn&apos;t connect to the server, please try again later!</h1>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <HeaderBar />
                    <div className='mt-5 px-8 text-lg text-center flex flex-col items-center justify-center'>
                        <h1>Uh oh, something went wrong, please try again!</h1>
                        <h1>{e.response.status}</h1>
                        {
                            e.response.status < 500 ? <p>{e.response.data.error.message}</p> : null
                        }
                    </div>
                </>
            );
        }
    } else {
        return ( // client/routing error
            <>
                <HeaderBar />
                <div className='mt-8 px-8 text-xl text-center flex flex-col items-center justify-center'>
                    <h1>Uh oh, something went wrong, please try again!</h1>
                    <h1>{e.status}</h1>
                    {
                        e.status === 404 ? <p>Page Not Found</p> : null
                    }
                </div>
            </>
        );
    }
}

export default Errors;
