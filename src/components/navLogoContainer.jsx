import { Link, useNavigate } from 'react-router-dom';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';

function NavLogoContainer() {
    const authCheckQ = useAuthCheckQuery(true);

    if (authCheckQ.data.isAuth) {
        return (
            <div className='relative ml-2 ssm:ml-0 p-0.5 cursor-pointer group'>
                <Link to={`/boxes/${authCheckQ.data.username}`} className='absolute top-0 left-0 w-full h-full'></Link>
                <svg
                    className='h-9 stroke-black fill-white group-hover:fill-fillPrimary colorTransOut duration-200'
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
        );
    } else {
        return (
            <div className='relative ml-2 xs:ml-6 ssm:ml-11 sm:ml-0 p-0.5 cursor-pointer group'>
                <Link to={'/'} className='absolute top-0 left-0 w-full h-full'></Link>
                <svg
                    className='h-9 stroke-black fill-white group-hover:fill-slate-400 colorTransOut duration-200'
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
        );
    }
}

export default NavLogoContainer;
