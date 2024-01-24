import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import HeaderBar from '../components/headerBar.jsx';
import ContentContainer from '../components/contentContainer.jsx';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';
import SetList from '../components/setList.jsx';
import SetSearchBar from '../components/setSearchBar.jsx';

function SetSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [contentError, setContentError] = useState(null);

    const authCheckQ = useAuthCheckQuery(true);

    if (authCheckQ.isError) {
        throw authCheckQ.error;
    }

    const setsDataQueryKey = ['setSearchQ', searchParams.get('name')];
    const setsDataQueryFn = () => {
        if (searchParams.get('name') === null || searchParams.get('name') === '') {
            return axios.get('https://api.boxcards.app/api/sets').then((res) => res.data);
        } else {
            return axios.get(`https://api.boxcards.app/api/sets?name=${searchParams.get('name')}`).then((res) => res.data);
        }
    };

    return (
        <>
            <HeaderBar />
            <ContentContainer>
                <h1 className='pt-2.5 xxs:pt-4 pb-2.5 text-3xl font-bold'>
                    Set Search
                </h1>

                <div className='mb-2.5'>
                    <SetSearchBar />
                </div>

                {
                    contentError === null ? null : <div className='mb-[-0.75rem] text-errorPrimary text-sm'>{contentError}</div>
                }

                <h2 className='mt-9 mb-2 break-words font-medium pr-0.5 border-slate-500 max-w-max'>
                    {searchParams.get('name') ? `Results for "${searchParams.get('name')}"` : 'All Sets'}
                </h2>

                <div className='pb-4 xxs:pb-5'>
                    <SetList dataQueryKey={setsDataQueryKey} dataQueryFn={setsDataQueryFn} canPostSet={false} />
                </div>
            </ContentContainer>
        </>
    );
}

export default SetSearch;
