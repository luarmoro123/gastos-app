import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Definimos el tema CLARO extendiendo el de Paper
export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',         // Tu color principal
    background: '#F2F4F8',      // Fondo general
    surface: '#FFFFFF',         // Fondo de tarjetas
    text: '#000000',            // Texto principal
    error: '#B00020',
  },
};

// Definimos el tema OSCURO extendiendo el de Paper
export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',         // En modo oscuro los primarios suelen ser más pasteles
    background: '#121212',      // Fondo casi negro (estándar Material)
    surface: '#1E1E1E',         // Tarjetas un poco más claras que el fondo
    text: '#FFFFFF',
    error: '#CF6679',
  },
};