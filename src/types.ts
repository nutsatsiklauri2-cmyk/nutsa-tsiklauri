export interface Dog {
  id: string;
  name: string;
  age: string;
  gender: 'ხვადი' | 'ძუ'; // Male or Female in Georgian
  size: 'პატარა' | 'საშუალო' | 'დიდი';
  coat: string;
  location: string;
  description: string;
  image: string;
  traits: string[];
  shelterId: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  contact: string;
  description: string;
  dogsCount: number;
  badge: string;
}

export interface SuccessStory {
  id: string;
  dogName: string;
  familyName: string;
  storyText: string;
  image: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'მოვლა' | 'კვება' | 'კანონმდებლობა' | 'ვეტერინარია';
  summary: string;
  content: string;
  readTime: string;
}
