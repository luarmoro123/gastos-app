require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

require('dotenv').config(); // Carga las variables del archivo .env

// Usar la variable de entorno
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// 2. Definir el Modelo (Esquema)
const GastoSchema = new mongoose.Schema({
  concept: String,
  amount: Number,
  category: String,
  date: String,
});

const Gasto = mongoose.model('Gasto', GastoSchema);

// 3. Rutas de la API

// GET: Obtener todos los gastos
app.get('/gastos', async (req, res) => {
  try {
    const gastos = await Gasto.find().sort({ date: -1 }); // Ordenar por fecha desc
    // Transformamos _id a id para que el frontend no se rompa
    const gastosFormat = gastos.map(g => ({
      id: g._id.toString(),
      concept: g.concept,
      amount: g.amount,
      category: g.category,
      date: g.date
    }));
    res.json(gastosFormat);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gastos' });
  }
});

// POST: Crear un gasto
app.post('/gastos', async (req, res) => {
  try {
    const nuevoGasto = new Gasto(req.body);
    await nuevoGasto.save();
    res.status(201).json({ 
      ...nuevoGasto._doc, 
      id: nuevoGasto._id // Devolvemos el ID generado por Mongo
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar' });
  }
});

// DELETE: Borrar un gasto
app.delete('/gastos/:id', async (req, res) => {
  try {
    await Gasto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});