import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB, Avatar, IconButton, ActivityIndicator } from 'react-native-paper';
import { useExpenses } from '../context/ExpenseContext';
import { Expense } from '../types';
import { AddExpenseModal } from '../components/AddExpenseModal'; // Importamos el modal

export const MainScreen = () => {
  const { expenses, loading, deleteExpense } = useExpenses();
  const [isModalVisible, setModalVisible] = useState(false);

  // Función para obtener icono según categoría (Opcional, pero se ve genial)
  const getIcon = (category: string) => {
    switch (category) {
      case 'Comida': return 'food';
      case 'Transporte': return 'bus';
      case 'Vivienda': return 'home';
      case 'Ocio': return 'gamepad-variant';
      default: return 'shape';
    }
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.concept}
        subtitle={item.date}
        left={(props) => <Avatar.Icon {...props} icon={getIcon(item.category)} size={40} />}
        right={(props) => (
          <View style={styles.rightContainer}>
            <Text variant="titleMedium" style={styles.amount}>
              ${item.amount.toFixed(2)}
            </Text>
            <IconButton {...props} icon="delete" onPress={() => deleteExpense(item.id)} />
          </View>
        )}
      />
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>Mis Gastos</Text>
      
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="bodyLarge">No hay gastos registrados.</Text>
          </View>
        }
      />

      {/* Botón Flotante */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        label="Nuevo"
      />

      {/* Modal Formulario */}
      <AddExpenseModal 
        visible={isModalVisible} 
        onDismiss={() => setModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50, // Ajuste para barra de estado
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  amount: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginRight: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
    opacity: 0.5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});