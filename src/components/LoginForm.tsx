import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Вход выполнен успешно",
        description: `Вы вошли как ${userType === 'teacher' ? 'преподаватель' : 'ученик'}`,
      });
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Потоки</CardTitle>
          <CardDescription className="text-center">
            Войдите в систему электронного журнала внеклассного обучения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" onValueChange={(value) => setUserType(value as 'student' | 'teacher')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="student">Ученик</TabsTrigger>
              <TabsTrigger value="teacher">Преподаватель</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={userType === 'student' ? "anna@example.com" : "alex@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={userType === 'student' ? "student123" : "teacher123"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Войти
                </Button>
              </div>
            </form>
            
            <TabsContent value="student">
              <div className="mt-4 text-sm text-gray-500">
                <p>Для демонстрации, используйте:</p>
                <p>Email: anna@example.com</p>
                <p>Пароль: student123</p>
              </div>
            </TabsContent>
            
            <TabsContent value="teacher">
              <div className="mt-4 text-sm text-gray-500">
                <p>Для демонстрации, используйте:</p>
                <p>Email: alex@example.com</p>
                <p>Пароль: teacher123</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
