import Sidebar from "./components/sidebar";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import styled from "styled-components";

import Header from "./components/header";
import Footer from "./components/footer";

import Dashboard from './main_pages/dashborad';
import History from './main_pages/history';
import Data from './main_pages/data';
import Profile from './main_pages/profile';
import LoginRegister from "./main_pages/login-register";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";

const MainLayout = styled.div({
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '300px auto',
})

const PageContent = styled.div({
  position: 'relative',
  background: '#F3F3F3',
})

function App() {
  const [user, setUser] = useState(null)
  
  const navigate = useNavigate()
  
  const GetUserFromToken = async () => {
    const token = localStorage.getItem('token')

    if(!token){
        return null
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/auth/get-user-with-token`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data
        if(!data){
            throw new Error('Failed to fetch data.')
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid response format. Expected JSON.");
        }

        return data.data
    } catch (error) {
        console.error('Error fetching user: ', error)
        return null
    }
  }

  const FetchUser = async () => {
    const userData = await GetUserFromToken()
      setUser(userData)

    if(!userData) {
      navigate('/auth')
    }
    else{
      navigate('/')
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      await FetchUser()
    }

    fetchData()
  }, [])

  return (
    <MainLayout>
        <Sidebar user={user} />

        <PageContent>
          <Header />
          
          <Routes>
            <Route path="auth" element={<LoginRegister FetchUser={FetchUser} />} />
            <Route element={<Dashboard />} index />
            <Route path='history' element={<History />} />
            <Route path='data' element={<Data />} />
            <Route path='profile' element={<Profile user={user} FetchUser={FetchUser} />} />
          </Routes>

          <Footer />
          
        </PageContent>

    </MainLayout>
  );
}

export default App;
