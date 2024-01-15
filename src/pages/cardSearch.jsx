import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import HeaderBar from '../components/headerBar.jsx';
import ContentContainer from '../components/contentContainer.jsx';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';
import CardGrid from '../components/cardGrid.jsx';

function CardSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [contentError, setContentError] = useState(null);

    const authCheckQ = useAuthCheckQuery(true);

    if (authCheckQ.isError) {
        throw authCheckQ.error;
    }

    const cardsDataQueryKey = ['cardSearchQ', searchParams.get('word')];
    const cardsDataQueryFn = () => {
        if (searchParams.get('word') === null || searchParams.get('word') === '') {
            return axios.get('http://localhost:3000/api/cards').then((res) => res.data);
        } else {
            return axios.get(`http://localhost:3000/api/cards?word=${searchParams.get('word')}`).then((res) => res.data);
        }
    };

    return (
        <>
            <HeaderBar />
            <ContentContainer>
                <h1 className='pt-2.5 xxs:pt-4 pb-1.5 text-3xl font-bold'>
                    Card Search
                </h1>

                {
                    contentError === null ? null : <div className='text-errorPrimary text-sm'>{contentError}</div>
                }

                <h2 className='mt-6 mb-2 break-words font-medium pr-0.5 border-slate-500 max-w-max'>
                    {searchParams.get('word') ? `Results for "${searchParams.get('word')}"` : 'All Cards'}
                </h2>

                <div className='pb-4 xxs:pb-5'>
                    <CardGrid canRemove={false} canPost={false} dataQueryKey={cardsDataQueryKey} dataQueryFn={cardsDataQueryFn} />
                </div>

            </ContentContainer>

        </>
    );
}

export default CardSearch;
