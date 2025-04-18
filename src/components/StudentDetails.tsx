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

interface StudentDetailsProps {
  student: Student | null;
  onClose: () => void;
}

const StudentDetails = ({ student, onClose }: StudentDetailsProps) => {
  const { journal, updateAttendance, updateNote } = useJournal();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState<Record<string, string>>(student?.notes || {});

  if (!student) return null;

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

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="attendance" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance">Посещаемость</TabsTrigger>
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
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{section.schedule}</p>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            {student.sections.map((sectionId) => {
              const section = journal.sections[sectionId as SectionType];
              return (
                <div key={sectionId} className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">{section.name}</h3>
                  <Textarea
                    placeholder="Заметки о прогрессе ученика..."
                    value={notes[sectionId] || ''}
                    onChange={(e) => handleNoteChange(sectionId as SectionType, e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={() => saveNote(sectionId as SectionType)} size="sm">
                    Сохранить
                  </Button>
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
