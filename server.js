const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const mysql = require("mysql");

// Create a connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "w@2915djkq#",
    database: "crud"
});

app.get("/", (req, res) => {
    const sql = "SELECT * FROM STUDENT";
    
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "An error occurred" });
            return;
        }
        
        // Use the connection for your query
        connection.query(sql, (err, data) => {
            connection.release(); // Release the connection back to the pool
            
            if (err) {
                console.error(err);
                res.status(500).json({ error: "An error occurred" });
            } else {
                res.json(data);
            }
        });
    });
});

app.post("/create", (req, res) => {
    const sql = "INSERT INTO student(`Name`, `Email`) VALUES(?, ?)";
    const values = [req.body.name, req.body.email];
    
    // Use the connection pool to execute the query
    pool.query(sql, values, (err, data) => {
       if(err) return res.json("Error");
       return res.json(data);
    });
});


app.put("/update/:id", (req, res) => {
    const sql = "update student set `Name` = ?, `Email` = ? where ID = ?";
    const values = [req.body.name, req.body.email];
    const id = req.params.id;
    // Use the connection pool to execute the query
    pool.query(sql, [...values,id], (err, data) => {
       if(err) return res.json("Error");
       return res.json(data);
    });
});

app.delete("/student/:id", (req, res) => {
    const sql = "DELETE FROM student WHERE ID = ?";
    const id = req.params.id;
    // Use the connection pool to execute the query
    pool.query(sql, [id], (err, data) => {
       if(err) return res.json("Error");
       return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("listening");
})