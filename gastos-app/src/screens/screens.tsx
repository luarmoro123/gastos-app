import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, ActivityIndicator, useTheme } from 'react-native-paper';
import { useExpenses } from '../context/ExpenseContext';

// Importamos los nuevos componentes
import { ExpenseItem } from '../components/ExpenseItem';
import { ExpenseHeader } from '../components/ExpenseHeader';
import { AddExpenseModal } from '../components/AddExpenseModal';

export const MainScreen = () => {
  const { expenses, loading, deleteExpense } = useExpenses();
  const [isModalVisible, setModalVisible] = useState(false);
  const theme = useTheme();

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem item={item} onDelete={deleteExpense} />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<ExpenseHeader expenses={expenses} />} 
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              No hay gastos registrados.
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => setModalVisible(true)}
        label="Nuevo"
      />

      <AddExpenseModal 
        visible={isModalVisible} 
        onDismiss={() => setModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 80 },
  emptyState: { marginTop: 50, alignItems: 'center', opacity: 0.7 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});