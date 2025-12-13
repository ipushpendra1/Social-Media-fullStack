import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import Conversation from './pages/Conversation.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Profile from './pages/Profile.jsx'
import UserSearch from './pages/UserSearch.jsx'

export default function App() {
  return (
    <div className="app">
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          {/* Auth routes without layout (no navigation) */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* App routes with layout (with navigation) - Protected */}
          <Route element={<Layout />}>
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/conversation" 
              element={
                <ProtectedRoute>
                  <Conversation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-post" 
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-search" 
              element={
                <ProtectedRoute>
                  <UserSearch />
                </ProtectedRoute>
              } 
            />
          </Route>
          <Route path="*" element={<h2 style={{ padding: 16 }}>404 - Not Found</h2>} />
        </Routes>
      </div>
    </div>
  )
}