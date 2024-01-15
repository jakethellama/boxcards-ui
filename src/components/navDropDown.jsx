import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';

function NavDropDown() {
    const authCheckQ = useAuthCheckQuery(true);

    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);

    return (
        <>
            <div className="relative" ref={menuRef}>
                <div onClick={() => setOpen(!open)} className='px-1.5 py-2 mt-[1.5px] cursor-pointer group'>
                    <svg
                        className={`h-4 group-hover:stroke-fillPrimary group-hover:fill-fillPrimary ${open ? 'stroke-fillPrimary fill-fillPrimary' : 'stroke-white fill-white'}`}
                        viewBox="0 0 38 26"
                        xmlns="http://www.w3.org/2000/svg" >
                        <defs/>
                        <g >
                            <rect
                                width="38"
                                height="2"
                                x="0"
                                y="0" />
                            <rect
                                width="38"
                                height="2"
                                x="0"
                                y="12" />
                            <rect
                                width="38"
                                height="2"
                                x="0"
                                y="24" />
                        </g>
                    </svg>
                </div>
                <ul className={`absolute min-w-max  z-50 mt-2 ${open ? 'block' : 'hidden'}`}>
                    {authCheckQ.data.isAuth ? <NavDropDownLink text="Your Box" goTo={`../boxes/${authCheckQ.data.username}`} /> : null}
                    <NavDropDownLink text="Set Search " goTo="../sets"/>
                    <NavDropDownLink text="Card Search" goTo="../cards"/>
                </ul>
            </div>
        </>
    );
}

function NavDropDownLink({ text, goTo }) {
    return (
        <>
            <Link className='dropDownItem' to={goTo}>{text}</Link>
        </>
    );
}

export default NavDropDown;
