import { appConfig } from '../../config';
import './Layout.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <p>&copy; {currentYear} <strong>{appConfig.name}</strong>. Todos los derechos reservados.</p>
                </div>
                <div className="footer-center">
                    <p className="version-pill">v{appConfig.version}</p>
                </div>
                <div className="footer-right">
                    <p>Desarrollado para Litoral Citrus 🍊</p>
                </div>
            </div>
        </footer>
    );
}
