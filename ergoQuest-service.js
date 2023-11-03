// Set up the database connection.

const pgp = require('pg-promise')();
const db = pgp({
    host: hansken.db.elephantsql.com,
    port: azure-arm::centralus,
    database: sukcdfrs,
    user: sukcdfrs,
    password: Q2_8xUF9SLpXeZOJDGB82hBt0BIXYVJY
});

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/users", readUsers);
router.get("/users/:id", readUsers);
router.put("/users/:id", updateUser);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

router.get("/motors", readMotor);
router.get("/motors/:id", readMotor);
router.put("/motors/:id", updateMotor);
router.post('/motors', createMotor);
router.delete('/motors/:id', deleteMotor);

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function returnDataOr404(res, data) {
    if (data == null) {
        res.sendStatus(404);
    } else {
        res.send(data);
    }
}

function readHelloMessage(req, res) {
    res.send('Hello, CS 262 Monopoly service!');
}

function readUsers(req, res, next) {
    db.many("SELECT * FROM DBUser")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readUsers(req, res, next) {
    db.oneOrNone('SELECT * FROM DBUser WHERE ID=${id}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateUser(req, res, next) {
    db.oneOrNone('UPDATE DBUser SET email=${body.email}, name=${body.name}, password=${body.password} WHERE ID=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createUser(req, res, next) {
    db.one('INSERT INTO DBUser(email, name, password) VALUES (${email}, ${name}, ${password}) RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deleteUser(req, res, next) {
    db.oneOrNone('DELETE FROM DBUser WHERE ID=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function readMotor(req, res, next) {
    db.many("SELECT * FROM Motor")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readMotor(req, res, next) {
    db.oneOrNone('SELECT * FROM Motor WHERE ID=${id}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateMotor(req, res, next) {
    db.oneOrNone('UPDATE Motor SET name=${body.name} WHERE ID=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createMotor(req, res, next) {
    db.one('INSERT INTO Motor(name) VALUES (${name}) RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deleteMotor(req, res, next) {
    db.oneOrNone('DELETE FROM Motor WHERE ID=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function readMotor(req, res, next) {
    db.many("SELECT * FROM Motor")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readMotor(req, res, next) {
    db.oneOrNone('SELECT * FROM Motor WHERE ID=${id}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateMotor(req, res, next) {
    db.oneOrNone('UPDATE Motor SET name=${body.name} WHERE ID=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createMotorPosition(req, res, next) {
    db.one('INSERT INTO Motor(name) VALUES (${name}) RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deleteMotorPosition(req, res, next) {
    db.oneOrNone('DELETE FROM Motor WHERE ID=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}