import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("arogyaai_user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("arogyaai_user");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate API call with 1-second delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would call an authentication API
      // For demo purposes, we'll accept any email with a valid format and password length > 5
      
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("Invalid email format");
        setIsLoading(false);
        return false;
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return false;
      }
      
      // Mock user data - in a real app, this would come from the backend
      const userData: User = {
        id: "user_" + Math.random().toString(36).substring(2, 11),
        name: email.split('@')[0],
        email: email,
        role: "patient",
        profilePicture: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
      };
      
      // Store in localStorage
      localStorage.setItem("arogyaai_user", JSON.stringify(userData));
      
      setUser(userData);
      setIsLoading(false);
      return true;
      
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate API call with 1-second delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation
      if (!name || name.length < 2) {
        setError("Name must be at least 2 characters");
        setIsLoading(false);
        return false;
      }
      
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("Invalid email format");
        setIsLoading(false);
        return false;
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return false;
      }
      
      // Mock user creation - in a real app, this would call a backend API
      const userData: User = {
        id: "user_" + Math.random().toString(36).substring(2, 11),
        name: name,
        email: email,
        role: "patient",
        profilePicture: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=random`
      };
      
      // Store in localStorage
      localStorage.setItem("arogyaai_user", JSON.stringify(userData));
      
      setUser(userData);
      setIsLoading(false);
      return true;
      
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("arogyaai_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
} 