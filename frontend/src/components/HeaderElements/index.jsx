import { Link } from 'react-router-dom';
import './HeaderElements.css';

const HeaderElements = () => {
    return (
        <header className="about-us-header">
            <div className="header-left">
                <h1><Link to="/home">MHARA ESTATE HOME |</Link></h1>
            </div>
            <nav className="header-right">
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/catalogo">Catalogo</Link></li>
                    <li><Link to="/contactanos">Contactanos</Link></li>
                    <li><Link to="/asesores">Asesores</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default HeaderElements;