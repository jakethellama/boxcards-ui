import { Outlet } from 'react-router-dom';
import Footer from './components/footer.jsx';

function Pages() {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    );
}

export default Pages;
