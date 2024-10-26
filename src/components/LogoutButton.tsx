// src/components/LogoutButton.tsx
import React from 'react';
import { useAuthContext } from '@/lib/AuthProvider';

const LogoutButton: React.FC = () => {
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally handle any additional cleanup or navigation here
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-primary">
      Logout
    </button>
  );
};

export default LogoutButton;
