import { JournalProvider } from '@/context/JournalContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import StudentDashboard from '@/pages/StudentDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';

const JournalApp = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  if (currentUser?.role === 'teacher') {
    return <TeacherDashboard />;
  }
  
  return <StudentDashboard />;
};

const Index = () => (
  <AuthProvider>
    <JournalProvider>
      <JournalApp />
    </JournalProvider>
  </AuthProvider>
);

export default Index;
