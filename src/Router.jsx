import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Pages from './pages.jsx';
import BoxProfile from './pages/boxProfile.jsx';
import SetProfile from './pages/setProfile.jsx';
import SetSearch from './pages/setSearch.jsx';
import CardSearch from './pages/cardSearch.jsx';
import Login from './pages/login.jsx';
import Errors from './pages/errors.jsx';
import Home from './pages/home.jsx';
import SignUp from './pages/signup.jsx';

const Router = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Pages />,
            errorElement: <Errors />,
            children: [
                {
                    path: '/',
                    element: <Home />,
                },
                {
                    path: 'login',
                    element: <Login />,
                },
                {
                    path: 'signup',
                    element: <SignUp />,
                },
                {
                    path: 'boxes/:username',
                    element: <BoxProfile />,
                },
                {
                    path: 'sets',
                    element: <SetSearch />,
                },
                {
                    path: 'sets/:sid',
                    element: <SetProfile />,
                },
                {
                    path: 'cards',
                    element: <CardSearch />,
                },
            ],
        },

    ]);

    return <RouterProvider router={router} />;
};

export default Router;
