export type Category = string;

export interface Expense {
  id: string;
  concept: string;
  amount: number;
  category: Category;
  date: string;
}