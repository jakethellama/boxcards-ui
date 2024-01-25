import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import HeaderBar from '../components/headerBar.jsx';
import ContentContainer from '../components/contentContainer.jsx';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';
import SetList from '../components/setList.jsx';
import CardGrid from '../components/cardGrid.jsx';

function BoxProfile() {
    const params = useParams();
    const authCheckQ = useAuthCheckQuery(true);
    const [contentError, setContentError] = useState(null);

    const [activeTab, setActiveTab] = useState('info');
    // info, sets, cards, favs

    const curProfileInfoQ = useQuery({
        queryKey: ['profileInfoQ', params.username],
        queryFn: () => axios.get(`https://api.boxcards.app/api/boxes/${params.username}`).then((res) => res.data),
        placeholderData: { icon: '', username: '' },
        staleTime: 0,
        retry: 0,
    });

    if (authCheckQ.isError) {
        throw authCheckQ.error;
    }

    if (curProfileInfoQ.isError) {
        throw curProfileInfoQ.error;
    }

    const setsDataQueryKey = ['profileSetsQ', params.username];
    const setsDataQueryFn = () => axios.get(`https://api.boxcards.app/api/boxes/${params.username}/sets`).then((res) => res.data);

    function switchTab(tab) {
        setContentError(null);
        setActiveTab(tab);
    }

    const cardsDataQueryKey = ['profileCardsQ', params.username];
    const cardsDataQueryFn = () => axios.get(`https://api.boxcards.app/api/boxes/${params.username}/cards`).then((res) => res.data);

    const favsDataQueryKey = ['authUserFavsQ'];
    const favsDataQueryFn = () => axios.get('https://api.boxcards.app/api/authUserFavs').then((res) => (res.data));

    function activeTabContent() {
        switch (activeTab) {
            case 'info':
                return (
                    <>
                        <p className='mt-[-0.5rem] text-lg font-semibold'>Icon: <svg
                            className={'h-10 ml-0.5 fill-green-200 inline'}
                            viewBox="-1 -1 100 100"
                            xmlns="http://www.w3.org/2000/svg">
                            <defs />
                            <g transform="translate(0.44646991,0.4464699)">
                                <circle
                                    cx="48.475849"
                                    cy="48.475849"
                                    r="47.533257" />
                            </g>
                        </svg></p>
                        <p className='text-lg font-semibold'>Username: {params.username}</p>
                    </>
                );
            case 'sets':
                return <SetList dataQueryKey={setsDataQueryKey} dataQueryFn={setsDataQueryFn} canPost={true} setContentError={setContentError}/>;
            case 'cards':
                return <CardGrid canRemove={false} canPost={true} dataQueryKey={cardsDataQueryKey} dataQueryFn={cardsDataQueryFn} setContentError={setContentError} />;
            case 'favs':
                return <CardGrid canRemove={false} canPost={false} dataQueryKey={favsDataQueryKey} dataQueryFn={favsDataQueryFn} setContentError={setContentError} hasMax={true} />;
            default:
                return (
                    <div>404</div>
                );
        }
    }

    return (
        <>
            <HeaderBar />
            <ContentContainer>
                <h1 className='pt-2.5 xxs:pt-4 pb-2.5 text-3xl font-bold break-words overflow-auto'>
                    {params.username}
                </h1>

                <div className='flex gap-5 sm:gap-6 mb-3.5 '>
                    <TabButton thisTabState='info' activeTabState={activeTab} handleClick={() => switchTab('info')} text="Info"/>
                    <TabButton thisTabState='sets' activeTabState={activeTab} handleClick={() => switchTab('sets')} text="Sets"/>
                    <TabButton thisTabState='cards' activeTabState={activeTab} handleClick={() => switchTab('cards')} text="Cards"/>
                    {authCheckQ.data.username === params.username ? <TabButton thisTabState='favs' activeTabState={activeTab} handleClick={() => switchTab('favs')} text="Favorites"/> : null}
                </div>

                {
                    contentError === null ? null : <div className='mt-[-0.25rem] text-errorPrimary text-sm'>{contentError}</div>
                }

                <div className='pt-6 pb-4 xxs:pb-5'>
                    {activeTabContent()}
                </div>
            </ContentContainer>
        </>
    );
}

function TabButton({ text, activeTabState, thisTabState, handleClick }) {
    return (
        <>
            <button className={`bg-transparent px-0.5 sm:px-1 font-semibold border-b border-dividePrimary hover:border-[#f3bec7] ${activeTabState === thisTabState ? 'text-[#f3bec7]' : 'text-[rgba(255,255,255,0.3)]'}`}
                onClick={handleClick}>{text}</button>
        </>
    );
}

export default BoxProfile;
