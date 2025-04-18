import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Потоки</h1>
          <p className="text-sm text-gray-600">Электронный журнал внеклассного обучения</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">{currentUser?.name}</p>
            <p className="text-sm text-gray-600">
              {currentUser?.role === 'teacher' ? 'Преподаватель' : 'Ученик'}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
