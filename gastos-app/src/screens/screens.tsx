import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
// Importamos useTheme para acceder a los colores
import { Text, Card, FAB, Avatar, IconButton, ActivityIndicator, useTheme } from 'react-native-paper';
import { useExpenses } from '../context/ExpenseContext';
import { Expense } from '../types';
import { AddExpenseModal } from '../components/AddExpenseModal';

export const MainScreen = () => {
  const { expenses, loading, deleteExpense } = useExpenses();
  const [isModalVisible, setModalVisible] = useState(false);
  
  // 1. ACTIVAMOS EL HOOK DEL TEMA
  const theme = useTheme(); 

  const getIcon = (category: string) => {
    // Normalizamos a minúsculas para comparar mejor (opcional)
    const catLower = category.toLowerCase();

    if (catLower.includes('comida')) return 'food';
    if (catLower.includes('transporte')) return 'bus';
    if (catLower.includes('vivienda') || catLower.includes('casa')) return 'home';
    if (catLower.includes('ocio') || catLower.includes('juego')) return 'gamepad-variant';
    if (catLower.includes('salud') || catLower.includes('medico')) return 'medical-bag';
    if (catLower.includes('Escuela') || catLower.includes('escuela')) return 'class';
    if (catLower.includes('Viajes') || catLower.includes('viajes')) return 'aircraft';
    if (catLower.includes('Tecnologia') || catLower.includes('tecnologias')) return 'cellphone-link';
    if (catLower.includes('GYM') || catLower.includes('gym')) return 'gymnastics';
    
    
    // ICONO POR DEFECTO PARA CATEGORÍAS PERSONALIZADAS
    return 'shape'; // O puedes usar 'tag', 'label', etc.
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    // Card ya usa theme.surface automáticamente, pero podemos forzar estilos si queremos
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Title
        title={item.concept}
        titleStyle={{ color: theme.colors.onSurface }} // Texto dinámico
        subtitle={item.date}
        subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
        left={(props) => (
            <Avatar.Icon 
                {...props} 
                icon={getIcon(item.category)} 
                style={{ backgroundColor: theme.colors.primaryContainer }} // Color de fondo del icono
                color={theme.colors.onPrimaryContainer} // Color del icono
            />
        )}
        right={(props) => (
          <View style={styles.rightContainer}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              ${item.amount.toFixed(2)}
            </Text>
            <IconButton 
                {...props} 
                icon="delete" 
                iconColor={theme.colors.error} // Rojo dinámico
                onPress={() => deleteExpense(item.id)} 
            />
          </View>
        )}
      />
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    // Inyectamos el color de fondo dinámicamente aquí
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={[styles.header, { color: theme.colors.onBackground }]}>
        Mis Gastos
      </Text>
      
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.list}
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

// Dejamos en StyleSheet solo lo que es ESTRUCTURA (padding, margin, flex)
// Quitamos los colores hardcoded
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});