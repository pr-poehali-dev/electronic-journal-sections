import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Student, SectionType } from '@/types';
import { useJournal } from '@/context/JournalContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { gradeColors } from '@/data/mockData';

interface StudentDetailsProps {
  student: Student | null;
  onClose: () => void;
}

const StudentDetails = ({ student, onClose }: StudentDetailsProps) => {
  const { journal, updateAttendance, updateNote, updateGrade } = useJournal();
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState<Record<string, string>>(student?.notes || {});
  const [grades, setGrades] = useState<Record<string, number>>({});

  if (!student) return null;

  const isTeacher = currentUser?.role === 'teacher';
  const canEditSection = (sectionId: string) => {
    if (!isTeacher) return false;
    return currentUser?.sections?.includes(sectionId as SectionType);
  };

  const handleNoteChange = (sectionId: SectionType, note: string) => {
    setNotes(prev => ({
      ...prev,
      [sectionId]: note
    }));
  };

  const saveNote = (sectionId: SectionType) => {
    updateNote(student.id, sectionId, notes[sectionId] || '');
  };

  const toggleAttendance = (sectionId: SectionType, value: boolean) => {
    updateAttendance(student.id, sectionId, selectedDate, value);
  };

  const handleGradeChange = (sectionId: SectionType, value: string) => {
    const grade = parseInt(value);
    if (!isNaN(grade) && grade >= 0 && grade <= 5) {
      setGrades(prev => ({
        ...prev,
        [sectionId]: grade
      }));
    }
  };

  const saveGrade = (sectionId: SectionType) => {
    if (grades[sectionId] !== undefined) {
      updateGrade(student.id, sectionId, selectedDate, grades[sectionId]);
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="attendance" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">Посещаемость</TabsTrigger>
            <TabsTrigger value="grades">Оценки</TabsTrigger>
            <TabsTrigger value="notes">Заметки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center">
                <Label className="mr-2">Дата:</Label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded p-1"
                />
              </div>
              
              {student.sections.map((sectionId) => {
                const section = journal.sections[sectionId as SectionType];
                const isPresent = student.attendance[sectionId]?.[selectedDate] || false;
                const editable = canEditSection(sectionId);
                
                return (
                  <div key={sectionId} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{section.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`attendance-${sectionId}`}>
                          {isPresent ? 'Присутствовал' : 'Отсутствовал'}
                        </Label>
                        <Switch
                          id={`attendance-${sectionId}`}
                          checked={isPresent}
                          onCheckedChange={(value) => toggleAttendance(sectionId as SectionType, value)}
                          disabled={!editable}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{section.schedule}</p>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="grades" className="space-y-4">
            <div className="flex items-center mb-4">
              <Label className="mr-2">Дата:</Label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded p-1"
              />
            </div>
            
            {student.sections.map((sectionId) => {
              const section = journal.sections[sectionId as SectionType];
              const currentGrade = student.grades?.[sectionId]?.[selectedDate] || 0;
              const editable = canEditSection(sectionId);
              
              return (
                <div key={sectionId} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{section.name}</h3>
                    <div className="flex items-center space-x-2">
                      {editable ? (
                        <>
                          <select
                            value={grades[sectionId] !== undefined ? grades[sectionId] : currentGrade}
                            onChange={(e) => handleGradeChange(sectionId as SectionType, e.target.value)}
                            className="border rounded p-1"
                          >
                            <option value="0">Н/А</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                          <Button onClick={() => saveGrade(sectionId as SectionType)} size="sm">
                            Сохранить
                          </Button>
                        </>
                      ) : (
                        <div className={`px-3 py-1 rounded-full ${gradeColors[currentGrade]}`}>
                          {currentGrade === 0 ? 'Н/А' : currentGrade}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{section.schedule}</p>
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            {student.sections.map((sectionId) => {
              const section = journal.sections[sectionId as SectionType];
              const editable = canEditSection(sectionId);
              
              return (
                <div key={sectionId} className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">{section.name}</h3>
                  {editable ? (
                    <>
                      <Textarea
                        placeholder="Заметки о прогрессе ученика..."
                        value={notes[sectionId] || ''}
                        onChange={(e) => handleNoteChange(sectionId as SectionType, e.target.value)}
                        className="mb-2"
                      />
                      <Button onClick={() => saveNote(sectionId as SectionType)} size="sm">
                        Сохранить
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm">{student.notes[sectionId] || 'Нет заметок'}</p>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetails;
