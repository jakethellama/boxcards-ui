import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';

function CardSearchBar() {
    const authCheckQ = useAuthCheckQuery(true);
    const navigate = useNavigate();
    const inputRef = useRef();

    const [searchParams, setSearchParams] = useSearchParams();

    const [wordVal, setWordVal] = useState(searchParams.get('word') === null ? '' : searchParams.get('word'));

    function handleSearch(event) {
        event.preventDefault();
        if (inputRef.current.value === '') {
            navigate('/cards');
        } else {
            navigate(`/cards?word=${inputRef.current.value}`);
        }
    }

    function handleChange(event) {
        setWordVal(event.target.value);
    }

    return (
        <>
            <div className='flex items-center bg-bgTwo p-1.5 rounded-full focus-within:ring-1 focus-within:ring-fillPrimary hover:ring-2 hover:ring-fillPrimary moreTransLin'>
                <div onClick={handleSearch} className='ml-2 p-1 cursor-pointer group'>
                    <svg
                        className='h-4 stroke-white fill-bgTwo group-hover:fill-fillPrimary colorTransLin'
                        viewBox="0 0 15.310295 15.337313"
                        xmlns="http://www.w3.org/2000/svg" >
                        <defs />
                        <g
                            transform="translate(-4.2333336,-4.2333331)">
                            <rect
                                width="1.2527311"
                                height="7.5102944"
                                x="-0.63283318"
                                y="19.430288"
                                transform="matrix(0.6866949,-0.72694575,0.70727645,0.70693707,0,0)" />
                            <circle
                                cx="10.054167"
                                cy="10.054166"
                                r="5.4628353" />
                        </g>
                    </svg>

                </div>
                <form onSubmit={handleSearch} className={`flex-1 ml-2 mr-3 ${authCheckQ.data.isAuth ? 'min-w-[205px]' : 'min-w-[205px]'}`}>
                    <input id="wordQuery" onChange={handleChange} value={wordVal} ref={inputRef} className={`bg-bgTwo focus:outline-none w-full ${authCheckQ.data.isAuth ? 'xs:min-w-[335px]' : 'xs:min-w-[286px]'}`} placeholder='Search Cards'/>
                </form>
            </div>
        </>
    );
}

export default CardSearchBar;
