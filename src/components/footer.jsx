import useAuthCheckQuery from '../queries/authCheckQuery.jsx';

function Footer() {
    const authCheckQ = useAuthCheckQuery(true);

    if (authCheckQ.isError) {
        return <></>;
    } else if (authCheckQ.data.isAuth) {
        return (
            <div className='font-semibold mb-5 px-3.5 xxs:px-5 text-center '>
                <a href='https://github.com' className='text-sm text-blue-300 hover:underline' target="_blank" rel="noopener noreferrer">
                    Check out this Repo!
                </a>
            </div>
        );
    } else {
        return <></>;
    }
}

export default Footer;
