import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import HeaderBar from '../components/headerBar.jsx';
import ContentContainer from '../components/contentContainer.jsx';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';
import CardGrid from '../components/cardGrid.jsx';
import SetPatchDropDown from '../components/setPatchDropDown.jsx';
import EditableText from '../components/editableText.jsx';

function SetProfile() {
    const params = useParams();
    const authCheckQ = useAuthCheckQuery(true);
    const [contentError, setContentError] = useState(null);
    const [isNameTextOpen, setIsNameTextOpen] = useState(false);

    const curSetInfoQ = useQuery({
        queryKey: ['setInfoQ', params.sid],
        queryFn: () => axios.get(`http://localhost:3000/api/sets/${params.sid}`).then((res) => res.data),
        placeholderData: { author: '', name: '', isPublished: true },
        retry: 0,
    });

    const cardsDataQueryKey = ['setCardsQ', params.sid];
    const cardsDataQueryFn = () => axios.get(`http://localhost:3000/api/sets/${params.sid}/cards`).then((res) => res.data);

    if (curSetInfoQ.isPending) {
        return <div>placeholder data skips this</div>;
    } else if (curSetInfoQ.isError) {
        throw curSetInfoQ.error;
    }

    if (authCheckQ.isError) {
        throw authCheckQ.error;
    }

    return (
        <>
            <HeaderBar />
            <ContentContainer>
                <div className={'pt-2.5 xxs:pt-4 pb-3 flex justify-between'}>
                    <h1 className={'text-3xl font-bold flex-1 mr-8 break-words overflow-auto'}> {curSetInfoQ.isPlaceholderData || (curSetInfoQ.data.isPublished === false && authCheckQ.data.username !== curSetInfoQ.data.author) ? null
                        : <EditableText textValue={curSetInfoQ.data.name} textRenderQueryKey={['setInfoQ', params.sid]}
                            open={isNameTextOpen} setOpen={setIsNameTextOpen} setErrorMessage={setContentError}
                            patchURL={`http://localhost:3000/api/sets/${params.sid}`} extraBody={{ isPublished: false }}
                            isName={true} maxLen={50} bgColor={'bgPrimary'} />}
                    </h1>
                    {
                        curSetInfoQ.isPlaceholderData ? '' : <p className='text-sm self-start'>{curSetInfoQ.data.isPublished ? 'Published' : 'Private'}</p>
                    }
                </div>

                <div className={`${contentError === null ? 'mb-4' : 'mb-2.5'} flex justify-between`}>
                    <div className=''>
                        {
                            curSetInfoQ.data.author === null ? null : <div className='relative inline-block peer cursor-pointer'>
                                <Link className='absolute h-full w-full top-0 left-0' to={`/boxes/${curSetInfoQ.data.author}`}></Link>
                                <svg
                                    className={'h-9 inline-block fill-green-200 ' }
                                    viewBox="0 0 99 99"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <defs />
                                    <g transform="translate(0.44646991,0.4464699)">
                                        <circle
                                            cx="48.475849"
                                            cy="48.475849"
                                            r="47.533257" />
                                    </g>
                                </svg>
                            </div>
                        }
                        <Link to={`/boxes/${curSetInfoQ.data.author}`} className='ml-3 inline-block font-medium cursor-pointer hover:text-fillPrimary peer-hover:text-fillPrimary '>{curSetInfoQ.data.author}</Link>
                    </div>

                    <div className='mt-[-0.2rem]'>
                        {
                            (curSetInfoQ.data.isPublished === false) && (authCheckQ.data.username === curSetInfoQ.data.author)
                                ? <SetPatchDropDown setIsNameTextOpen={setIsNameTextOpen} nameValue={curSetInfoQ.data.name} setErrorMessage={setContentError}/>
                                : null
                        }
                    </div>
                </div>

                {
                    contentError === null ? null : <div className='mt-2.5 mb-[-0.25rem] text-errorPrimary text-sm'>{contentError}</div>
                }

                <div className='pt-8 pb-4 xxs:pb-5'>
                    <CardGrid canRemove={true} canPost={false} dataQueryKey={cardsDataQueryKey} dataQueryFn={cardsDataQueryFn} hasMax={true} />
                </div>

            </ContentContainer>
        </>
    );
}

export default SetProfile;
