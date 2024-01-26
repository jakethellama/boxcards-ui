import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthUserInfoQuery from '../queries/authUserInfoQuery.jsx';

function CardNoEdit({ isSelectMode, handleSelect,
    cid, cidKI, word, def, references }) {
    const queryClient = useQueryClient();
    const authUserInfoQ = useAuthUserInfoQuery();

    const [side, setSide] = useState('word');
    const [favError, setFavError] = useState(null);

    const [isSelected, setIsSelected] = useState(false);
    if (isSelectMode === false && isSelected !== false) {
        setIsSelected(false);
    }

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
            if (side === 'word') {
                setSide('def');
            } else {
                setSide('word');
            }
        }
    }

    function toggleFav(event) {
        patchAuthUserFavsM.mutate();
        event.stopPropagation();
    }

    if (authUserInfoQ.isPending) {
        return <span>placeholder data skips this</span>;
    } else if (authUserInfoQ.isError) {
        throw authUserInfoQ.error;
    }

    return (
        <>
            <div onClick={(handleCardClick)} className={` cardContainer ${side === 'word' ? 'bg-bgThree' : 'bg-bgFive'} ${isSelected ? 'ring ring-green-300' : 'hover:ring hover:ring-fillPrimary '}`}>

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

                        <div className='flex gap-2.5 items-center'>
                            <p className=''>{references}</p>
                        </div>
                    </div>
                </div>

                <div className='flex-1 flex items-center justify-center text-center'>
                    <p className='px-3.5 break-words overflow-auto'>{side === 'word' ? word : def}</p>
                </div>
            </div>
        </>
    );
}

export default CardNoEdit;
