import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';
import CardEdit from './cardEdit.jsx';
import CardNoEdit from './cardNoEdit.jsx';
import AddToSetDropDown from './addToSetDropDown.jsx';

function CardGrid({ dataQueryKey, dataQueryFn, canRemove, canPost, setContentError, hasMax }) {
    const queryClient = useQueryClient();
    const authCheckQ = useAuthCheckQuery(true);
    const params = useParams();
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedCIDKIs, setSelectedCIDKIs] = useState([]);

    let setInfoKey = [null];
    let setInfoFn = () => null;

    if (canRemove) {
        setInfoKey = ['setInfoQ', params.sid];
        setInfoFn = () => axios.get(`http://localhost:3000/api/sets/${params.sid}`).then((res) => res.data);
    }

    const curSetInfoQ = useQuery({
        queryKey: setInfoKey,
        queryFn: setInfoFn,
        placeholderData: { author: '', name: '', isPublished: true },
        retry: 0,
    });

    function cardHandleSelect(targetCIDKI) {
        setSelectedCIDKIs((prevSelectedCIDKIs) => {
            const index = prevSelectedCIDKIs.indexOf(targetCIDKI);
            if (index >= 0) {
                const copy = [...prevSelectedCIDKIs];
                copy.splice(index, 1);
                return copy;
            } else {
                return [...prevSelectedCIDKIs, targetCIDKI];
            }
        });
    }

    function toggleSelectMode() {
        if (isSelectMode === true) {
            setIsSelectMode(false);
        } else {
            setSelectedCIDKIs([]);
            setIsSelectMode(true);
        }
    }

    const cardsQuery = useQuery({
        queryKey: dataQueryKey,
        queryFn: () => {
            setIsSelectMode(false);
            setSelectedCIDKIs([]);
            return dataQueryFn();
        },

        staleTime: 0,
        retry: 1,
    });

    const cardInstances = {};

    const removeSetCardsM = useMutation({
        mutationFn: () => {
            const cidArr = [];
            const instances = {};

            cardsQuery.data.forEach((card) => {
                const cid = card._id;

                if (instances[cid]) {
                    instances[cid] += 1;
                } else {
                    instances[cid] = 1;
                }

                if (!selectedCIDKIs.includes(cid + (instances[cid] - 1).toString())) {
                    cidArr.push(cid);
                }
            });

            return axios.patch(`http://localhost:3000/api/sets/${params.sid}/cards`, { cidArr }).then((res) => res.data);
        },
        onSuccess: (data, zzz, context) => {
            queryClient.invalidateQueries({ queryKey: ['authUserSetsQ'] });
            queryClient.invalidateQueries({ queryKey: ['setCardsQ', params.sid] });
        },
    });

    function handleRemoveCards(e) {
        removeSetCardsM.mutate();
        toggleSelectMode();
    }

    const postCardM = useMutation({
        mutationFn: () => axios.post('http://localhost:3000/api/cards', { word: '', definition: '' }).then((res) => res.data),

        onMutate: async () => {
            await queryClient.cancelQueries(['profileCardsQ', params.username]);
            const prevProfileCards = queryClient.getQueryData(['profileCardsQ', params.username]);
            const newCard = { author: authCheckQ.data.username, word: '', definition: '', isPublished: false, references: 0, _id: prevProfileCards.length };
            queryClient.setQueryData(['profileCardsQ', params.username], [...prevProfileCards, newCard]);
            setContentError(null);
            return { prevProfileCards };
        },
        onError: (error, zzz, context) => {
            setContentError(`Unable to create new Card, please try again ${error}`);
            queryClient.setQueryData(['profileCardsQ', params.username], context.prevProfileCards);
        },
        onSuccess: (data, zzz, context) => {
            queryClient.setQueryData(['profileCardsQ', params.username], [...context.prevProfileCards, data]);
        },
    });

    function handlePostCard() {
        postCardM.mutate();
    }

    if (curSetInfoQ.isPending) {
        return <div>placeholder data skips this</div>;
    } else if (curSetInfoQ.isError) {
        throw curSetInfoQ.error;
    }

    if (cardsQuery.isPending) {
        return <div>Loading Cards... </div>;
    } else if (cardsQuery.isError) {
        return (
            <div className='text-center errorText'>
                <h1 className='text-errorPrimary'>An error occured while getting these cards, please try again.</h1>
                <h1>{cardsQuery.error.response.status}</h1>
                {
                    cardsQuery.error.response.status < 500 ? <p>{cardsQuery.error.response.data.error.message}</p> : null
                }
            </div>
        );
    }

    if (cardsQuery.data.length === 0) {
        return (
            <>
                {
                    canPost === true && authCheckQ.data.username === params.username && isSelectMode === false
                        ? <button onClick={handlePostCard} className='buttonSize buttonStyle mb-5 xxs:mb-6'>Create New Card</button> : null
                }
                <div className=''>Oops, this has no cards yet!</div>
            </>
        );
    } else {
        return (
            <>
                <div className='flex flex-wrap gap-x-5 gap-y-4 mb-5 xxs:mb-6'>
                    {
                        authCheckQ.data.isAuth === true
                            ? <button onClick={toggleSelectMode} className={`buttonSize buttonStyle ${isSelectMode ? 'bg-lightPink active:bg-[#eaa9b3] hover:ring-slate-300' : ''}`}>{isSelectMode ? 'Cancel Select' : 'Select Cards'}</button> : null
                    }
                    {
                        canPost === true && authCheckQ.data.username === params.username && isSelectMode === false
                            ? <button onClick={handlePostCard} className='buttonSize buttonStyle '>Create New Card</button> : null
                    }

                    {
                        isSelectMode === true
                            ? <>
                                <AddToSetDropDown selectedCIDs={selectedCIDKIs.map((cidKI) => cidKI.substring(0, 24))}
                                    toggleSelectMode={toggleSelectMode}/>
                                {
                                    canRemove === true && (curSetInfoQ.data.isPublished === false) && (authCheckQ.data.username === curSetInfoQ.data.author)
                                        ? <button onClick={handleRemoveCards} className='buttonSize buttonStyle'>Remove Cards </button>
                                        : null
                                }

                            </>
                            : null
                    }
                    {
                        hasMax === true ? <div className={`text-sm ml-auto self-start ${cardsQuery.data.length === 50 ? 'text-red-400' : ''}`}>Cards: {cardsQuery.data.length}/50 </div>
                            : <div className='text-sm ml-auto'>Cards: {cardsQuery.data.length}</div>
                    }

                </div>
                <div className='grid gap-x-6 gap-y-5 xxs:gap-y-6 grid-cols-cardAFit grid-rows-card auto-rows-card'>
                    {
                        cardsQuery.data.map((card, index) => {
                            if (cardInstances[card._id]) {
                                cardInstances[card._id] += 1;
                            } else {
                                cardInstances[card._id] = 1;
                            }

                            if (card.isPublished) {
                                return <CardNoEdit author={card.author}
                                    key={card._id + (cardInstances[card._id] - 1).toString()}
                                    cidKI={card._id + (cardInstances[card._id] - 1).toString()}
                                    cid={card._id} word={card.word} def={card.definition}
                                    isPublished={card.isPublished} references={card.references}
                                    isSelectMode={isSelectMode} handleSelect={cardHandleSelect}
                                />;
                            } else {
                                return <CardEdit author={card.author}
                                    key={card._id + (cardInstances[card._id] - 1).toString()}
                                    cidKI={card._id + (cardInstances[card._id] - 1).toString()}
                                    cid={card._id} word={card.word} def={card.definition}
                                    isPublished={card.isPublished} references={card.references}
                                    cardRenderQueryKey={dataQueryKey}
                                    isSelectMode={isSelectMode} handleSelect={cardHandleSelect}
                                />;
                            }
                        })
                    }
                </div>
            </>
        );
    }
}

export default CardGrid;
