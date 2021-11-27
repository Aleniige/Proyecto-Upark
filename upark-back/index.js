const express    = require("express"); // Gestión de las peticiones HTTP
const mysql      = require('mysql');
const util = require('util'); // Gestión de la base de datos
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

var app = express();

app.use(cors());

app.use(morgan('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({extended: false,limit: '60mb'}));

app.set('port', process.env.PORT || 3000);

app.get('/',(req, res) => {
    res.send('Mi primer server!');
})

app.listen(app.get('port'), () =>{
    console.log('server up en el puerto: '+ app.get('port'));
})

function crearConexion(){
    connection=  mysql.createConnection({
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : '',
        database : 'dbUpark'
	});
	return {
	query( sql, args ) {
		return util.promisify( connection.query )
		.call( connection, sql, args );
		},
	close() {
		return util.promisify( connection.end ).call( connection );
		}
	};
}

/* ------------------ End Points Usuario ------------------*/

app.post("/loginUser", async function(req,res){
	let mensaje="OK";
	const bodyInformation = req.body;
	console.log(bodyInformation);
	const connectionDB = crearConexion();
	
	try{
        const user = await connectionDB.query("SELECT * FROM usuarios WHERE email = ? AND contraseña = ? ", [req.body.email, req.body.pass])
        if(user.length > 0){
            mensaje = {auth: true, user:user}
            res.status(200);
        }else{
            mensaje = "Usuario o contraseña incorrecto"
            res.status(401);
        }

	} catch ( err ) {
		console.log('Error while performing Query');
		console.log(err);
		mensaje= "NO_OK";
	} finally {
		await connectionDB.close();
		res.send(mensaje);
	}
});

app.post("/registerUser", async function(req,res){
	let mensaje="OK";
	const bodyInformation = req.body;
	const connectionDB = crearConexion();
	try{
        const verify = await connectionDB.query("SELECT * FROM usuarios WHERE email = ?", req.body.email)
        if(verify.length > 0){
            mensaje = "correo ya registrado"
            res.status(401);
        }else{
            const results = await connectionDB.query("INSERT INTO usuarios SET nombre = ?, email = ?, contraseña = ?", [bodyInformation.nombre, bodyInformation.email, bodyInformation.pass]);
            res.status(200);
        }

	} catch ( err ) {
		console.log('Error while performing Query');
		console.log(err);
		mensaje= "NO_OK";
	} finally {
		await connectionDB.close();
		res.send(mensaje);
	}
});

app.post("/getReservasUsuario", async function(req,res){
	const body = req.body;
	const connectionDB = crearConexion();
	var mensaje = "OK";
	try{
		const reservas= await connectionDB.query('SELECT * FROM reservas WHERE fkUsuario = ?', [body.idUser]);
		res.status(200);
		res.json(reservas);
	} catch ( err ) {
		console.log('Error while performing Query');
		console.log(err);
		mensaje= "NO_OK";
		res.status(400);
		res.send(mensaje);
	} finally {
		await connectionDB.close();
	}
});

app.get("/getEstacionamientos", async function(req,res){
	const connectionDB = crearConexion();
	var mensaje = "OK";
	try{
		const estacionamientos= await connectionDB.query('SELECT * FROM espacios');
		res.status(200);
		res.json(estacionamientos);
	} catch ( err ) {
		console.log('Error while performing Query');
		console.log(err);
		mensaje= "NO_OK";
		res.status(400);
		res.send(mensaje);
	} finally {
		await connectionDB.close();
	}
});

app.post("/getReservas", async function(req,res){
	var mensaje = "OK";
	const body = req.body;
	const connectionDB = crearConexion();
	try{
		const reservas= await connectionDB.query('SELECT * FROM reservas WHERE fechaIngreso >= ? AND fechaIngreso < ?',[body.limiteInferior, body.limiteSuperior]);
		console.log(body.limiteInferior, body.limiteSuperior)
		res.status(200);
		res.json(reservas);
	} catch ( err ) {
		console.log('Error while performing Query');
		console.log(err);
		mensaje= "NO_OK";
		res.status(400);
		res.send(mensaje);
	} finally {
		await connectionDB.close();
	}
});

app.post("/getReservasEspecificas", async function(req,res){
	var mensaje = "OK";
	const body = req.body;
	const connectionDB = crearConexion();
	try{
		const reservas= await connectionDB.query('SELECT * FROM reservas WHERE fkCajon = ? AND fechaIngreso >= ? AND fechaIngreso < ?',[body.idCajon, body.limiteInferior, body.limiteSuperior]);
		console.log(body.limiteInferior, body.limiteSuperior)
		res.status(200);
		res.json(reservas);
	} catch ( err ) {
		console.log('Error while performing Query');
		console.log(err);
		mensaje= "NO_OK";
		res.status(400);
		res.send(mensaje);
	} finally {
		await connectionDB.close();
	}
});

app.post("/reservarEstacionamiento", async function(req,res){
	let mensaje="OK";
	const body = req.body;
	const connectionDB = crearConexion();
	try{
		const results = await connectionDB.query("INSERT INTO reservas SET fkUsuario = ?, fkCajon = ?, marcaCarro = ?, color = ?, fechaIngreso = ?, fechaSalida = ?", [body.idUser, body.idCajon, body.modelo, body.color, body.fechaI, body.fechaF]);
		res.status(200);
		res.send(results)
	} catch ( err ) {
		console.log('Error while performing Query');
		console.log(err);
		mensaje= "NO_OK";
	} finally {
		await connectionDB.close();
		res.send(mensaje);
	}
});
