const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'saep_db',
    //devolve as datas como texto (ex: 2026-11-10) e não como objeto Date
    dateStrings:true
});

connection.connect((erro) => {
if (erro) {
    console.log('Erro ao conectar:', erro);
    return;
    }

console.log('Banco conectado com sucesso!');
});

//serve para exportar a variável connection, permitindo que ela seja utilizada em outros arquivos do projeto.
module.exports = connection;
