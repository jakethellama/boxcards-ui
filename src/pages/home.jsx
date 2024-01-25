import { Navigate, Link } from 'react-router-dom';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';
import AltErrPage from '../components/altErrPage.jsx';

function Home() {
    const authCheckQ = useAuthCheckQuery(false);

    if (authCheckQ.isPending) {
        return <div></div>;
    } else if (authCheckQ.isError) {
        return <AltErrPage e={authCheckQ.error} />;
    }

    if (authCheckQ.data.isAuth) {
        return <Navigate to={`../boxes/${authCheckQ.data.username}`}></Navigate>;
    }

    return (
        <>
            <div className='min-h-[92vh] flex flex-col items-center justify-center'>
                <Link to='/cards' className='cursor-pointer text-[3.7rem] font-bold hover:text-fillPrimary'>BoxCards</Link>
                <div className='relative p-2 mt-1 mb-8 cursor-pointer group'>
                    <Link to='/cards' className='absolute top-0 left-0 w-full h-full'></Link>
                    <svg
                        className='h-[5.25rem] stroke-black fill-white group-hover:fill-fillPrimary '
                        viewBox="0 0 28.716567 20.331147"
                        xmlns="http://www.w3.org/2000/svg" >
                        <defs />
                        <g transform="translate(-7.5548902,-4.6744189)">
                            <rect
                                width="14.053507"
                                height="21.752811"
                                x="10.709485"
                                y="-30.228952"
                                transform="matrix(-0.0262757,0.99965473,-0.99999885,0.00151372,0,0)" />
                            <rect
                                width="13.940657"
                                height="21.828156"
                                x="6.4590774"
                                y="-33.928974"
                                transform="rotate(96.292615)" />
                            <rect
                                width="13.869467"
                                height="21.737396"
                                x="1.5329747"
                                y="-37.244099"
                                transform="matrix(-0.213457,0.97695246,-0.97432241,-0.22515737,0,0)" />
                        </g>
                    </svg>
                </div>

                <div className='flex gap-8'>
                    <Link to="/login" className='buttonStyle font-semibold bg-bgThree active:bg-bgFour py-4 px-7'>Login</Link>
                    <Link to="/signup" className='buttonStyle font-semibold bg-bgThree active:bg-bgFour py-4 px-6'>Sign Up</Link>
                </div>
            </div>
            <div className='min-h-[10vh]'></div>

        </>

    );
}

export default Home;
