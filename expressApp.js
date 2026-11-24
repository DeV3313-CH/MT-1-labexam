
const express = require("express");

const app = express();
app.use(express.json());

// Patient array
let patients = [
    {
        id: 1,
        name: "Amit Kumar",
        age: 35,
        disease: "Fever",
        doctorName: "Dr. Sharma"
    },
    {
        id: 2,
        name: "Rahul Singh",
        age: 28,
        disease: "Cold",
        doctorName: "Dr. Verma"
    },
    {
        id: 3,
        name: "Priya Sharma",
        age: 40,
        disease: "Diabetes",
        doctorName: "Dr. Gupta"
    }
];

// 1. GET - Retrieve all patients
app.get("/patients", (req, res) => {

    res.status(200).json(patients);

});

// 2. GET - Retrieve patient by ID
app.get("/patients/:id", (req, res) => {

    const id = Number(req.params.id);

    const patient = patients.find(p => p.id === id);

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    res.status(200).json(patient);

});

// 3. POST - Add new patient
app.post("/patients", (req, res) => {

    const { id, name, age, disease, doctorName } = req.body;

    if (
        id === undefined ||
        !name ||
        age === undefined ||
        !disease ||
        !doctorName
    ) {
        return res.status(400).json({
            message: "All patient fields are required"
        });
    }

    if (patients.some(p => p.id === Number(id))) {
        return res.status(400).json({
            message: "Patient ID already exists"
        });
    }

    const newPatient = {
        id: Number(id),
        name,
        age: Number(age),
        disease,
        doctorName
    };

    patients.push(newPatient);

    res.status(201).json({
        message: "Patient added successfully",
        patient: newPatient
    });

});

// 4. PUT - Update patient
app.put("/patients/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = patients.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    const { id: ignoredId, ...updates } = req.body;

    patients[index] = {
        ...patients[index],
        ...updates,
        id
    };

    res.status(200).json({
        message: "Patient updated successfully",
        patient: patients[index]
    });

});

app.delete("/patients/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = patients.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    const deletedPatient = patients.splice(index, 1);

    res.status(200).json({
        message: "Patient deleted successfully",
        patient: deletedPatient[0]
    });

});
app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    res.status(500).json({
        message: "Internal server error"
    });

});

app.use((req, res) => {

    res.status(404).json({
        message: "API route not found"
    });

});

app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});
