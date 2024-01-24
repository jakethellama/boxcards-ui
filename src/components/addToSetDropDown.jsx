import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function AddToSetDropDown({ toggleSelectMode, selectedCIDs }) {
    const [open, setOpen] = useState(false);
    const dropDownRef = useRef();

    const authUserSetsQ = useQuery({
        queryKey: ['authUserSetsQ'],
        queryFn: async () => axios.get('https://api.boxcards.app/api/authUserSets').then((res) => res.data),
        placeholderData: [],
        staleTime: 0,
        retry: 2,
    });

    useEffect(() => {
        const handler = (e) => {
            if (!dropDownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);

    function handleButtonClick() {
        setOpen(!open);
    }

    let privSetCount = 0;

    return (
        <>
            <div className="relative" ref={dropDownRef}>
                <button onClick={handleButtonClick} className={`buttonSize buttonStyle ${open ? 'ring-1 ring-fillPrimary' : ''}`}>Add to Set</button>

                <ul className={`absolute mt-2.5 z-50 text-right xxs:text-left right-0 
                    min-w-[130px] max-w-[204px] xs:max-w-[303px] sm:max-w-[420px] md:max-w-[1000px] 
                    break-words xxs:right-auto ${open ? 'block' : 'hidden'}`}>
                    {authUserSetsQ.isError ? <div className='md:w-full md:min-w-max pl-3 pr-3 py-2 shadow-fillPrimary shadow-sm border rounded-lg bg-bgTwo border-red-400 text-errorPrimary'>Error Getting Your Sets, Please Reload</div>
                        : <>
                            {
                                authUserSetsQ.data.map((set) => {
                                    if (set.isPublished === false) {
                                        privSetCount += 1;
                                        return <SetDropDownItem name={set.name}
                                            key={set._id} sid={set._id}
                                            toggleSelectMode={toggleSelectMode}
                                            selectedCIDs={selectedCIDs} prevCards={set.cards}/>;
                                    } else {
                                        return null;
                                    }
                                })
                            }
                            {
                                privSetCount === 0 ? <li className='md:w-full md:min-w-max pl-3 pr-3 py-2 shadow-fillPrimary shadow-sm border rounded-lg bg-bgTwo border-red-400 text-errorPrimary'>You Have No Private Sets! </li> : null
                            }
                        </>
                    }
                </ul>
            </div>
        </>
    );
}

function SetDropDownItem({ name, sid, toggleSelectMode, selectedCIDs, prevCards }) {
    const queryClient = useQueryClient();

    const patchSetCardsM = useMutation({
        mutationFn: () => {
            const cidArr = [...prevCards];
            let i = 0;
            while (i < selectedCIDs.length) {
                if (cidArr.length + 1 <= 50) {
                    cidArr.push(selectedCIDs[i]);
                }

                i += 1;
            }

            return axios.patch(`https://api.boxcards.app/api/sets/${sid}/cards`, { cidArr }).then((res) => res.data);
        },
        onSuccess: (data, zzz, context) => {
            queryClient.invalidateQueries({ queryKey: ['authUserSetsQ'] });
            queryClient.invalidateQueries({ queryKey: ['setCardsQ', sid] });
        },
    });

    function handleItemClick(e) {
        patchSetCardsM.mutate();
        toggleSelectMode();
    }

    return <li onClick={handleItemClick} className="md:w-full md:min-w-max dropDownItem">
        {name}
    </li>;
}

export default AddToSetDropDown;
