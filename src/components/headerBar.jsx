import NavDropDown from './navDropDown.jsx';
import CardSearchBar from './cardSearchBar.jsx';
import HeaderRightIcon from './headerRightIcon.jsx';
import NavLogoContainer from './navLogoContainer.jsx';

function HeaderBar() {
    return (
        <nav className="px-3.5 xxs:px-5 py-4 flex flex-wrap gap-x-6 gap-y-4 justify-between items-center bg-bgPrimary border-b-[1px] border-dividePrimary sticky top-0 z-[100]">
            <NavDropDown />

            <NavLogoContainer />

            <div className='flex-1 order-last'>
                <CardSearchBar />
            </div>

            <div className='flex-none sm:order-last'>
                <HeaderRightIcon />
            </div>
        </nav>
    );
}

export default HeaderBar;
