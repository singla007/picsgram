import React from 'react';
import CreatePost from './CreatePost';
import { Navigate, Route, Routes } from 'react-router-dom';
import SearchPost from './SearchPost';
import SignIn from './SignIn';
import SignUp from './SignUp';
import DashBoard from './Dashboard';
import Posts from './Posts';
import TopPosts from './TopPosts';

const App = () => (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Dashboard" element={<DashBoard />} />
      <Route path="/new" element={<Navigate replace to="/new/1" />} />
      <Route path="/new/:page" element={<Posts />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/search" element={<SearchPost />} />
      <Route path="/top" element={<TopPosts />} />
    </Routes>
);

export default App;
