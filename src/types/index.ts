export interface Student {
  id: string;
  name: string;
  sections: string[];
  attendance: Record<string, Record<string, boolean>>;
  notes: Record<string, string>;
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
}
