import { Routes, Route } from 'react-router-dom';

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import PostDetailPage from "./pages/PostDetailPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
      </Routes>
    </div>
  );
};
export default App;
