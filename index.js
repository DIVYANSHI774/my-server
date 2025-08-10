const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // ✅ Load environment variables from .env

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ Using env variable
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
}
connectDB();

// Define schema and model
const employeeSchema = new mongoose.Schema(
  {
    empNo: { type: Number, required: true },
    empName: { type: String, required: true, unique: true },
    empSal: { type: Number, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Employee = mongoose.model('Employee', employeeSchema);

// API Routes

// Create new employee
app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete employee by ID
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update employee by ID
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001; // ✅ Use port from .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
