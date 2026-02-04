import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, HelperText, Chip } from 'react-native-paper';
import { useExpenses } from '../context/ExpenseContext';
import { Category } from '../types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const CATEGORIES: Category[] = ['Comida', 'Transporte', 'Ocio', 'Vivienda', 'Otros'];

export const AddExpenseModal = ({ visible, onDismiss }: Props) => {
  const { addExpense } = useExpenses();
  
  // Estados del formulario
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Otros');
  const [error, setError] = useState(false);

  const handleSave = async () => {
    if (!concept || !amount) {
      setError(true);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setError(true);
      return;
    }

    // Crear el objeto gasto
    await addExpense({
      id: Date.now().toString(),
      concept,
      amount: numAmount,
      category,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    });

    // Limpiar y cerrar
    setConcept('');
    setAmount('');
    setCategory('Otros');
    setError(false);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>Nuevo Gasto</Text>

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
        
        {error && <HelperText type="error">Completa todos los campos correctamente</HelperText>}

        <Text variant="bodyMedium" style={styles.label}>Categoría:</Text>
        <View style={styles.chipContainer}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              selected={category === cat}
              onPress={() => setCategory(cat)}
              style={styles.chip}
              mode="outlined"
              showSelectedOverlay
            >
              {cat}
            </Chip>
          ))}
        </View>

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar Gasto
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
    marginBottom: 20,
  },
  chip: {
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
  }
});