import { createContext, useContext, useState, ReactNode } from 'react';
import { Journal, Student, Section, SectionType } from '@/types';
import { initialJournal } from '@/data/mockData';

interface JournalContextType {
  journal: Journal;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  updateAttendance: (studentId: string, sectionId: SectionType, date: string, present: boolean) => void;
  updateNote: (studentId: string, sectionId: SectionType, note: string) => void;
  updateGrade: (studentId: string, sectionId: SectionType, date: string, grade: number) => void;
  updateSection: (id: SectionType, data: Partial<Section>) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [journal, setJournal] = useState<Journal>(initialJournal);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      grades: student.grades || {},
    };
    
    setJournal(prev => ({
      ...prev,
      students: [...prev.students, newStudent]
    }));
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setJournal(prev => ({
      ...prev,
      students: prev.students.map(student => 
        student.id === id ? { ...student, ...data } : student
      )
    }));
  };

  const removeStudent = (id: string) => {
    setJournal(prev => ({
      ...prev,
      students: prev.students.filter(student => student.id !== id)
    }));
  };

  const updateAttendance = (studentId: string, sectionId: SectionType, date: string, present: boolean) => {
    setJournal(prev => ({
      ...prev,
      students: prev.students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            attendance: {
              ...student.attendance,
              [sectionId]: {
                ...(student.attendance[sectionId] || {}),
                [date]: present
              }
            }
          };
        }
        return student;
      })
    }));
  };

  const updateGrade = (studentId: string, sectionId: SectionType, date: string, grade: number) => {
    setJournal(prev => ({
      ...prev,
      students: prev.students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            grades: {
              ...student.grades,
              [sectionId]: {
                ...(student.grades?.[sectionId] || {}),
                [date]: grade
              }
            }
          };
        }
        return student;
      })
    }));
  };

  const updateNote = (studentId: string, sectionId: SectionType, note: string) => {
    setJournal(prev => ({
      ...prev,
      students: prev.students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            notes: {
              ...student.notes,
              [sectionId]: note
            }
          };
        }
        return student;
      })
    }));
  };

  const updateSection = (id: SectionType, data: Partial<Section>) => {
    setJournal(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [id]: {
          ...prev.sections[id],
          ...data
        }
      }
    }));
  };

  return (
    <JournalContext.Provider value={{
      journal,
      addStudent,
      updateStudent,
      removeStudent,
      updateAttendance,
      updateNote,
      updateGrade,
      updateSection
    }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
