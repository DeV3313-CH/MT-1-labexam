
const http = require("http");
const fs = require("fs");
const path = require("path");

// Patient records
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

// Create HTTP server
const server = http.createServer((req, res) => {

    // Route 1: Home page
    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Hospital Management System</h1>");
    }

    // Route 2: Get all patients
    else if (req.url === "/patients" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(patients));
    }

    // Route 3: Hospital information
    else if (req.url === "/about" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>City Hospital</h1><p>Providing healthcare services.</p>");
    }

    // Route 4: Add a patient
    else if (req.url === "/add-patient" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {
                const newPatient = JSON.parse(body);

                if (
                    newPatient.id === undefined ||
                    !newPatient.name ||
                    newPatient.age === undefined ||
                    !newPatient.disease ||
                    !newPatient.doctorName
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    return res.end(JSON.stringify({
                        message: "All patient fields are required"
                    }));
                }

                if (patients.some(p => p.id === newPatient.id)) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    return res.end(JSON.stringify({
                        message: "Patient ID already exists"
                    }));
                }

                patients.push(newPatient);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Patient added successfully",
                    patient: newPatient
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });
    }


    else if (req.url === "/home.html" && req.method === "GET") {

        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                return res.end("Error reading HTML file");
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }
    else {

        res.writeHead(404, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "404 - Route Not Found"
        }));
    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
