import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { JournalProvider, useJournal } from '@/context/JournalContext';
import StudentCard from '@/components/StudentCard';
import SectionCard from '@/components/SectionCard';
import StudentForm from '@/components/StudentForm';
import StudentDetails from '@/components/StudentDetails';
import { Student, SectionType } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const JournalApp = () => {
  const { journal, addStudent, updateStudent, removeStudent } = useJournal();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);

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

  const filteredStudents = journal.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = selectedSection ? student.sections.includes(selectedSection) : true;
    return matchesSearch && matchesSection;
  });

  const getSectionStudentCount = (sectionId: SectionType) => {
    return journal.students.filter(student => student.sections.includes(sectionId)).length;
  };

  const handleSectionClick = (sectionId: SectionType) => {
    setSelectedSection(prev => prev === sectionId ? null : sectionId);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="py-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Потоки</h1>
        <p className="text-gray-600 text-center mb-6">Электронный журнал внеклассного обучения</p>
      </header>

      <Tabs defaultValue="students">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Ученики</TabsTrigger>
          <TabsTrigger value="sections">Секции</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
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

          {selectedSection && (
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                <span>Фильтр: {journal.sections[selectedSection].name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-5 w-5 p-0" 
                  onClick={() => setSelectedSection(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
          )}

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
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(journal.sections).map(([id, section]) => (
              <SectionCard
                key={id}
                section={section}
                type={id as SectionType}
                studentCount={getSectionStudentCount(id as SectionType)}
                onClick={() => handleSectionClick(id as SectionType)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
    </div>
  );
};

const Index = () => (
  <JournalProvider>
    <JournalApp />
  </JournalProvider>
);

export default Index;
