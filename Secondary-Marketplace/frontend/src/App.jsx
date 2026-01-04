import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MarketplacePage from './pages/MarketplacePage';
import CartPage from './pages/CartPage';
import './styles/index.css';

function App() {
    return (
        <Router>
            <div style={{ minHeight: '100vh' }}>
                {/* Header */}
                <header style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '1rem 0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <div className="container" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Link to="/" style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: 'white',
                            textDecoration: 'none'
                        }}>
                            🏪 Service Marketplace
                        </Link>

                        <nav style={{ display: 'flex', gap: '1.5rem' }}>
                            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
                                Browse Services
                            </Link>
                            <Link to="/cart" style={{
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: '500',
                                position: 'relative'
                            }}>
                                🛒 Cart
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main>
                    <Routes>
                        <Route path="/" element={<MarketplacePage />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer style={{
                    backgroundColor: '#1f2937',
                    color: 'white',
                    padding: '2rem 0',
                    marginTop: '4rem',
                    textAlign: 'center'
                }}>
                    <div className="container">
                        <p>© 2025 Service Marketplace. Built with ❤️ using MERN Stack + AI</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
