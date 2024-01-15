import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';

function HeaderRightIcon() {
    const authCheckQ = useAuthCheckQuery(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const dropDownRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (dropDownRef.current !== undefined && !dropDownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);

    function handleIconClick() {
        setOpen(!open);
    }

    const logoutM = useMutation({
        mutationFn: () => axios.post('http://localhost:3000/api/logout').then((res) => res.data),
        onSuccess: () => {
            queryClient.removeQueries();
        },
    });

    function handleLogoutClick() {
        setOpen(!open);
        logoutM.mutate('zzz', {
            onSuccess: () => {
                navigate('/');
            },
        });
    }

    if (authCheckQ.isPending) {
        return (
            <>
                <div className='mr-0.5 '>
                    <svg
                        className={'h-9 fill-transparent '}
                        viewBox="-1 -1 100 100"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs />
                        <g transform="translate(0.44646991,0.4464699)">
                            <circle
                                cx="48.475849"
                                cy="48.475849"
                                r="47.533257" />
                        </g>
                    </svg>
                </div>
            </>
        );
    }

    if (authCheckQ.data.isAuth) {
        return (
            <>
                <div className='relative mr-0.5' ref={dropDownRef}>
                    <svg
                        onClick={handleIconClick}
                        className={`h-9 cursor-pointer stroke-[5] fill-green-200 hover:stroke-fillPrimary ${open ? 'stroke-fillPrimary' : ''}` }
                        viewBox="-1 -1 100 100"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs />
                        <g transform="translate(0.44646991,0.4464699)">
                            <circle
                                cx="48.475849"
                                cy="48.475849"
                                r="47.533257" />
                        </g>
                    </svg>

                    <ul className={`absolute z-50 ml-[-2.6rem] mt-2 ${open ? 'block' : 'hidden'}`}>
                        <>
                            {
                                <IconDropDownItem onClick={handleLogoutClick} name={'Logout'} />
                            }
                        </>
                    </ul>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Link to={'/login'} className='min-w-max  mr-0.5 ssm:mr-1 py-2 px-2.5 ssm:px-5  buttonStyle'>Login</Link>
            </>
        );
    }
}

function IconDropDownItem({ name, onClick }) {
    return <li onClick={onClick} className="dropDownItem">
        {name}
    </li>;
}

export default HeaderRightIcon;
