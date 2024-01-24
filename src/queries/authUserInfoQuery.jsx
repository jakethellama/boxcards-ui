import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

function useAuthUserInfoQuery() {
    const placeholderData = { icon: null, favsIds: null, isAuth: false, username: null };
    return useQuery({
        queryKey: ['authUserInfoQ'],

        queryFn: () => axios.get('https://api.boxcards.app/api/authUserInfo').then((res) => res.data),
        placeholderData,
        staleTime: 100,
    });
}

export default useAuthUserInfoQuery;
