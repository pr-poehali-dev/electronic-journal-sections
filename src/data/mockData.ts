import { Journal, SectionType } from '@/types';

export const initialJournal: Journal = {
  students: [
    {
      id: '1',
      name: 'Анна Иванова',
      email: 'anna@example.com',
      password: 'student123',
      sections: ['acting', 'singing'],
      attendance: {
        'acting': { '2023-10-01': true, '2023-10-08': false },
        'singing': { '2023-10-02': true, '2023-10-09': true },
      },
      notes: {
        'acting': 'Отлично справляется с этюдами',
        'singing': 'Хороший вокальный диапазон'
      },
      grades: {
        'acting': { '2023-10-01': 4, '2023-10-08': 5 },
        'singing': { '2023-10-02': 5, '2023-10-09': 4 }
      }
    },
    {
      id: '2',
      name: 'Иван Петров',
      email: 'ivan@example.com',
      password: 'student123',
      sections: ['dancing', 'speech'],
      attendance: {
        'dancing': { '2023-10-03': true, '2023-10-10': true },
        'speech': { '2023-10-04': false, '2023-10-11': true },
      },
      notes: {
        'dancing': 'Быстро осваивает новые движения',
        'speech': 'Нужно работать над дикцией'
      },
      grades: {
        'dancing': { '2023-10-03': 5, '2023-10-10': 5 },
        'speech': { '2023-10-04': 3, '2023-10-11': 4 }
      }
    },
    {
      id: '3',
      name: 'Мария Сидорова',
      email: 'maria@example.com',
      password: 'student123',
      sections: ['acting', 'dancing', 'speech'],
      attendance: {
        'acting': { '2023-10-01': true, '2023-10-08': true },
        'dancing': { '2023-10-03': true, '2023-10-10': false },
        'speech': { '2023-10-04': true, '2023-10-11': true },
      },
      notes: {
        'acting': 'Отличное чувство персонажа',
        'dancing': 'Хорошая пластика',
        'speech': 'Выразительная речь'
      },
      grades: {
        'acting': { '2023-10-01': 5, '2023-10-08': 5 },
        'dancing': { '2023-10-03': 4, '2023-10-10': 0 },
        'speech': { '2023-10-04': 4, '2023-10-11': 5 }
      }
    }
  ],
  teachers: [
    {
      id: 'teacher1',
      name: 'Александр Викторович',
      email: 'alex@example.com',
      password: 'teacher123',
      sections: ['acting']
    },
    {
      id: 'teacher2',
      name: 'Елена Сергеевна',
      email: 'elena@example.com',
      password: 'teacher123',
      sections: ['singing']
    },
    {
      id: 'teacher3',
      name: 'Наталья Андреевна',
      email: 'natalia@example.com',
      password: 'teacher123',
      sections: ['speech']
    },
    {
      id: 'teacher4',
      name: 'Сергей Петрович',
      email: 'sergey@example.com',
      password: 'teacher123',
      sections: ['dancing']
    }
  ],
  sections: {
    acting: {
      id: 'acting',
      name: 'Актёрское мастерство',
      description: 'Развитие актёрских навыков, работа с этюдами, сценическое движение',
      schedule: 'Воскресенье, 10:00-12:00',
      teacher: 'Александр Викторович'
    },
    singing: {
      id: 'singing',
      name: 'Пение',
      description: 'Вокал, работа с дыханием, развитие музыкального слуха',
      schedule: 'Понедельник, 15:00-17:00',
      teacher: 'Елена Сергеевна'
    },
    speech: {
      id: 'speech',
      name: 'Сценическая речь',
      description: 'Дикция, постановка голоса, ораторское искусство',
      schedule: 'Среда, 16:00-18:00',
      teacher: 'Наталья Андреевна'
    },
    dancing: {
      id: 'dancing',
      name: 'Танец',
      description: 'Хореография, пластика, ритмика',
      schedule: 'Вторник, 18:00-20:00',
      teacher: 'Сергей Петрович'
    }
  }
};

export const sectionColors: Record<SectionType, string> = {
  acting: 'bg-blue-100 border-blue-300 text-blue-800',
  singing: 'bg-green-100 border-green-300 text-green-800',
  speech: 'bg-purple-100 border-purple-300 text-purple-800',
  dancing: 'bg-yellow-100 border-yellow-300 text-yellow-800'
};

export const gradeColors: Record<number, string> = {
  0: 'bg-gray-100 text-gray-800',
  1: 'bg-red-100 text-red-800',
  2: 'bg-red-100 text-red-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-green-100 text-green-800',
  5: 'bg-green-200 text-green-800'
};
