import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todaysChallenge, setTodaysChallenge] = useState(null);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  const reload = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setTodaysChallenge(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setUser(null);
        setTodaysChallenge(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data);

      // fetch today's challenge
      setLoadingChallenge(true);
      try {
        const chRes = await fetch('http://localhost:8080/api/users/me/challenge', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (chRes.status === 204) {
          setTodaysChallenge(null);
        } else if (!chRes.ok) {
          setTodaysChallenge(null);
        } else {
          const chData = await chRes.json();
          setTodaysChallenge(chData.challenge || null);
        }
      } catch (err) {
        console.error('Failed to fetch todays challenge', err);
        setTodaysChallenge(null);
      } finally {
        setLoadingChallenge(false);
      }
    } catch (err) {
      console.error('Failed to fetch current user', err);
      setUser(null);
      setTodaysChallenge(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTodaysChallenge(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, reload, logout, todaysChallenge, loadingChallenge }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
