import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

export default function AppLayout() {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
