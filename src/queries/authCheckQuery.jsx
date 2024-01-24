import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

function useAuthCheckQuery(hasPlaceholder) {
    let placeholderData;
    if (hasPlaceholder) {
        placeholderData = { isAuth: false, username: null };
    }
    return useQuery({
        queryKey: ['authCheckQ'],

        queryFn: () => axios.get('https://api.boxcards.app/api/authCheck').then((res) => res.data),
        placeholderData,
        staleTime: 30,
        retry: 1,
    });
}

export default useAuthCheckQuery;
