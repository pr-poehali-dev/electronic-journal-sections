export interface Student {
  id: string;
  name: string;
  sections: string[];
  attendance: Record<string, Record<string, boolean>>;
  notes: Record<string, string>;
  grades: Record<string, Record<string, number>>;
  email?: string;
  password?: string;
}

export interface Section {
  id: string;
  name: string;
  description: string;
  schedule: string;
  teacher: string;
}

export type SectionType = 'acting' | 'singing' | 'speech' | 'dancing';

export interface Journal {
  students: Student[];
  sections: Record<SectionType, Section>;
  teachers: Teacher[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  password: string;
  sections: SectionType[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  sections?: SectionType[];
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
