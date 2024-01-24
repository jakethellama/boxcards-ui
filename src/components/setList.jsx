import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';

function SetList({ dataQueryKey, dataQueryFn, canPost, setContentError }) {
    const authCheckQ = useAuthCheckQuery(true);
    const params = useParams();
    const queryClient = useQueryClient();

    const setsQuery = useQuery({
        queryKey: dataQueryKey,
        queryFn: dataQueryFn,

        staleTime: 0,
        retry: 1,
    });

    const postSetM = useMutation({

        mutationFn: () => axios.post('https://api.boxcards.app/api/sets', { name: 'Untitled Private Set' }).then((res) => res.data),

        onMutate: async () => {
            await queryClient.cancelQueries(['profileSetsQ', params.username]);
            const prevProfileSets = queryClient.getQueryData(['profileSetsQ', params.username]);
            const newSet = { author: authCheckQ.data.username, name: 'Untitled Private Set', isPublished: false, _id: prevProfileSets.length };
            queryClient.setQueryData(['profileSetsQ', params.username], [...prevProfileSets, newSet]);
            return { prevProfileSets };
        },
        onError: (error, zzz, context) => {
            queryClient.setQueryData(['profileSetsQ', params.username], context.prevProfileSets);
        },
        onSuccess: (data, zzz, context) => {
            queryClient.setQueryData(['profileSetsQ', params.username], [...context.prevProfileSets, data]);
        },
    });

    function handlePostSet() {
        setContentError(null);
        postSetM.mutate('zzz', {
            onError: () => {
                setContentError('Unable to create new Set, please try again');
            },
            onSuccess: () => {
                setContentError(null);
            },
        });
    }

    if (setsQuery.isError) {
        return (
            <>
                <h1 className='errorText text-errorPrimary'>An error occured while getting these sets, please try again.</h1>
            </>
        );
    } else if (setsQuery.isPending) {
        return <div>Loading Sets... </div>;
    }

    if (setsQuery.data.length === 0) {
        return (
            <>
                {
                    canPost === true && authCheckQ.data.username === params.username
                        ? <button onClick={handlePostSet} className='buttonStyle buttonSize mb-5 xxs:mb-6 '>Create New Set</button> : null
                }
                <div className=''>Oops, this has no sets yet!</div>
            </>
        );
    } else {
        return (
            <>
                {
                    canPost === true && authCheckQ.data.username === params.username
                        ? <button onClick={handlePostSet} className='buttonStyle buttonSize mb-5 xxs:mb-6'>Create New Set</button> : null
                }
                <div className='flex flex-col gap-[1.11rem]'>
                    {
                        setsQuery.data.map((set) => {
                            return <SetListEntry name={set.name} author={set.author}
                                key={set._id} authorId={set.author_id} sid={set._id} isPublished={set.isPublished}/>;
                        })
                    }
                </div>
            </>
        );
    }
}

function SetListEntry({ name, sid, author, isPublished, authorId }) {
    const queryClient = useQueryClient();

    function handleEntryClick() {
        queryClient.setQueryData(['setInfoQ', sid], { _id: sid, author, author_id: authorId, isPublished, name });
    }

    return <Link to={`/sets/${sid}`}
        onClick={handleEntryClick}
        className='buttonStyle bg-bgThree active:bg-bgFour hover:ring-white font-normal py-3 px-3.5 gap-6 flex justify-between items-center'>
        <div className='break-words overflow-auto'>{name}</div>
        <div className='text-xs sm:text-sm'>{isPublished ? 'Published' : 'Private'}</div>
    </Link>;
}

export default SetList;
