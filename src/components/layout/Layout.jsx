import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TodoScreen from '../../screens/TodoScreen';
import Default from '../../screens/Default';
import CompanyScreen from '../../screens/CompanyScreen';
import TeamScreen from '../../screens/TeamScreen';
import UserScreen from '../../screens/UserScreen';
import { useAuthStore } from '../../stores/authStore';

export function Layout() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.reset);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar user={user} signOut={signOut} />
        <Box component="main" sx={{ flex: 1, p: 3, bgcolor: 'background.default' }}>
          <Routes>
            <Route path="/" element={<Default />} />
            <Route path="/dashboard" element={<Default />} />
            <Route path="/welcome" element={<Default />} />
            <Route path="/team" element={<TeamScreen />} />
            <Route path="/company" element={<CompanyScreen />} />
            <Route path="/users" element={<UserScreen />} />
            <Route path="/contacts" element={<Default />} />
            <Route path="/verify-sam" element={<Default />} />
            <Route path="/opportunities" element={<Default />} />
            <Route path="/pipeline" element={<Default />} />
            <Route path="/awards" element={<Default />} />
            <Route path="/invoices" element={<Default />} />
            <Route path="/company-admin" element={<Default />} />
            <Route path="/team-admin" element={<Default />} />
            <Route path="/account-admin" element={<Default />} />
            <Route path="/color-sections" element={<Default />} />
            <Route path="/menu-manager" element={<Default />} />
            <Route path="/todos" element={<TodoScreen />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}