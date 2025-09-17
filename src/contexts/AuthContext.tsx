import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type UserRole = 'processor' | 'lab-technician' | 'manufacturer';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [user, setUser] = useState<User | null>(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  useEffect(() => {
    // Simulate checking for existing session on initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const defaultCredentials = {
      'processor@example.com': { password: 'password', role: 'processor' as const },
      'lab@example.com': { password: 'password', role: 'lab-technician' as const },
      'manufacturer@example.com': { password: 'password', role: 'manufacturer' as const },
    };

    const userCreds = defaultCredentials[email as keyof typeof defaultCredentials];
    
    if (userCreds && userCreds.password === password) {
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        role: userCreds.role,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
