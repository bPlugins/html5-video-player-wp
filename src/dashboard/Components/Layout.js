import { Outlet, Link, useLocation } from 'react-router-dom';

import Header from '../../../../bpl-tools/Admin/Header';

const navigation = [
    { name: 'Welcome', href: '/welcome' },
    { name: 'Demos', href: '/demos' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Feature Comparison', href: '/feature-comparison' },
];

const Layout = (props) => {
    const location = useLocation();
    const { setupUrl } = props;

    return <div className='bPlDashboard'>
        <Header {...props}>
            <nav className='bPlDashboardNav'>
                {navigation
                    ?.map((item, index) => <Link
                        key={index}
                        to={item.href}
                        className={`navLink ${location.pathname === item.href || (location.pathname === '/' && item.href === '/welcome') ? 'active' : ''}`}
                    >
                        {item.name}
                    </Link>)}

                {/* Full page load, not a router Link — the wizard is its own PHP screen. */}
                {setupUrl && <a className='navLink' href={setupUrl}>Guided Setup</a>}
            </nav>
        </Header>

        <main className='bPlDashboardMain'>
            <Outlet />
        </main>
    </div>
}
export default Layout;