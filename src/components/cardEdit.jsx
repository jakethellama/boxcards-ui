import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import useAuthUserInfoQuery from '../queries/authUserInfoQuery.jsx';

function CardEdit({ cardRenderQueryKey, isSelectMode, handleSelect,
    cid, cidKI, word, def, isPublished, references }) {
    const queryClient = useQueryClient();
    const authUserInfoQ = useAuthUserInfoQuery();

    const [side, setSide] = useState('word');
    const [favError, setFavError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [pubOrDel, setPubOrDel] = useState(null);

    const [isSelected, setIsSelected] = useState(false);
    if (isSelectMode === false && isSelected !== false) {
        setIsSelected(false);
    }

    const privCardInfoQ = useQuery({
        queryKey: ['privCardInfoQ', cid],
        queryFn: () => axios.get(`https://api.boxcards.app/api/cards/${cid}`).then((res) => res.data),
        initialData: { word, def, isPublished },
        refetchOnMount: false,
        retry: 0,
        staleTime: Infinity,
    });

    const [newWordValue, setNewWordValue] = useState(privCardInfoQ.data.word);
    const [newDefValue, setNewDefValue] = useState(privCardInfoQ.data.def);
    const textAreaRef = useRef();

    const patchCardInfoM = useMutation({
        mutationFn: () => axios.patch(`https://api.boxcards.app/api/cards/${cid}`, { word: newWordValue, definition: newDefValue, isPublished }).then((res) => res.data),

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['privCardInfoQ', cid] });
            const previousCardInfo = queryClient.getQueryData(['privCardInfoQ', cid]);
            queryClient.setQueryData(['privCardInfoQ', cid], { word: newWordValue, def: newDefValue, isPublished });
            setFavError(null);
            return { previousCardInfo };
        },
        onError: (error, zzz, context) => {
            queryClient.setQueryData(['privCardInfoQ', cid], context.previousCardInfo);
            setNewWordValue(context.previousCardInfo.word);
            setNewDefValue(context.previousCardInfo.def);
            setFavError(error.response.data.error.message);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['privCardInfoQ', cid], data);
        },
    });

    const publishCardM = useMutation({
        mutationFn: () => axios.patch(`https://api.boxcards.app/api/cards/${cid}`, { word: newWordValue, definition: newDefValue, isPublished: true }).then((res) => res.data),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['privCardInfoQ', cid] });
            const previousCardInfo = queryClient.getQueryData(['privCardInfoQ', cid]);
            queryClient.setQueryData(['privCardInfoQ', cid], { word: newWordValue, def: newDefValue, isPublished: true });
            return { previousCardInfo };
        },
        onError: (error, zzz, context) => {
            queryClient.setQueryData(['privCardInfoQ', cid], context.previousCardInfo);
            setNewWordValue(context.previousCardInfo.word);
            setNewDefValue(context.previousCardInfo.def);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['privCardInfoQ', cid], data);
            queryClient.invalidateQueries({ queryKey: cardRenderQueryKey });
        },
    });

    const deleteCardM = useMutation({
        mutationFn: () => axios.delete(`https://api.boxcards.app/api/cards/${cid}`).then((res) => res.data),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['privCardInfoQ', cid] });
            const previousCardInfo = queryClient.getQueryData(['privCardInfoQ', cid]);
            queryClient.setQueryData(['privCardInfoQ', cid], { word: newWordValue, def: newDefValue, isPublished: true });
            return { previousCardInfo };
        },
        onError: (error, zzz, context) => {
            queryClient.setQueryData(['privCardInfoQ', cid], context.previousCardInfo);
            setNewWordValue(context.previousCardInfo.word);
            setNewDefValue(context.previousCardInfo.def);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['privCardInfoQ', cid], data);
            queryClient.invalidateQueries({ queryKey: cardRenderQueryKey });
        },
    });

    useEffect(() => {
        const handler = (e) => {
            if (textAreaRef.current !== undefined && textAreaRef.current !== null) {
                if (!textAreaRef.current.contains(e.target)) {
                    patchCardInfoM.mutate();
                    setIsEditing(false);
                    e.stopPropagation();
                }
            }
        };

        document.addEventListener('click', handler);

        return () => {
            document.removeEventListener('click', handler);
        };
    }, []);

    const patchAuthUserFavsM = useMutation({
        mutationFn: () => axios.patch(`https://api.boxcards.app/api/boxes/${authUserInfoQ.data.username}/favorites`, { cid }).then((res) => res.data),
        onMutate: async () => {
            setFavError(null);
            await queryClient.cancelQueries({ queryKey: ['authUserInfoQ'] });
            const previousUserInfo = queryClient.getQueryData(['authUserInfoQ']);
            queryClient.setQueryData(['authUserInfoQ'], (old) => {
                const afterIds = [...old.favsIds];
                const index = afterIds.indexOf(cid);
                if (index >= 0) {
                    afterIds.splice(index, 1);
                } else {
                    afterIds.push(cid);
                }
                return { ...old, favsIds: afterIds };
            });
            return { previousUserInfo };
        },
        onError: (error, zzz, context) => {
            queryClient.setQueryData(['authUserInfoQ'], context.previousUserInfo);
            setFavError(error.response.data.error.message);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['authUserInfoQ'], (old) => ({ ...old, favsIds: data }));
            queryClient.invalidateQueries({ queryKey: ['authUserFavsQ'] });
        },
    });

    function handleCardClick() {
        if (isSelectMode === true) {
            setIsSelected(!isSelected);
            handleSelect(cidKI);
        } else {
            if (isEditing === false) {
                if (side === 'word') {
                    setSide('def');
                } else {
                    setSide('word');
                }
            }
        }
    }

    function toggleFav(event) {
        patchAuthUserFavsM.mutate();
        event.stopPropagation();
    }

    function toggleEdit(event) {
        setPubOrDel(null);

        if (isEditing) {
            patchCardInfoM.mutate();
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }

        event.stopPropagation();
    }

    function inputClick(event) {
        event.stopPropagation();
    }

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Enter') {
                patchCardInfoM.mutate();
                setIsEditing(false);
                e.preventDefault();
            }
        };

        if (isEditing) {
            document.addEventListener('keydown', handler);
        }

        return () => {
            document.removeEventListener('keydown', handler);
        };
    }, [isEditing]);

    function handleChange(event) {
        setFavError(null);
        const value = event.target.value;

        if (side === 'word') {
            if (newWordValue.length >= 50 && value.length >= 50) {
                setFavError('Max 50 Characters');
            } else if (value.length > 50) {
                setFavError('Max 50 Characters');
                setNewWordValue(value.substring(0, 50));
            } else {
                setNewWordValue(value);
            }
        } else {
            if (newDefValue.length >= 250 && value.length >= 250) {
                setFavError('Max 250 Characters');
            } else if (value.length > 250) {
                setFavError('Max 250 Characters');
                setNewDefValue(value.substring(0, 250));
            } else {
                setNewDefValue(value);
            }
        }
    }

    function handlePublish(event) {
        if (pubOrDel === 'publish') {
            setFavError('Publishing ...');
            publishCardM.mutate({
                onError: () => {
                    setFavError('Error publishing, Try again');
                },
            });
            setPubOrDel(null);
        } else {
            setFavError('Press again to Publish');
            setPubOrDel('publish');
        }

        event.stopPropagation();
    }

    function handleDelete(event) {
        if (pubOrDel === 'delete') {
            setFavError('Deleting ...');
            deleteCardM.mutate({
                onError: () => {
                    setFavError('Error deleting, Try again');
                },
            });
            setPubOrDel(null);
        } else {
            setFavError('Press again to Delete');
            setPubOrDel('delete');
        }

        event.stopPropagation();
    }

    if (authUserInfoQ.isPending) {
        return <span>placeholder data skips this</span>;
    } else if (authUserInfoQ.isError) {
        throw authUserInfoQ.error;
    }

    if (privCardInfoQ.isPending) {
        return <span>initial data skips this</span>;
    } else if (privCardInfoQ.isError) {
        return <div className='flex justify-center items-center text-errorPrimary'>Error Getting this Card and its newest Data</div>;
    }

    return (
        <>
            <div onClick={(handleCardClick)} className={`cardContainer  ${side === 'word' ? 'bg-bgThree' : 'bg-bgFive'} ${isSelected ? 'ring ring-green-300' : 'hover:ring hover:ring-fillPrimary '}`}>

                <div className='relative h-0'>
                    <div className='absolute w-full cardFeatureBar h-6'>
                        <div className='flex gap-2 items-center'>
                            {
                                authUserInfoQ.data.favsIds === null ? <div></div>
                                    : <svg
                                        onClick={isSelectMode ? null : toggleFav}
                                        className={`h-4 stroke-[rgba(255,255,255,.8)] hover:stroke-fillPrimary stroke-2 ${authUserInfoQ.data.favsIds.includes(cid) ? 'fill-yellow-200' : 'fill-transparent'} colorTransOut`}
                                        viewBox="-.25 -1 44.75 44"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <defs />
                                        <g transform="translate(-1.8807824,3.4321005)">
                                            <path
                                                d="M 29.633333,14.816667 C 28.989149,15.309278 16.9079,5.8621157 16.097195,5.8820047 15.28649,5.9018937 3.6830306,15.930114 3.0154661,15.469684 2.3479015,15.009254 7.5993755,0.59996958 7.3299383,-0.16491056 7.0605011,-0.92979071 -6.0625689,-8.866446 -5.8309629,-9.6436183 c 0.231606,-0.7771727 15.5584445,-0.2354375 16.2026279,-0.7280487 0.644184,-0.492611 4.13714,-15.425953 4.947845,-15.445842 0.810705,-0.01989 5.031738,14.724205 5.699302,15.184635 0.667565,0.46043 15.949401,-0.832228 16.218838,-0.06735 0.269437,0.7648804 -12.44866,9.3354975 -12.680266,10.1126697 -0.231606,0.77717225 5.720132,14.9116083 5.075949,15.4042193 z"
                                                transform="rotate(1.4341515,-885.33001,320.51597)" />
                                        </g>
                                    </svg>
                            }
                            <div className='text-errorPrimary text-xs'>{favError}</div>
                        </div>

                        {
                            isEditing
                                ? <div className='flex items-center gap-3 mb-[2px]'>
                                    <svg
                                        onClick={handlePublish}
                                        className='h-5'
                                        viewBox="-0.1 -0.2 13 17.2"
                                        xmlns="http://www.w3.org/2000/svg" >
                                        <defs />
                                        <g className='group'transform="translate(-0.00617888,4.0510525)">
                                            <path
                                                className={` stroke-[rgba(255,255,255,.7)] group-hover:stroke-fillPrimary ${pubOrDel === 'publish' ? 'fill-lightPink' : 'fill-transparent'} colorTransOut`}
                                                d="m 2.8035604,-3.7891909 h 5.511661 c 2.7459146,0 4.1229136,2.7308576 4.1229136,5.0837411 v 8.4390351 c 0,2.4261787 0,2.7045527 -2.5354136,2.7045527 h -7.099161 c -2.52702534,0 -2.53726373,-0.278374 -2.53541445,-2.7045527 l 0.008387,-11.0057464 c 0.00171,-2.2386543 5.1e-7,-2.5170298 2.52702595,-2.5170298 z" />                                        <path
                                                className='fill-[rgba(255,255,255,.7)] group-hover:fill-fillPrimary colorTransOut'
                                                d="M 5.4762944,12.21804 5.4711444,4.1536993 H 3.7072556 L 6.3556632,1.0772706 8.9989222,4.1536993 H 7.2350346 l 0.00515,8.0643407 z" id="path3" />
                                        </g>
                                    </svg>
                                    <svg
                                        onClick={handleDelete}
                                        className={`h-5 ${side === 'word' ? 'fill-bgThree' : 'fill-bgFive'} stroke-[rgba(255,255,255,.7)] hover:stroke-fillPrimary ${pubOrDel === 'delete' ? 'fill-lightPink' : ''} colorTransOut`}
                                        viewBox="-0.75 -1.5 16 16.4"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <defs />
                                        <g transform="translate(-6.253244,-7.0380973)">
                                            <rect
                                                width="9.9385519"
                                                height="12.564407"
                                                x="8.656765"
                                                y="8.6667528"
                                                ry="1.963189" />
                                            <rect
                                                width="5.8208337"
                                                height="2.5"
                                                x="10.715624"
                                                y="6"
                                                ry="0.93865341" />
                                            <rect
                                                width="14.454372"
                                                height="3.5"
                                                x="6.3988547"
                                                y="8.3920803"
                                                ry="2" />
                                        </g>
                                    </svg>

                                </div>
                                : null
                        }

                        <div className='flex gap-2.5 items-center'>
                            <p className='text-sm'>{references}</p>
                            <svg
                                onClick={isSelectMode ? null : toggleEdit}
                                className={`h-4 ${side === 'word' ? 'fill-bgThree' : 'fill-bgFive'} stroke-[rgba(255,255,255,.7)] ${isEditing ? 'fill-lightPink' : ''} hover:stroke-fillPrimary colorTransOut`}
                                viewBox="0 0 18.08704 18.087171">
                                <defs />
                                <g transform="translate(5.8510547,-0.63571518)">
                                    <rect
                                        width="4.2333326"
                                        height="16.933332"
                                        x="6.9849997"
                                        y="-4.4824123"
                                        transform="rotate(45)" />
                                    <rect
                                        width="4.2333326"
                                        height="2.968497"
                                        x="6.9849997"
                                        y="-5.8213797"
                                        transform="rotate(45)" />
                                    <path
                                        d="m -1.1564486,16.855633 -2.8273557,-2.827356 -1.6027791,4.430137 z"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='flex-1 flex items-center justify-center text-center'>
                    {
                        isEditing === true
                            ? <TextareaAutosize autoFocus onClick={inputClick} onChange={handleChange} value={side === 'word' ? newWordValue : newDefValue} className={`px-3.5 text-center break-words overflow-auto resize-none align-top flex-1 bg-transparent focus:outline-none ${side === 'word' ? 'text-blue-300' : 'text-blue-300'}`} id="changeVal" ref={textAreaRef}
                                onFocus={function (e) {
                                    const val = e.target.value;
                                    e.target.value = '';
                                    e.target.value = val;
                                }}/>
                            : <p className='px-3.5 break-words overflow-auto'>{side === 'word' ? privCardInfoQ.data.word : privCardInfoQ.data.def }</p>
                    }
                </div>

            </div>
        </>
    );
}

export default CardEdit;
