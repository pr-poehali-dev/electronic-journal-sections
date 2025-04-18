import { Section, SectionType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users } from 'lucide-react';
import { sectionColors } from '@/data/mockData';

interface SectionCardProps {
  section: Section;
  type: SectionType;
  studentCount: number;
  onClick: () => void;
}

const SectionCard = ({ section, type, studentCount, onClick }: SectionCardProps) => {
  return (
    <Card 
      className={`w-full cursor-pointer hover:shadow-md transition-shadow border-l-4 ${sectionColors[type]}`} 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{section.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3 text-gray-600">{section.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>{section.schedule}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{studentCount} учеников</span>
          </div>
        </div>
        <p className="text-sm mt-2">Преподаватель: {section.teacher}</p>
      </CardContent>
    </Card>
  );
};

export default SectionCard;
