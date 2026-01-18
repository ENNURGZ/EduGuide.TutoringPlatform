import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <AppRouter />
        </Router>
    );
}

export default App;
