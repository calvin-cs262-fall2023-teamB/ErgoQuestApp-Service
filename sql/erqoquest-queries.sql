SELECT * 
    FROM DBUser
    ;

SELECT * 
    FROM MotorPosition
    ;

SELECT *
    FROM Presets
    ;

SELECT * 
    FROM PositionPresets
    ;

SELECT DBUser.name
    FROM DBUser
    LEFT JOIN Presets ON DBUser.ID = Presets.DBUserID
    WHERE Presets.name = 'laid back'
    ;

SELECT DBUser.name
    FROM DBUser
    LEFT JOIN Presets on DBUser.ID = Presets.DBUserID
    LEFT JOIN PositionPresets on PositionPresets.presetsID = Presets.ID
    LEFT JOIN MotorPosition on MotorPosition.ID = PositionPresets.positionID
    LEFT JOIN Motor on Motor.ID = MotorPosition.motorID
    WHERE MotorPosition.angle <=100 
    AND Motor.name = 'knee'
    ;