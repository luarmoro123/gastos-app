import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, TextInput, HelperText, Chip, useTheme } from 'react-native-paper';
import { useExpenses } from '../context/ExpenseContext';

const CATEGORIES = ['Comida', 'Transporte', 'Ocio', 'Vivienda','Escuela', 'Viajes','Tecnologia','GYM','Otros'];
interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export const AddExpenseModal = ({ visible, onDismiss }: Props) => {
  const { addExpense } = useExpenses();
  const theme = useTheme(); // Usamos el tema para colores consistentes
  
  // Estados del formulario
  const [concept, setConcept] = useState(''); // Estado concepto
  const [amount, setAmount] = useState(''); // Estado monto
  const [selectedChip, setSelectedChip] = useState('Otros'); // Estado para el Chip visual
  const [customCategory, setCustomCategory] = useState(''); // Estado para el texto personalizado
  const [error, setError] = useState(false);


  {/* ---FUNCION LIMPIAR --- */}
  const limpiar = () =>{
    setConcept('');
    setAmount('');
    setCustomCategory(''); 
    setSelectedChip('Otros');
    setError(false);
    onDismiss();
  }
  {/* -------------------------------------- */}

  {/* ---FUNCION GUARDAR CATEGORIA --- */}
  const handleSave = async () => {

    {/* ---VALIDACION BASICA --- */}

    // valida que los inputs no esten vacios
    if ([concept, amount].some(field => field.trim() === '')) {
      setError(true);
      return false;
    }

    // valida que el monto sea un numero 
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(true);
      return false;
    }
    {/* -------------------------------------- */}


    {/* ---LOGICA CATEGORIA --- */}
   
    let finalCategory = selectedChip;
    
    // validacion del input categoria
    if (selectedChip === 'Otros') {
        if (!customCategory.trim()) {
            setError(true); 
            return;
        }
        finalCategory = customCategory;
    }

    {/* -------------------------------------- */}

    {/* ---GUARDAR --- */}
    await addExpense({
      concept,
      amount: numAmount,
      category: finalCategory,
      date: new Date().toISOString().split('T')[0],
    });
    {/* -------------------------------------- */}

    // Limpiar formulario
    limpiar()
    
  };
  {/* -------------------------------------- */}

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.container, { backgroundColor: theme.colors.elevation.level3 }]}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>Nuevo Gasto</Text>

        {/* --- INPUT CONCEPTO --- */}
        <TextInput
          label="Concepto"
          value={concept}
          onChangeText={setConcept}
          mode="outlined"
          style={styles.input}
          error={error && !concept}
        />
        {/* -------------------------------------- */}


        {/* --- INPUT MONTO --- */}
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
        {/* -------------------------------------- */}

        
        <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Categoría:</Text>
        {/* --- CHIP CATEGORIA --- */}
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
        {/* -------------------------------------- */}

        {/* --- INPUT CATEGORIA --- */}
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
        
        {/* --- BUTTON GUARDAR --- */}
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar Gasto
        </Button>
        {/* -------------------------------------- */}
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