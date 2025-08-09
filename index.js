const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// your routes here

app.listen(3001, () => {
  console.log("Server running on port 3001");
});


async function connectDB() {
    try{
        await mongoose.connect('mongodb+srv://ak2368307:9LbHrwEqMIP3ZPGW@cluster0.dzglace.mongodb.net/company?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Mongodb connected');
    }
    catch(error){
        console.error('Mongodb connection failed', error);
        process.exit(1);
    }
}


connectDB();

const employeeSchema= new mongoose.Schema( {
        empNo: {type: Number, required: true},
        empName: {type: String, required: true, unique: true},
        empSal: {type: Number, required: true},
    },
    {
        timestamps: false,
        versionKey: false
});

const Employee=mongoose.model('Employee', employeeSchema);
// CRUD API routes

// Create new employee
app.post('/api/employees', async (req, res) => {
    try 
    {
        const employee = new Employee(req.body);
        const savedEmployee = await employee.save();
        //res.status(201).json(savedEmployee);
        res.status(201).json({ message: 'Employee added successfully' });
    } 
    catch (error) 
    {
        res.status(400).json({ message: error.message });
    }
});


//Get all employees
app.get('/api/employees', async (req, res) => {
    try{
        const employees= await Employee.find();
        res.json(employees);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

//Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try 
    {
        const employee = await Employee.findById(req.params.id);
        if (!employee) 
            return res.status(404).json({ message: 'Employee not found' });
        
        res.json(employee);
    } 
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
});

// Delete employee by ID
app.delete('/api/employees/:id', async (req, res) => {
    try 
    {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) 
            return res.status(404).json({ message: 'Employee not found' });
            res.json({ message: 'Employee deleted successfully' });
    } 
    catch (error) 
    {
           res.status(500).json({ message: error.message });
    }
});

//Update employee by ID
app.put('/api/employees/:id', async (req, res) => {
     try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
                req.params.id,
                req.body,{ 
                new: true,  
                runValidators: true 
            });
    if (!updatedEmployee) 
        return res.status(404).json({ message: 'Employee not found' });``
        res.json({ message: 'Employee Updated successfully' });
    } 
    catch (error){
        res.status(400).json({ message: error.message });
    }
});
    
