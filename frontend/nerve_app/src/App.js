import { Routes, Route } from 'react-router-dom';

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import PostDetailPage from "./pages/PostDetailPage";
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import "./App.css";


const App = () => {
  return (
    <div className="app">
      <div className="feed">
        <TopBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
        </Routes>
      </div>
      <div className="bar">
        <BottomNav />
      </div>
      
    </div>
    
  );
};
export default App;

