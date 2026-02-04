import { ExpenseProvider } from '@/src/context/ExpenseContext';
import { MainScreen } from '@/src/screens/screens';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';


export default function App() {
  return (
    <ExpenseProvider>
      <PaperProvider>
        <MainScreen />
      </PaperProvider>
    </ExpenseProvider>
  );
}