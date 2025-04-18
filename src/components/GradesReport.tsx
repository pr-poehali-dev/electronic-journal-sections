import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJournal } from '@/context/JournalContext';
import { SectionType, Student } from '@/types';
import { gradeColors } from '@/data/mockData';

interface GradesReportProps {
  studentId: string;
}

const GradesReport = ({ studentId }: GradesReportProps) => {
  const { journal } = useJournal();

  const student = journal.students.find(s => s.id === studentId);
  if (!student) return null;

  // Вычисляем средний балл по секциям
  const averageGrades: Record<string, number> = {};
  
  student.sections.forEach(sectionId => {
    const sectionGrades = student.grades?.[sectionId] || {};
    const grades = Object.values(sectionGrades).filter(g => g > 0);
    
    if (grades.length > 0) {
      const sum = grades.reduce((acc, grade) => acc + grade, 0);
      averageGrades[sectionId] = Math.round((sum / grades.length) * 10) / 10;
    } else {
      averageGrades[sectionId] = 0;
    }
  });

  // Считаем посещаемость
  const attendance: Record<string, { present: number, total: number }> = {};
  
  student.sections.forEach(sectionId => {
    const sectionAttendance = student.attendance[sectionId] || {};
    const total = Object.keys(sectionAttendance).length;
    const present = Object.values(sectionAttendance).filter(Boolean).length;
    
    attendance[sectionId] = { present, total };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Успеваемость</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {student.sections.map(sectionId => {
            const section = journal.sections[sectionId as SectionType];
            const avgGrade = averageGrades[sectionId];
            const attendanceData = attendance[sectionId];
            
            // Определяем цвет для среднего балла
            const gradeColor = avgGrade >= 4.5 ? gradeColors[5] : 
                             avgGrade >= 3.5 ? gradeColors[4] :
                             avgGrade >= 2.5 ? gradeColors[3] :
                             avgGrade > 0 ? gradeColors[2] : gradeColors[0];
            
            // Процент посещаемости
            const attendancePercent = attendanceData.total > 0 
              ? Math.round((attendanceData.present / attendanceData.total) * 100) 
              : 0;
            
            return (
              <div key={sectionId} className="border p-3 rounded-lg">
                <h3 className="font-medium text-lg mb-2">{section.name}</h3>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Средний балл:</span>
                  <span className={`px-3 py-1 rounded-full ${gradeColor}`}>
                    {avgGrade > 0 ? avgGrade : 'Н/А'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Посещаемость:</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${attendancePercent}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      {attendancePercent}% ({attendanceData.present}/{attendanceData.total})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradesReport;
