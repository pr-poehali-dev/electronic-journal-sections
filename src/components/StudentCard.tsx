import { Student, SectionType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sectionColors } from '@/data/mockData';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onViewDetails: (student: Student) => void;
}

const StudentCard = ({ student, onEdit, onDelete, onViewDetails }: StudentCardProps) => {
  return (
    <Card className="w-full cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{student.name}</CardTitle>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onEdit(student);
            }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onDelete(student.id);
            }}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={() => onViewDetails(student)}>
        <div className="flex flex-wrap gap-2 mt-2">
          {student.sections.map((section) => (
            <Badge key={section} className={`${sectionColors[section as SectionType]}`}>
              {(section === 'acting' && 'Актёрское мастерство') ||
               (section === 'singing' && 'Пение') ||
               (section === 'speech' && 'Сценическая речь') ||
               (section === 'dancing' && 'Танец')}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
