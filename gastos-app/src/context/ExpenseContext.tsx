import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Expense } from '../types';

// CAMBIA ESTO SEGÚN TU CASO:
const API_URL = 'http://10.0.2.2:3000/gastos'; 
// Si usas celular físico: 'http://192.168.X.X:3000/gastos'

interface ExpenseContextData {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>; // Ya no necesitamos pasar ID, Mongo lo crea
  deleteExpense: (id: string) => Promise<void>;
}

export const ExpenseContext = createContext<ExpenseContextData>({} as ExpenseContextData);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setExpenses(data);
    } catch (e) {
      console.error("Error cargando de API:", e);
    } finally {
      setLoading(false);
    }
  };

  // Nota: Ahora recibimos el gasto SIN id, porque Mongo lo genera
  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      // 1. Enviar al servidor
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      
      const newExpenseFromServer = await response.json();

      // 2. Actualizar estado local
      setExpenses((prev) => [newExpenseFromServer, ...prev]);
    } catch (e) {
      console.error("Error guardando en API:", e);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      // 1. Borrar en servidor
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      // 2. Actualizar estado local
      setExpenses((prev) => prev.filter(ex => ex.id !== id));
    } catch (e) {
      console.error("Error borrando en API:", e);
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses debe ser usado dentro de un ExpenseProvider');
  return context;
};