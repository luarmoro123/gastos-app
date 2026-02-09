import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateNavigatorProps {
  date: Date;
  onChangeMonth: (increment: number) => void;
}
{/* --- COMPONENTE FECHA --- */}
export const DateNavigator = ({ date, onChangeMonth }: DateNavigatorProps) => {
  return (
    <View style={styles.container}>
      <IconButton 
        icon="chevron-left" 
        onPress={() => onChangeMonth(-1)} 
        mode="contained-tonal"
      />
      <Text variant="titleLarge" style={styles.text}>
        {format(date, 'MMMM yyyy', { locale: es })}
      </Text>
      <IconButton 
        icon="chevron-right" 
        onPress={() => onChangeMonth(1)}
        mode="contained-tonal"
      />
    </View>
  );
};
{/* -------------------------------------- */}

{/* --- ESTILOS --- */}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  text: {
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }
});
{/* -------------------------------------- */}  