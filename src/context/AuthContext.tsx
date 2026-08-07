'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface WatchlistItem {
  id: string | number;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  backdrop?: string;
  year?: string;
  rating?: string;
  addedAt: string;
}

export interface ProgressItem {
  id: string | number;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  backdrop?: string;
  season?: number;
  episode?: number;
  progressPercent: number; // 0 to 100
  updatedAt: string;
}

interface UserData {
  username: string;
  passwordHash: string;
  watchlist: WatchlistItem[];
  continueWatching: Record<string, ProgressItem>;
}

interface AuthContextType {
  currentUser: string | null;
  watchlist: WatchlistItem[];
  continueWatching: ProgressItem[];
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  register: (username: string, password: string) => { success: boolean; message: string };
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  toggleWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  isInWatchlist: (id: string | number, type: string) => boolean;
  saveProgress: (item: Omit<ProgressItem, 'updatedAt'>) => void;
  removeProgress: (id: string | number, type: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'cscp_users_db_v1';
const CURRENT_USER_KEY = 'cscp_current_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usersDb, setUsersDb] = useState<Record<string, UserData>>({});
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentUserRef = useRef<string | null>(null);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Load user database and current session on mount
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsersDb(JSON.parse(storedUsers));
      }
      const storedSession = localStorage.getItem(CURRENT_USER_KEY);
      if (storedSession) {
        setCurrentUser(storedSession);
      }
    } catch (e) {
      console.error('Failed to load local user storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save usersDb to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersDb));
    } catch (e) {
      console.error('Failed to save user DB', e);
    }
  }, [usersDb, isLoaded]);

  // Save current session to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, currentUser);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser, isLoaded]);

  const register = useCallback((username: string, password: string) => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password) {
      return { success: false, message: 'Please enter both username and password' };
    }
    if (cleanUsername.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters' };
    }

    let isTaken = false;
    setUsersDb((prev) => {
      if (prev[cleanUsername]) {
        isTaken = true;
        return prev;
      }
      const newUser: UserData = {
        username: cleanUsername,
        passwordHash: password,
        watchlist: [],
        continueWatching: {},
      };
      return { ...prev, [cleanUsername]: newUser };
    });

    if (isTaken) {
      return { success: false, message: 'Username is already taken' };
    }

    setCurrentUser(cleanUsername);
    setIsAuthModalOpen(false);
    return { success: true, message: 'Account created successfully!' };
  }, []);

  const login = useCallback((username: string, password: string) => {
    const cleanUsername = username.trim().toLowerCase();
    let success = false;

    setUsersDb((prev) => {
      const user = prev[cleanUsername];
      if (user && user.passwordHash === password) {
        success = true;
      }
      return prev;
    });

    if (!success) {
      return { success: false, message: 'Invalid username or password' };
    }

    setCurrentUser(cleanUsername);
    setIsAuthModalOpen(false);
    return { success: true, message: 'Welcome back!' };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  // Current active user's data
  const activeUserData = currentUser ? usersDb[currentUser] : null;

  const watchlist: WatchlistItem[] = activeUserData ? activeUserData.watchlist : [];

  const continueWatching: ProgressItem[] = activeUserData
    ? Object.values(activeUserData.continueWatching).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    : [];

  const isInWatchlist = useCallback(
    (id: string | number, type: string) => {
      const activeUser = currentUserRef.current;
      if (!activeUser) return false;
      let inList = false;
      setUsersDb((prev) => {
        const u = prev[activeUser];
        if (u) {
          inList = u.watchlist.some(
            (item) => String(item.id) === String(id) && item.type === type
          );
        }
        return prev;
      });
      return inList;
    },
    []
  );

  const toggleWatchlist = useCallback(
    (item: Omit<WatchlistItem, 'addedAt'>) => {
      const activeUser = currentUserRef.current;
      if (!activeUser) {
        openAuthModal();
        return;
      }

      setUsersDb((prev) => {
        const user = prev[activeUser];
        if (!user) return prev;

        const exists = user.watchlist.some(
          (w) => String(w.id) === String(item.id) && w.type === item.type
        );

        let newWatchlist: WatchlistItem[];
        if (exists) {
          newWatchlist = user.watchlist.filter(
            (w) => !(String(w.id) === String(item.id) && w.type === item.type)
          );
        } else {
          newWatchlist = [
            ...user.watchlist,
            { ...item, addedAt: new Date().toISOString() },
          ];
        }

        return {
          ...prev,
          [activeUser]: {
            ...user,
            watchlist: newWatchlist,
          },
        };
      });
    },
    [openAuthModal]
  );

  const saveProgress = useCallback((item: Omit<ProgressItem, 'updatedAt'>) => {
    const activeUser = currentUserRef.current;
    if (!activeUser) return;

    const itemKey = `${item.type}-${item.id}`;

    setUsersDb((prev) => {
      const user = prev[activeUser];
      if (!user) return prev;

      const existing = user.continueWatching[itemKey];

      // Avoid redundant state updates if progress data is identical
      if (
        existing &&
        existing.season === item.season &&
        existing.episode === item.episode &&
        existing.progressPercent === item.progressPercent
      ) {
        return prev;
      }

      const updatedContinue = {
        ...user.continueWatching,
        [itemKey]: {
          ...item,
          updatedAt: new Date().toISOString(),
        },
      };

      return {
        ...prev,
        [activeUser]: {
          ...user,
          continueWatching: updatedContinue,
        },
      };
    });
  }, []);

  const removeProgress = useCallback((id: string | number, type: string) => {
    const activeUser = currentUserRef.current;
    if (!activeUser) return;

    const itemKey = `${type}-${id}`;
    setUsersDb((prev) => {
      const user = prev[activeUser];
      if (!user) return prev;

      const updatedContinue = { ...user.continueWatching };
      delete updatedContinue[itemKey];

      return {
        ...prev,
        [activeUser]: {
          ...user,
          continueWatching: updatedContinue,
        },
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        watchlist,
        continueWatching,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        register,
        login,
        logout,
        toggleWatchlist,
        isInWatchlist,
        saveProgress,
        removeProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
