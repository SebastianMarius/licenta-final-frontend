import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import { HomePage } from './pages/HomePage';
import { AppProvider } from './components/context/AppContext';


function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/listing/:id" element={<Listing />} /> */}
        </Routes>
      </AppProvider>
    </HashRouter>
  );
}

export default App;
