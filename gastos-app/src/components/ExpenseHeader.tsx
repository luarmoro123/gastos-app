import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { processChartData } from '../utils/chartHelper';
import { Expense } from '../types';

interface Props {
  expenses: Expense[];
}

export const ExpenseHeader = ({ expenses }: Props) => {
  const theme = useTheme();
  const chartData = processChartData(expenses);
  const screenWidth = Dimensions.get('window').width;

  return (
    <View>
      <Text variant="headlineMedium" style={[styles.header, { color: theme.colors.onBackground }]}>
        Mis Gastos
      </Text>
      
      {expenses.length > 0 && (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[0, 0]}
            absolute
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, marginBottom: 10, fontWeight: 'bold' },
  chartContainer: { alignItems: 'center', marginBottom: 20 },
});