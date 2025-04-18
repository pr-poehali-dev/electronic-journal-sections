import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJournal } from '@/context/JournalContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import GradesReport from '@/components/GradesReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarDays, ClipboardList, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { gradeColors } from '@/data/mockData';

const StudentDashboard = () => {
  const { journal } = useJournal();
  const { currentUser } = useAuth();
  
  const student = journal.students.find(s => s.id === currentUser?.id);
  if (!student) return <div>Ученик не найден</div>;

  // Находим ближайшие занятия
  const today = new Date();
  const weekday = today.getDay();
  const upcomingClasses = student.sections.map(sectionId => {
    const section = journal.sections[sectionId];
    // Получаем день недели из расписания (просто для демонстрации)
    const dayMatch = section.schedule.match(/(Понедельник|Вторник|Среда|Четверг|Пятница|Суббота|Воскресенье)/);
    const day = dayMatch ? dayMatch[0] : '';
    
    // Преобразуем в числовой день недели
    let dayNumber = -1;
    switch (day) {
      case 'Понедельник': dayNumber = 1; break;
      case 'Вторник': dayNumber = 2; break;
      case 'Среда': dayNumber = 3; break;
      case 'Четверг': dayNumber = 4; break;
      case 'Пятница': dayNumber = 5; break;
      case 'Суббота': dayNumber = 6; break;
      case 'Воскресенье': dayNumber = 0; break;
    }
    
    // Вычисляем дни до следующего занятия
    let daysUntil = dayNumber - weekday;
    if (daysUntil <= 0) daysUntil += 7; // Если день уже прошел, переходим к следующей неделе
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    
    return {
      section,
      nextDate,
      daysUntil
    };
  }).sort((a, b) => a.daysUntil - b.daysUntil);

  // Получаем последние оценки
  const recentGrades = [];
  for (const sectionId of student.sections) {
    const section = journal.sections[sectionId];
    const sectionGrades = student.grades?.[sectionId] || {};
    
    for (const [date, grade] of Object.entries(sectionGrades)) {
      recentGrades.push({
        section,
        date,
        grade
      });
    }
  }
  
  // Сортируем оценки по дате (последние сверху)
  recentGrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6">
        <h2 className="text-3xl font-bold mb-6">Привет, {student.name}! 👋</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                Ближайшее занятие
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingClasses.length > 0 ? (
                <div>
                  <h3 className="font-medium">{upcomingClasses[0].section.name}</h3>
                  <p className="text-sm text-gray-600">
                    {format(upcomingClasses[0].nextDate, 'dd.MM.yyyy')} • {upcomingClasses[0].section.schedule.split(', ')[1]}
                  </p>
                  <p className="text-sm mt-2">
                    Преподаватель: {upcomingClasses[0].section.teacher}
                  </p>
                </div>
              ) : (
                <p>Нет запланированных занятий</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Последние оценки
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentGrades.length > 0 ? (
                <div className="space-y-2">
                  {recentGrades.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.section.name}</div>
                        <div className="text-sm text-gray-600">{format(new Date(item.date), 'dd.MM.yyyy')}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${gradeColors[item.grade]}`}>
                        {item.grade === 0 ? 'Н/А' : item.grade}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Нет оценок</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ClipboardList className="mr-2 h-5 w-5" />
                Мои секции
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {student.sections.map(sectionId => (
                  <li key={sectionId} className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    {journal.sections[sectionId].name}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="progress">
          <TabsList>
            <TabsTrigger value="progress">Успеваемость</TabsTrigger>
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <div className="mt-4">
              <GradesReport studentId={student.id} />
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Моё расписание</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.sections.map(sectionId => {
                    const section = journal.sections[sectionId];
                    return (
                      <div key={sectionId} className="flex p-3 border rounded-lg">
                        <div className="mr-4 p-2 bg-blue-100 rounded-md text-blue-700">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{section.name}</h3>
                          <p className="text-sm text-gray-600">{section.schedule}</p>
                          <p className="text-sm">Преподаватель: {section.teacher}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
