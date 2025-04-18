import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Student, SectionType } from '@/types';

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id'> | (Omit<Student, 'id'> & { id: string })) => void;
  student?: Student;
}

const StudentForm = ({ open, onClose, onSave, student }: StudentFormProps) => {
  const [name, setName] = useState(student?.name || '');
  const [sections, setSections] = useState<string[]>(student?.sections || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedStudent = {
      ...student && { id: student.id },
      name,
      sections,
      attendance: student?.attendance || {},
      notes: student?.notes || {}
    };
    
    onSave(updatedStudent);
    onClose();
  };

  const handleSectionToggle = (section: string) => {
    setSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{student ? 'Редактировать ученика' : 'Добавить ученика'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Имя
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Секции</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="acting" 
                    checked={sections.includes('acting')}
                    onCheckedChange={() => handleSectionToggle('acting')}
                  />
                  <Label htmlFor="acting">Актёрское мастерство</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="singing" 
                    checked={sections.includes('singing')}
                    onCheckedChange={() => handleSectionToggle('singing')}
                  />
                  <Label htmlFor="singing">Пение</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="speech" 
                    checked={sections.includes('speech')}
                    onCheckedChange={() => handleSectionToggle('speech')}
                  />
                  <Label htmlFor="speech">Сценическая речь</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="dancing" 
                    checked={sections.includes('dancing')}
                    onCheckedChange={() => handleSectionToggle('dancing')}
                  />
                  <Label htmlFor="dancing">Танец</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
