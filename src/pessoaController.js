async function connect(){

    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");

    const connection = await mysql.createConnection({
        host: '54.91.193.137',
        user: 'libertas',
        password: '123456',
        database: 'libertas5per'
    });

    console.log("Conectou no MySQL!");

    global.connection = connection;

    return connection;
}

exports.get = async (req, res) => {

    const conn = await connect();

    const [rows] = await conn.query(
        'SELECT idpessoa, nome, telefone, email FROM pessoa ORDER BY nome'
    );

    res.status(200).send(rows);
};


exports.post = async (req, res) => {

    const conn = await connect();

    let { nome, telefone, email } = req.body;

    const sql = `
        INSERT INTO pessoa (nome, telefone, email)
        VALUES (?, ?, ?)
    `;

    await conn.query(sql, [nome, telefone, email]);

    res.status(201).send({resultado:true});
};


exports.put = async (req, res) => {

    const conn = await connect();

    let id = req.params.id;

    let { nome, telefone, email } = req.body;

    const sql = `
        UPDATE pessoa
        SET nome = ?, telefone = ?, email = ?
        WHERE idpessoa = ?
    `;

    await conn.query(sql, [nome, telefone, email, id]);

    res.status(200).send({resultado:true});
};


exports.delete = async (req, res) => {

    const conn = await connect();

    let id = req.params.id;

    const sql = `
        DELETE FROM pessoa
        WHERE idpessoa = ?
    `;

    await conn.query(sql, [id]);

    res.status(200).send({resultado:true});
};


exports.getById = async (req, res) => {

    const conn = await connect();

    let id = req.params.id;

    const [rows] = await conn.query(
        `
        SELECT idpessoa, nome, telefone, email
        FROM pessoa
        WHERE idpessoa = ?
        `,
        [id]
    );

    if(rows.length > 0){

        res.status(200).send(rows[0]);

    }else{

        res.status(404).send({resultado:false});

    }

};