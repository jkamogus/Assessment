import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegPage from './pages/RegPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import { useEffect } from 'react';

function App() {
  useEffect (() => {
    document.documentElement.classList.add('dark')
  }, [])
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<LoginPage/>} />
        <Route path="/register" element = {<RegPage/>} />
        <Route path="/home" element = { <PrivateRoute>{<HomePage/>}</PrivateRoute> } />
        <Route path="/create-post" element = { <PrivateRoute>{<CreatePost/>}</PrivateRoute> } />
        <Route path = "/update-post" element = {<Navigate to ="/home" replace />} />
        <Route path="/update-post/:id" element = { <PrivateRoute>{<UpdatePost/>}</PrivateRoute> } />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
