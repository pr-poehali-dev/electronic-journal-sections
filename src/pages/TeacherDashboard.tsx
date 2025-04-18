import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import StudentCard from '@/components/StudentCard';
import StudentForm from '@/components/StudentForm';
import StudentDetails from '@/components/StudentDetails';
import { Student, SectionType } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const TeacherDashboard = () => {
  const { journal, addStudent, updateStudent, removeStudent } = useJournal();
  const { currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!currentUser) return <div>Необходима авторизация</div>;
  
  const teacherSections = currentUser.sections as SectionType[] || [];
  
  // Фильтруем студентов, которые есть в секциях данного преподавателя
  const teacherStudents = journal.students.filter(student => 
    student.sections.some(section => teacherSections.includes(section as SectionType))
  );

  // Дополнительно фильтруем по поисковому запросу
  const filteredStudents = teacherStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Получаем занятия на выбранную дату
  const getClassesForDate = () => {
    const selectedDay = new Date(selectedDate).getDay();
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const dayName = dayNames[selectedDay];
    
    return teacherSections
      .filter(sectionId => journal.sections[sectionId].schedule.includes(dayName))
      .map(sectionId => {
        const section = journal.sections[sectionId];
        const studentsInSection = teacherStudents.filter(s => s.sections.includes(sectionId));
        
        return {
          section,
          students: studentsInSection
        };
      });
  };

  const classes = getClassesForDate();

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleSaveStudent = (data: Omit<Student, 'id'> | (Omit<Student, 'id'> & { id: string })) => {
    if ('id' in data) {
      updateStudent(data.id, data);
    } else {
      addStudent(data);
    }
  };

  const confirmDeleteStudent = () => {
    if (deleteStudentId) {
      removeStudent(deleteStudentId);
      setDeleteStudentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6">
        <h2 className="text-3xl font-bold mb-6">Рабочий кабинет преподавателя</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Мои секции</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {teacherSections.map(sectionId => {
                  const section = journal.sections[sectionId];
                  const studentsCount = teacherStudents.filter(s => 
                    s.sections.includes(sectionId)
                  ).length;
                  
                  return (
                    <li key={sectionId} className="flex justify-between items-center p-2 rounded hover:bg-gray-100">
                      <span>{section.name}</span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {studentsCount} учеников
                      </span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Занятия на выбранную дату
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              
              {classes.length > 0 ? (
                <div className="space-y-4">
                  {classes.map(({ section, students }) => (
                    <div key={section.id} className="border p-3 rounded-lg">
                      <h3 className="font-medium">{section.name}</h3>
                      <p className="text-sm text-gray-600">{section.schedule}</p>
                      <div className="mt-2 flex items-center text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{students.length} учеников</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Нет занятий на выбранную дату</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="students">Мои ученики</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students">
            <div className="flex justify-between items-center mb-4 mt-4">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск учеников..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => {
                setEditingStudent(null);
                setIsFormOpen(true);
              }}>
                Добавить ученика
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map(student => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={handleEditStudent}
                  onDelete={(id) => setDeleteStudentId(id)}
                  onViewDetails={(student) => setSelectedStudent(student)}
                />
              ))}
              {filteredStudents.length === 0 && (
                <div className="col-span-3 text-center p-8 text-gray-500">
                  Ученики не найдены. Измените параметры поиска или добавьте нового ученика.
                </div>
              )}
            </div>
            
            <StudentForm
              open={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setEditingStudent(null);
              }}
              onSave={handleSaveStudent}
              student={editingStudent || undefined}
            />
            
            <StudentDetails
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
            
            <AlertDialog open={!!deleteStudentId} onOpenChange={() => setDeleteStudentId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить ученика?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Ученик будет удален из системы.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDeleteStudent}>Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;
