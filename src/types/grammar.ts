export type GrammarTopic = {
  id: string;
  title: string;
  description: string;
  sentences?: string[];
};

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'simple-present',
    title: 'Simple Present',
    description: 'Used for habits, routines, and general truths',
    sentences: [
      'I play tennis every weekend',
      'She works in a hospital',
      'They live in London',
      'The sun rises in the east',
      'He speaks three languages'
    ]
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    description: 'Used for actions happening now or temporary situations',
    sentences: [
      'I am reading a book right now',
      'They are playing football in the park',
      'She is studying for her exam',
      'We are having dinner',
      'He is working on a new project'
    ]
  },
  {
    id: 'simple-past',
    title: 'Simple Past',
    description: 'Used for completed actions in the past',
    sentences: [
      'I visited Paris last summer',
      'She bought a new car yesterday',
      'They watched a movie last night',
      'He finished work early',
      'We played tennis on Sunday'
    ]
  },
  {
    id: 'past-continuous',
    title: 'Past Continuous',
    description: 'Used for actions that were in progress in the past',
    sentences: [
      'I was reading when you called',
      'They were playing while it was raining',
      'She was working late last night',
      'We were having dinner at 8 PM',
      'He was studying all evening'
    ]
  },
  {
    id: 'present-perfect',
    title: 'Present Perfect',
    description: 'Used for past actions with present relevance',
    sentences: [
      'I have visited Paris three times',
      'She has lived here for five years',
      'They have just arrived',
      'We have never seen that movie',
      'He has already finished the work'
    ]
  },
  {
    id: 'simple-future',
    title: 'Simple Future',
    description: 'Used for predictions and future plans',
    sentences: [
      'I will travel to Japan next year',
      'They will arrive tomorrow morning',
      'She will help us later',
      'We will meet at the station',
      'He will finish the project soon'
    ]
  },
  {
    id: 'future-continuous',
    title: 'Future Continuous',
    description: 'Used for actions that will be in progress in the future',
    sentences: [
      'I will be working at 9 AM tomorrow',
      'They will be traveling all day',
      'She will be studying when you arrive',
      'We will be having dinner at 8 PM',
      'He will be presenting his project'
    ]
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    description: 'Used to express hypothetical situations',
    sentences: [
      'If it rains, I will stay home',
      'If I had more time, I would travel more',
      'If you study hard, you will pass the exam',
      'If I were you, I would accept the offer',
      'If we had known earlier, we would have helped'
    ]
  }
];