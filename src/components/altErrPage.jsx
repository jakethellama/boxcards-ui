import { AxiosError } from 'axios';

function AltErrPage({ e }) {
    if (e instanceof AxiosError && e.code === 'ERR_NETWORK' && e.message === 'Network Error') {
        return <div className='mt-8 px-8 text-xl text-center flex flex-col items-center justify-center'>
            <h1>Uh oh, you couldn&apos;t connect to the server, please try again later!</h1>
        </div>;
    } else {
        return <div className='mt-8 px-8 text-xl text-center flex flex-col items-center justify-center'>
            <h1>Uh oh, something went wrong, please try again!</h1>
        </div>;
    }
}

export default AltErrPage;
