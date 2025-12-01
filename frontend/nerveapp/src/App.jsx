import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import CreatePage from './pages/CreatePage.jsx';
import PostDetailsPage from './pages/PostDetailsPage.jsx';  
import { toast } from 'react-hot-toast';

const App = () => {
  return (
    <div data-theme="coffee">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/post/:id" element={<PostDetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;