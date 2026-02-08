import { Expense } from '../types';

// Colores para el gráfico (puedes agregar más si quieres)
const CHART_COLORS = [
  '#FF6384', // Rojo suave
  '#36A2EB', // Azul
  '#FFCE56', // Amarillo
  '#4BC0C0', // Verde agua
  '#9966FF', // Violeta
  '#FF9F40', // Naranja
  '#C9CBCF', // Gris
];

export const processChartData = (expenses: Expense[]) => {
  // 1. Agrupar y sumar por categoría
  const categoryTotals: Record<string, number> = {};

  expenses.forEach((expense) => {
    // Si la categoría ya existe, sumamos; si no, la iniciamos en 0
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  // 2. Transformar al formato que pide react-native-chart-kit
  const chartData = Object.keys(categoryTotals).map((category, index) => {
    return {
      name: category,
      population: categoryTotals[category], // El valor numérico
      color: CHART_COLORS[index % CHART_COLORS.length], // Asigna un color cíclicamente
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    };
  });

  return chartData;
};