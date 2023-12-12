/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/**
 * This module implements a REST-inspired webservice for the Ergo Quest App DB.
 * The database is hosted on ElephantSQL.
 *
 * The service supports the users, motors, motorpositions and presets tables.
 *
 * To guard against SQL injection attacks, this code uses pg-promise's built-in
 * variable escaping. This prevents a client from issuing this URL:
 *     https://cs262-webservice.azurewebsites.net//players/1%3BDELETE%20FROM%20PlayerGame%3BDELETE%20FROM%20Player
 * which would delete records in the PlayerGame and then the Player tables.
 * In particular, we don't use JS template strings because it doesn't filter
 * client-supplied values properly.
 *
 * This service assumes that the database connection strings and the server mode are
 * set in environment variables. See the DB_* variables used by pg-promise. And
 * setting NODE_ENV to production will cause ExpressJS to serve up uninformative
 * server error responses for all errors.
 *
 * @author: Henry Goldkuhle
 * @date: Winter, 2023
 */

// Set up the database connection.

const pgp = require('pg-promise')();
const db = pgp({
    host: 'hansken.db.elephantsql.com',
    port: 5432,
    database: 'sukcdfrs',
    user: 'sukcdfrs',
    password: 'Q2_8xUF9SLpXeZOJDGB82hBt0BIXYVJY'
});

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/users", readUsers);
router.get("/users/:id", readUser);
router.put("/users/:id", updateUser);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

router.get("/motors", readMotors);
router.get("/motors/:id", readMotor);
router.put("/motors/:id", updateMotor);
router.post('/motors', createMotor);
router.delete('/motors/:id', deleteMotor);

router.get("/motorpositions", readMotorPositions);
router.get("/motorpositions/:motorID/:userID", readMotorPosition);
router.put("/motorpositions/:motorID/:userID", updateMotorPosition);
router.post('/motorpositions', createMotorPosition);
router.delete('/motorpositions/:motorID/:userID', deleteMotorPosition);

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
    db.oneOrNone('SELECT * FROM MotorPosition WHERE motorID=${motorID} AND userID=${userID}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updateMotorPosition(req, res, next) {
    const queryParams = {
        angle: req.body.angle,
        motorID: req.params.motorID,
        userID: req.params.userID
    };

    db.oneOrNone('UPDATE MotorPosition SET angle=${angle} WHERE motorID=${motorID} AND userID=${userID} RETURNING id', queryParams)
        .then(data => returnDataOr404(res, data))
        .catch(err => next(err));
}


function createMotorPosition(req, res, next) {
    db.one('INSERT INTO MotorPosition(angle, motorID, userID) VALUES (${angle}, ${motorID}, ${userID}) RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deleteMotorPosition(req, res, next) {
    db.oneOrNone('DELETE FROM MotorPosition WHERE motorID=${motorID} AND userID=${userID} RETURNING id', req.params)
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
