import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types'; // Asumo que creamos este archivo antes

// 1. DEFINICIÓN DE TIPOS
// Qué datos y funciones va a "exportar" este contexto a los demás componentes
interface ExpenseContextData {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>; // Agregué borrar, es muy útil
}

interface ExpenseProviderProps {
  children: ReactNode;
}

// 2. CREACIÓN DEL CONTEXTO
// Se inicializa vacío, pero TypeScript sabe qué forma tendrá gracias a la interfaz
export const ExpenseContext = createContext<ExpenseContextData>({} as ExpenseContextData);

// 3. EL PROVIDER (La Lógica)
export const ExpenseProvider = ({ children }: ExpenseProviderProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar gastos al abrir la app
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@expenses_key');
      if (jsonValue != null) {
        setExpenses(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Expense) => {
    const newExpenses = [expense, ...expenses]; // Agrega al principio del array
    setExpenses(newExpenses);
    await saveToStorage(newExpenses);
  };

  const deleteExpense = async (id: string) => {
    const newExpenses = expenses.filter(ex => ex.id !== id);
    setExpenses(newExpenses);
    await saveToStorage(newExpenses);
  };

  // Función auxiliar para no repetir código de AsyncStorage
  const saveToStorage = async (data: Expense[]) => {
    try {
      await AsyncStorage.setItem('@expenses_key', JSON.stringify(data));
    } catch (e) {
      console.error("Error guardando datos:", e);
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

// 4. CUSTOM HOOK (Para usarlo fácil)
// Esto te evita importar useContext en cada pantalla.
// Solo importas: const { expenses } = useExpenses();
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses debe ser usado dentro de un ExpenseProvider');
  }
  return context;
};