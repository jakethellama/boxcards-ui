import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';

function SetSearchBar() {
    const navigate = useNavigate();
    const inputRef = useRef();

    const [searchParams, setSearchParams] = useSearchParams();

    const [nameVal, setNameVal] = useState(searchParams.get('name') === null ? '' : searchParams.get('name'));

    function handleSearch(event) {
        event.preventDefault();
        if (inputRef.current.value === '') {
            navigate('/sets');
        } else {
            navigate(`/sets?name=${inputRef.current.value}`);
        }
    }

    function handleChange(event) {
        setNameVal(event.target.value);
    }

    return (
        <>
            <div className='font-semibold text-lg flex items-center bg-bgThree p-2 mx-0 rounded-2xl focus-within:ring-1 focus-within:ring-white hover:ring-1 hover:ring-white'>
                <div onClick={handleSearch} className='ml-1 p-1 cursor-pointer group'>
                    <svg
                        className='h-5 stroke-white fill-bgThree group-hover:fill-fillPrimary'
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
                <form onSubmit={handleSearch} className={'flex-1 ml-2 mr-2 '}>
                    <input id="setQuery" onChange={handleChange} value={nameVal} ref={inputRef} className={'bg-bgThree focus:outline-none w-full'} placeholder='Search Sets'/>
                </form>
            </div>
        </>
    );
}

export default SetSearchBar;
