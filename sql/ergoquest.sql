-- Checks if table already exists
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Motor;
DROP TABLE IF EXISTS MotorPosition;
DROP TABLE IF EXISTS Presets;
DROP TABLE IF EXISTS PositionPresets;

-- Schema
CREATE TABLE User (
    ID SERIAL PRIMARY KEY,
    email varchar(50) NOT NULL,
    name varchar(50),
    password varchar(50) NOT NULL
);

CREATE TABLE Motor(
    ID SERIAL PRIMARY KEY,
    name varchar(50)
);

CREATE TABLE MotorPosition(
    ID SERIAL PRIMARY KEY,
    angle integer,
    motorID integer REFERENCES Motor(ID),
    userID integer REFERENCES User(ID)
);

CREATE TABLE Presets (      
    ID SERIAL PRIMARY KEY,
    name varchar(50),
    userID integer REFERENCES User(ID)
);

CREATE TABLE PositionPresets (
    presetsID integer REFERENCES Presets(ID),
    positionID integer REFERENCES MotorPosition(ID)
);

CREATE TABLE TimeIntervals (
    presetsID integer REFERENCES Presets(ID),
    timeInSec integer,
    orderNumber integer
);

--Makes so users can see tables
GRANT SELECT ON User TO PUBLIC;
GRANT SELECT ON Motor TO PUBLIC;
GRANT SELECT ON MotorPosition TO PUBLIC;
GRANT SELECT ON Presets TO PUBLIC;
GRANT SELECT ON PositionPresets TO PUBLIC;

INSERT INTO User(email, password) VALUES ('zkg3@calvin.edu', 'abcdef');
INSERT INTO User(email, name, password) VALUES ('harry@gmail.com', 'Harry Smith', '1234ae');
INSERT INTO User(email, name, password) VALUES ('emily@gmail.com', 'Emily Dickenson', 'writer@');

INSERT INTO Motor(name) VALUES ('knee');
INSERT INTO Motor(name) VALUES ('ankle');
INSERT INTO Motor(name) VALUES ('upper back');
INSERT INTO Motor(name) VALUES ('lower back');
INSERT INTO Motor(name) VALUES ('head');

INSERT INTO MotorPosition(angle, motorID) VALUES (45, 1);
INSERT INTO MotorPosition(angle, motorID) VALUES (180, 4);
INSERT INTO MotorPosition(angle, motorID) VALUES (100, 3);
INSERT INTO MotorPosition(angle, motorID) VALUES (75, 2);
INSERT INTO MotorPosition(angle, motorID) VALUES (120, 5);

INSERT INTO Presets(name, userID) VALUES ('laid back', 2);
INSERT INTO Presets(name, userID) VALUES ('work mode', 2);
INSERT INTO Presets(name, userID) VALUES ('reading mode', 2);
INSERT INTO Presets(name, userID) VALUES ('laid back', 3);
INSERT INTO Presets(name, userID) VALUES ('watching video', 3);
INSERT INTO Presets(name, userID) VALUES ('laid back', 1);
INSERT INTO Presets(name, userID) VALUES ('working', 1);

INSERT INTO PositionPresets(presetsID, positionID) VALUES (1, 2);
INSERT INTO PositionPresets(presetsID, positionID) VALUES (1, 3);
INSERT INTO PositionPresets(presetsID, positionID) VALUES (1, 5);
INSERT INTO PositionPresets(presetsID, positionID) VALUES (2, 4);
INSERT INTO PositionPresets(presetsID, positionID) VALUES (2, 1);
INSERT INTO PositionPresets(presetsID, positionID) VALUES (2, 3);
INSERT INTO PositionPresets(presetsID, positionID) VALUES (2, 2);