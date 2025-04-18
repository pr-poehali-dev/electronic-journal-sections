import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { initialJournal } from '@/data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь в localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Проверка учителей
    const teacher = initialJournal.teachers.find(
      t => t.email === email && t.password === password
    );
    
    if (teacher) {
      const userData: User = {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        sections: teacher.sections
      };
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    
    // Проверка учеников
    const student = initialJournal.students.find(
      s => s.email === email && s.password === password
    );
    
    if (student) {
      const userData: User = {
        id: student.id,
        name: student.name,
        email: student.email || '',
        role: 'student'
      };
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
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
