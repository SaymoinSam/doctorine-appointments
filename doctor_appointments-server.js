const host = "192.168.1.4",
  port = 3000,
  http = require('http'),
  mysql = require("mysql"),
  express = require("express");
  
let app = express();

function getNonValidMysqlChars(str) {
  return str.replace(/[ a-zA-Z{}[\]0-9()'+*`$></.,?:@!\%&éèçà_\-|]/g, "");
}

function dbQuery(sqlQuery, callback) {
  let con = mysql.createConnection({
    host: "localhost",
    user: "dRoOcTtCoOrD",
    password: "d2R1_o4O$c&3TtC@o7O_rD",
    database: "doctor_appointments"
  });

  con.connect(function(err) {
    if(err) {
      return console.log(err);
    }

    con.query(sqlQuery, function(err, result, fields) {
      if(err) {
        return console.log(err);
      }
      callback(result, fields);
      con.end();
    });
  });
}

app.post('/register', express.json({type: '*/*'}), (req, res, next) => {
  res.status(200);

  const newUser = {
    "first-name": req.body["first-name"],
    "last-name": req.body["last-name"],
    "user-name": req.body["user-name"],
    "password": req.body["password"],
    "email": req.body["email"],
    "card-id": req.body["card-id"]
  };

  for(let prop in newUser) {
    let nonValidChars = getNonValidMysqlChars(newUser[prop]);
    if(nonValidChars) {
      return res.json({
        "is-valid": false,
        "error-code": 1,
        "field-name": prop,
        "msg": `${nonValidChars}`,
      });
    }
  }
  
  dbQuery(`SELECT * FROM Patients WHERE email = "${newUser["email"]}" OR userName = "${newUser["user-name"]}" OR cardID = "${newUser["card-id"]}";`, function(result) {
    if(result.length > 0) {
      let duplicateFieldName = "";
      if(result[0].userName === newUser["user-name"]) {
        duplicateFieldName = "User Name";
      }else if(result[0].email === newUser["email"]) {
        duplicateFieldName = "Email";
      }else if(result[0].cardID === newUser["card-id"]) {
        duplicateFieldName = "Card ID";
      }
      res.json({
        "is-valid": false,
        "error-code": 2,
        "field-name": duplicateFieldName,
        "msg": "duplicate"
      });
    }else {
      dbQuery(`INSERT INTO Patients(firstName, lastName, userName, email, cardID, password) VALUES("${newUser["first-name"]}", "${newUser["last-name"]}", "${newUser["user-name"]}", "${newUser["email"]}", "${newUser["card-id"]}", "${newUser["password"]}");`, function(result) {
        if(result.affectedRows < 1) {
          return res.json({
            "is-valid": false,
            "error-code": 3,
            "msg": "Database Insertion Error!"
          });
        }
        res.json({"is-valid": true});
      });
    } 
  });
})

app.post('/login', express.json({type: '*/*'}), (req, res, next) => {
  var userName = req.body["user-name"];
  var password = req.body.password;
  res.status(200);

  dbQuery(`SELECT * FROM Patients Where userName = "${userName}" AND password = "${password}";`, function(result) {
    if(result.length === 0) {
      res.json({"is-connected": false});
    }else {
      dbQuery(`SELECT * FROM Appointments WHERE isTaken = 0;`, function(nonTakenAppointments) {
        let nonTakenSessions = [];
        nonTakenAppointments.forEach(function(nonTakenRow) {
          nonTakenSessions.push({"hour": nonTakenRow.hour, "minute": nonTakenRow.minute});
        });
        res.json({"is-connected": true, "patient-id": result[0].patientID, "sessions": nonTakenSessions});
      });
    }
  });
})

app.post('/reserve', express.json({type: '*/*'}), (req, res, next) => {
  res.status(200);
  let [hour, minute] = req.body["reserved-session"].split(" ")[2].split(":");
  let patientID = req.body["patient-id"];

  dbQuery(`SELECT * FROM Appointments WHERE appointmentPatientID = "${patientID}" AND isTaken = 1;`, function(takenAppointments) {
    if(takenAppointments.length > 0) {
      res.json({
        "is-valid": false,
        "error-code": 3,
        "msg": "Patient has already a reserved session!"
      });
    }else {
      dbQuery(`SELECT * FROM Appointments WHERE hour = "${Number(hour)}" AND minute = "${Number(minute)}" AND isTaken = 0;`, function(nonTakenAppointments) {
        if(nonTakenAppointments.length > 0) {
          dbQuery(`UPDATE Appointments SET isTaken = 1, appointmentPatientID = ${patientID} WHERE appointmentID = ${nonTakenAppointments[0].appointmentID};`, function(result) {
            if(result.affectedRows < 1) {
              return res.json({
                "is-valid": false,
                "error-code": 1,
                "msg": "Database Error!"
              });
            }
            res.json({
              "is-valid": true
            });
          });
        }else {
          return res.json({
            "is-valid": false,
            "error-code": 2,
            "msg": "Session is taken!"
          });
        } 
      });
    } 
  });
})

app.use(function(req, res){
  res.status(404);
  res.send({error: "There is no response to this request :P"});
});

http.createServer({}, app).listen(port, host, () => {
  console.log('Server running at http://' + host + ':' + port);
})