// Set up the database connection.

const pgp = require('pg-promise')();
const db = pgp({
    host: 'hansken.db.elephantsql.com',
    port: 5432,
    database: 'sukcdfrs',
    user: 'sukcdfrs',
    password: 'Q2_8xUF9SLpXeZOJDGB82hBt0BIXYVJY'
});

//Hashing
const bcrypt = require('bcrypt');
const saltRounds = 5;

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/users", readUsers);
router.get("/users/:id", loginUser);
router.put("/users/:id", updateUser);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

router.get("/motors", readMotors);
router.get("/motors/:id", readMotor);
router.put("/motors/:id", updateMotor);
router.post('/motors', createMotor);
router.delete('/motors/:id', deleteMotor);

router.get("/motorpositions", readMotorPositions);
router.get("/motorpositions/:id", readMotorPosition);
router.put("/motorpositions/:id", updateMotorPosition);
router.post('/motorpositions', createMotorPosition);
router.delete('/motorpositions/:id', deleteMotorPosition);

router.get("/presets", readPresets);
router.get("/presets/:id", readPreset);
router.put("/presets/:id", updatePresets);
router.post('/presets', createPresets);
router.delete('/presets/:id', deletePresets);

router.get("/positionpresets", readPositionPresets);
router.get("/positionpresets/:presetsID/:positionID", readPositionPreset);
router.put("/positionpresets/:presetsID/:positionID", updatePositionPresets);
router.post('/positionpresets/:presetsID/:positionID', createPositionPresets);
router.delete('/positionpresets/:presetsID/:positionID', deletePositionPresets);

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
    res.send('Hello, CS 262 Ergo Quest App service!');
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

function readUser(req, res, next) {
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
    const { email, name, password } = req.body;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send("Error hashing password");
            return;
        }
        db.one('INSERT INTO DBUser(email, name, password) VALUES ($1, $2, $3) RETURNING id', [email, name, hash])
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                next(err);
            });
    });
}

function loginUser(req, res, next) {
    const { email, password } = req.body;

    db.oneOrNone('SELECT * FROM DBUser WHERE email=$1', [email])
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (err) {
                        console.error('Error comparing password:', err);
                        res.status(500).send("Internal server error");
                        return;
                    }
                    
                    if (result) {
                        // Passwords match
                        // Here, handle the successful login (e.g., generating a token, redirecting, etc.)
                        res.send({ message: "Login successful", userID: user.id });
                    } else {
                        // Passwords don't match
                        res.status(401).send("Invalid credentials");
                    }
                });
            } else {
                res.status(404).send("User not found");
            }
        })
        .catch(err => {
            console.error('Database error:', err);
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

function readMotors(req, res, next) {
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

function readMotorPositions(req, res, next) {
    db.many("SELECT * FROM MotorPosition")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readMotorPosition(req, res, next) {
    db.oneOrNone('SELECT * FROM MotorPosition WHERE ID=${id}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateMotorPosition(req, res, next) {
    db.oneOrNone('UPDATE MotorPosition SET angle=${body.angle}, motorID=${body.motorID} WHERE ID=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createMotorPosition(req, res, next) {
    db.one('INSERT INTO MotorPosition(angle, motorID) VALUES (${angle}, ${motorID}) RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deleteMotorPosition(req, res, next) {
    db.oneOrNone('DELETE FROM MotorPosition WHERE ID=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function readPresets(req, res, next) {
    db.many("SELECT * FROM Presets")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readPreset(req, res, next) {
    db.oneOrNone('SELECT * FROM Presets WHERE ID=${id}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updatePresets(req, res, next) {
    db.oneOrNone('UPDATE Presets SET name=${body.name}, DBUserID=${body.DBUserID} WHERE ID=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createPresets(req, res, next) {
    db.one('INSERT INTO Presets(name, DBUserID) VALUES (${name}, ${DBUserID}) RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deletePresets(req, res, next) {
    db.oneOrNone('DELETE FROM Presets WHERE ID=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function readPositionPresets(req, res, next) {
    db.many("SELECT * FROM PositionPresets")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readPositionPreset(req, res, next) {
    db.oneOrNone('SELECT * FROM PositionPresets WHERE presetsID=${presetsID} AND positionID=${positionID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updatePositionPresets(req, res, next) {
    db.oneOrNone('UPDATE PositionPresets SET presetsID=${presetsID}, positionID=${positionID}', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createPositionPresets(req, res, next) {
    db.one('INSERT INTO PositionPresets(presetsID, positionID) VALUES (${presetsID}, ${positionID})', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deletePositionPresets(req, res, next) {
    db.oneOrNone('DELETE FROM PositionPresets WHERE presetsID=${presetsID} AND positionID=${positionID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}
