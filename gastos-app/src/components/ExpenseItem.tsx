import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Avatar, IconButton, useTheme } from 'react-native-paper';
import { Expense } from '../types';

interface Props {
  item: Expense;
  onDelete: (id: string) => void;
}
{/* --- COMPONENTE ITEM --- */}
export const ExpenseItem = ({ item, onDelete }: Props) => {
  const theme = useTheme();

  const getIcon = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower.includes('comida')) return 'food';
    if (catLower.includes('transporte')) return 'bus';
    if (catLower.includes('vivienda') || catLower.includes('casa')) return 'home';
    if (catLower.includes('ocio') || catLower.includes('juego')) return 'gamepad-variant';
    if (catLower.includes('salud') || catLower.includes('medico')) return 'medical-bag';
    if (catLower.includes('escuela')) return 'school';
    if (catLower.includes('viajes')) return 'airplane';
    if (catLower.includes('tecnologia')) return 'cellphone-link';
    if (catLower.includes('gym')) return 'weight-lifter';
    return 'shape';
  };
  {/* --------------------------------------*/}


  {/* --- CARD GASTOS --- */}
  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Title
        title={item.concept}
        titleStyle={{ color: theme.colors.onSurface }}
        subtitle={item.date}
        subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
        left={(props) => (
          <Avatar.Icon 
            {...props} 
            icon={getIcon(item.category)} 
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer} 
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
              iconColor={theme.colors.error} 
              onPress={() => onDelete(item.id)} 
            />
          </View>
        )}
      />
    </Card>
  );
};
{/* -------------------------------------- */}

{/* --- ESTILOS --- */}
const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  rightContainer: { flexDirection: 'row', alignItems: 'center' },
});
{/* -------------------------------------- */}  