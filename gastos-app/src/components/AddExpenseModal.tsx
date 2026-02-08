import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, HelperText, Chip, useTheme } from 'react-native-paper';
import { useExpenses } from '../context/ExpenseContext';

// Quitamos la dependencia de 'types' estricta para la categoría en este componente local
// para permitir strings libres.
const CATEGORIES = ['Comida', 'Transporte', 'Ocio', 'Vivienda','Escuela', 'Viajes','Tecnologia','GYM','Otros'];

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export const AddExpenseModal = ({ visible, onDismiss }: Props) => {
  const { addExpense } = useExpenses();
  const theme = useTheme(); // Usamos el tema para colores consistentes
  
  // Estados del formulario
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedChip, setSelectedChip] = useState('Otros'); // Estado para el Chip visual
  const [customCategory, setCustomCategory] = useState(''); // Estado para el texto personalizado
  const [error, setError] = useState(false);

  const handleSave = async () => {
    // 1. Validaciones básicas
    if (!concept || !amount) {
      setError(true);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setError(true);
      return;
    }

    // 2. Lógica para definir la categoría final
    let finalCategory = selectedChip;
    
    // Si eligió "Otros", usamos lo que escribió en el input.
    // Si dejó el input vacío, guardamos "Otros" por defecto o lanzamos error.
    if (selectedChip === 'Otros') {
        if (!customCategory.trim()) {
            setError(true); // Obligamos a escribir algo si eligió Otros
            return;
        }
        finalCategory = customCategory;
    }

    // 3. Guardar
    await addExpense({
      concept,
      amount: numAmount,
      category: finalCategory, // Enviamos la categoría calculada
      date: new Date().toISOString().split('T')[0],
    });

    // 4. Limpiar formulario
    setConcept('');
    setAmount('');
    setCustomCategory(''); 
    setSelectedChip('Otros');
    setError(false);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.container, { backgroundColor: theme.colors.elevation.level3 }]}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>Nuevo Gasto</Text>

        <TextInput
          label="Concepto"
          value={concept}
          onChangeText={setConcept}
          mode="outlined"
          style={styles.input}
          error={error && !concept}
        />

        <TextInput
          label="Monto"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          left={<TextInput.Affix text="$" />}
          error={error && !amount}
        />
        
        <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Categoría:</Text>
        
        <View style={styles.chipContainer}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              selected={selectedChip === cat}
              onPress={() => setSelectedChip(cat)}
              style={styles.chip}
              showSelectedOverlay
            >
              {cat}
            </Chip>
          ))}
        </View>

        {/* --- ESTA ES LA NUEVA PARTE MÁGICA --- */}
        {selectedChip === 'Otros' && (
             <TextInput
             label="Escribe la categoría personalizada..."
             value={customCategory}
             onChangeText={setCustomCategory}
             mode="outlined"
             style={styles.input}
             // Validamos si hay error y está vacío
             error={error && selectedChip === 'Otros' && !customCategory} 
           />
        )}
        {/* -------------------------------------- */}

        {error && <HelperText type="error">Verifica los campos obligatorios</HelperText>}

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar Gasto
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
  }
});