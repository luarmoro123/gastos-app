export type Category = 'Comida' | 'Transporte' | 'Ocio' | 'Vivienda' | 'Otros';

export interface Expense {
  id: string;
  concept: string;
  amount: number;
  category: Category;
  date: string;
}