import { Journal, SectionType } from '@/types';

export const initialJournal: Journal = {
  students: [
    {
      id: '1',
      name: 'Анна Иванова',
      sections: ['acting', 'singing'],
      attendance: {
        'acting': { '2023-10-01': true, '2023-10-08': false },
        'singing': { '2023-10-02': true, '2023-10-09': true },
      },
      notes: {
        'acting': 'Отлично справляется с этюдами',
        'singing': 'Хороший вокальный диапазон'
      }
    },
    {
      id: '2',
      name: 'Иван Петров',
      sections: ['dancing', 'speech'],
      attendance: {
        'dancing': { '2023-10-03': true, '2023-10-10': true },
        'speech': { '2023-10-04': false, '2023-10-11': true },
      },
      notes: {
        'dancing': 'Быстро осваивает новые движения',
        'speech': 'Нужно работать над дикцией'
      }
    },
    {
      id: '3',
      name: 'Мария Сидорова',
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
      }
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
