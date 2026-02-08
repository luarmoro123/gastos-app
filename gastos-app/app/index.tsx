import React from 'react';
import { useColorScheme } from 'react-native'; // <--- Importante
import { PaperProvider } from 'react-native-paper';
import { LightTheme, DarkTheme } from '@/src/theme/AppTheme'; // Importa tus temas
import { ExpenseProvider } from '@/src/context/ExpenseContext';
import { MainScreen } from '@/src/screens/screens';

export default function App() {
  // 1. Detectar preferencia del sistema
  const colorScheme = useColorScheme();

  // 2. Elegir el tema correcto
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <ExpenseProvider>
      {/* 3. Pasarle el tema dinámico al Provider */}
      <PaperProvider theme={theme}>
        <MainScreen />
      </PaperProvider>
    </ExpenseProvider>
  );
}