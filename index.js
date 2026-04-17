
const express = require("express");
const { Pool } = require('pg');
const jwt = require("jsonwebtoken");

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_T4KkNMOR6AXd@ep-little-bird-angdtvi8-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    await pool.query(`INSERT INTO users (username, email, password) VALUES ($1 , $2, $3)`, [username, email, password]);

    res.json({
        message: "Sign up done"
    })
})

app.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const response = await pool.query(`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`);

    const userExist = response.rows[0];

    if (!userExist) {
        res.status(402).json({
            message: "You are not login make sure signup first"
        })
        return;
    }

    const token = jwt.sign({
        userid: userExist.id
    }, "Piyush@123");

    res.json({
        message: token
    });

})




app.listen(3000);