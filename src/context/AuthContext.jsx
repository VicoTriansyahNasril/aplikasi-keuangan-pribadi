/* src/context/AuthContext.jsx */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, useFirebase } from '../config/firebase';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AuthContext = createContext();

const MOCK_USER_KEY = 'financeapp_mock_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = (email, password) => {
    if (useFirebase) {
      return createUserWithEmailAndPassword(auth, email, password);
    }
    return Promise.resolve();
  };

  const login = (email, password) => {
    if (useFirebase) {
      return signInWithEmailAndPassword(auth, email, password);
    }
    const mockUser = { email, uid: 'localuser' };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    return Promise.resolve();
  };

  const logout = () => {
    if (useFirebase) {
      return signOut(auth);
    }
    localStorage.removeItem(MOCK_USER_KEY);
    setCurrentUser(null);
    return Promise.resolve();
  };

  useEffect(() => {
    if (useFirebase) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      try {
        const storedUser = localStorage.getItem(MOCK_USER_KEY);
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse mock user from localStorage", error);
        localStorage.removeItem(MOCK_USER_KEY);
      }
      setLoading(false);
    }
  }, []);

  const value = { currentUser, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};