const express = require('express');
const cors = require('cors');
const connection = require('./db');
const server = express();
server.use(cors());
server.use(express.json());


//CHAVE USADA PARA CRIPTOGRAFAR / DESCRIPTOGRAFAR O CPF (AES)
const CHAVE = 'saep2026';


//=========================================================
// LOGIN
//=========================================================

//A senha é comparada com o hash SHA2 gravado no banco
server.post('/login',(req,res)=>{

    const {login,senha} = req.body;

    connection.query(

        'SELECT id, nome, login FROM usuarios WHERE login=? AND senha=SHA2(?,256)',

        [login,senha],

        (erro,resultados)=>{

            if(erro){

                return res.status(500).json({

                    sucesso:false,

                    mensagem:erro.message

                });

            }

            if(resultados.length==0){

                return res.json({

                    sucesso:false,

                    mensagem:'Login ou senha inválidos.'

                });

            }

            res.json({

                sucesso:true,

                usuario:resultados[0]

            });

        }

    );

});


//=========================================================
// ALUNOS
//=========================================================

//LISTAR TODOS OS ALUNOS
//localhost:3025/alunos
server.get('/alunos', (req, res) => {

    const sql = `

        SELECT

            id,

            nome,

            CAST(AES_DECRYPT(cpf,?) AS CHAR) AS cpf,

            email,

            telefone,

            data_nascimento

        FROM alunos

        ORDER BY nome

    `;

    connection.query(sql, [CHAVE], (erro , resultados) => {

        if (erro){
            return res.status(500).json({ erro: erro.message });
        }
        return res.json(resultados);
    });

});

//PESQUISAR ALUNO POR NOME
//localhost:3025/alunos/busca/ana
server.get('/alunos/busca/:termo',(req,res)=>{

    connection.query(

        `

        SELECT

            id,

            nome,

            CAST(AES_DECRYPT(cpf,?) AS CHAR) AS cpf,

            email,

            telefone,

            data_nascimento

        FROM alunos

        WHERE nome LIKE ?

        ORDER BY nome

        `,

        [CHAVE, '%' + req.params.termo + '%'],

        (erro,resultados)=>{

            if(erro){
                return res.status(500).json({
                    erro:erro.message
                });
            }

            res.json(resultados);

        }

    );

});

//LISTAR UM UNICO ALUNO
//localhost:3025/alunos/2
server.get('/alunos/:id' , (req, res) => {

        const { id } = req.params;

        const sql = `

            SELECT

                id,

                nome,

                CAST(AES_DECRYPT(cpf,?) AS CHAR) AS cpf,

                email,

                telefone,

                data_nascimento

            FROM alunos

            WHERE id = ?

        `;

        connection.query(sql, [CHAVE, id], (erro , resultados) => {

        if (erro) {
            return res.status(500).json({ erro:erro.message });
        }

        return res.json(resultados[0]);

        });

});

//CADASTRAR ALUNO
server.post('/alunos',(req,res)=>{

    const{

        nome,
        cpf,
        email,
        telefone,
        data_nascimento

    } = req.body;


    connection.query(

        `

        INSERT INTO alunos

        (

            nome,

            cpf,

            email,

            telefone,

            data_nascimento

        )

        VALUES

        (?,AES_ENCRYPT(?,?),?,?,?)

        `,

        [

            nome,

            cpf,

            CHAVE,

            email,

            telefone,

            data_nascimento

        ],

        (erro,resultado)=>{

            if(erro){

                //CPF é UNIQUE: evita cadastro duplicado de aluno
                if(erro.code=='ER_DUP_ENTRY'){

                    return res.status(400).json({
                        mensagem:'Já existe um aluno cadastrado com este CPF.'
                    });

                }

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            res.json({

                mensagem:'Aluno cadastrado com sucesso!',

                id:resultado.insertId

            });

        }

    );

});

//EDITAR ALUNO
server.put('/alunos/:id',(req,res)=>{

    const{

        nome,
        cpf,
        email,
        telefone,
        data_nascimento

    } = req.body;

    connection.query(

        `

        UPDATE alunos

        SET

            nome=?,

            cpf=AES_ENCRYPT(?,?),

            email=?,

            telefone=?,

            data_nascimento=?

        WHERE id=?

        `,

        [

            nome,

            cpf,

            CHAVE,

            email,

            telefone,

            data_nascimento,

            req.params.id

        ],

        (erro)=>{

            if(erro){

                if(erro.code=='ER_DUP_ENTRY'){

                    return res.status(400).json({
                        mensagem:'Já existe um aluno cadastrado com este CPF.'
                    });

                }

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            res.json({

                mensagem:'Aluno atualizado com sucesso.'

            });

        }

    );

});

//EXCLUIR ALUNO
server.delete('/alunos/:id',(req,res)=>{

    connection.query(

        'DELETE FROM alunos WHERE id=?',

        [req.params.id],

        (erro)=>{

            if(erro){

                //aluno possui plano de treino vinculado (chave estrangeira)
                if(erro.code=='ER_ROW_IS_REFERENCED_2'){

                    return res.status(400).json({
                        mensagem:'Este aluno possui planos de treino e não pode ser excluído.'
                    });

                }

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            res.json({

                mensagem:'Aluno removido com sucesso.'

            });

        }

    );

});


//=========================================================
// PLANOS DE TREINO
//=========================================================

//LISTAR TODOS OS PLANOS (COM O NOME DO ALUNO)
//localhost:3025/planos
server.get('/planos', (req, res) => {

    const sql = `

        SELECT

            p.id,

            p.aluno_id,

            a.nome AS aluno_nome,

            p.objetivo,

            p.descricao,

            p.frequencia_semanal,

            p.data_inicio

        FROM planos_treino p

        INNER JOIN alunos a ON a.id = p.aluno_id

        ORDER BY a.nome

    `;

    connection.query(sql, (erro , resultados) => {

        if (erro){
            return res.status(500).json({ erro: erro.message });
        }
        return res.json(resultados);
    });

});

//LISTAR UM UNICO PLANO
//localhost:3025/planos/2
server.get('/planos/:id' , (req, res) => {

        const { id } = req.params;
        const sql = 'SELECT * FROM planos_treino WHERE id = ?';

        connection.query(sql, [id], (erro , resultados) => {

        if (erro) {
            return res.status(500).json({ erro:erro.message });
        }

        return res.json(resultados[0]);

        });

});

//CADASTRAR PLANO (SEMPRE ASSOCIADO A UM ALUNO)
server.post('/planos',(req,res)=>{

    const{

        aluno_id,
        objetivo,
        descricao,
        frequencia_semanal,
        data_inicio

    } = req.body;

    if(!aluno_id){

        return res.status(400).json({
            mensagem:'O plano de treino deve ser associado a um aluno.'
        });

    }

    connection.query(

        `

        INSERT INTO planos_treino

        (

            aluno_id,

            objetivo,

            descricao,

            frequencia_semanal,

            data_inicio

        )

        VALUES

        (?,?,?,?,?)

        `,

        [

            aluno_id,

            objetivo,

            descricao,

            frequencia_semanal,

            data_inicio

        ],

        (erro,resultado)=>{

            if(erro){

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            res.json({

                mensagem:'Plano de treino cadastrado com sucesso!',

                id:resultado.insertId

            });

        }

    );

});

//EDITAR PLANO
server.put('/planos/:id',(req,res)=>{

    const{

        objetivo,
        descricao,
        frequencia_semanal,
        data_inicio

    } = req.body;

    connection.query(

        `

        UPDATE planos_treino

        SET

            objetivo=?,

            descricao=?,

            frequencia_semanal=?,

            data_inicio=?

        WHERE id=?

        `,

        [

            objetivo,

            descricao,

            frequencia_semanal,

            data_inicio,

            req.params.id

        ],

        (erro)=>{

            if(erro){

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            res.json({

                mensagem:'Plano de treino atualizado com sucesso.'

            });

        }

    );

});

//EXCLUIR PLANO
server.delete('/planos/:id',(req,res)=>{

    connection.query(

        'DELETE FROM planos_treino WHERE id=?',

        [req.params.id],

        (erro)=>{

            if(erro){

                if(erro.code=='ER_ROW_IS_REFERENCED_2'){

                    return res.status(400).json({
                        mensagem:'Este plano possui aulas agendadas e não pode ser excluído.'
                    });

                }

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            res.json({

                mensagem:'Plano de treino removido com sucesso.'

            });

        }

    );

});


//=========================================================
// AGENDAMENTOS
//=========================================================

//LISTAR AGENDAMENTOS ORDENADOS POR DATA DA AULA
//TRAZ TODOS OS DADOS DO ALUNO E DO PLANO DE TREINO
//localhost:3025/agendamentos
server.get('/agendamentos', (req, res) => {

    const sql = `

        SELECT

            ag.id,

            ag.personal,

            ag.data_aula,

            ag.horario,

            p.id AS plano_id,

            p.objetivo,

            p.descricao,

            p.frequencia_semanal,

            p.data_inicio,

            a.id AS aluno_id,

            a.nome AS aluno_nome,

            CAST(AES_DECRYPT(a.cpf,?) AS CHAR) AS aluno_cpf,

            a.email AS aluno_email,

            a.telefone AS aluno_telefone,

            a.data_nascimento AS aluno_nascimento

        FROM agendamentos ag

        INNER JOIN planos_treino p ON p.id = ag.plano_id

        INNER JOIN alunos a ON a.id = p.aluno_id

        ORDER BY ag.data_aula, ag.horario

    `;

    connection.query(sql, [CHAVE], (erro , resultados) => {

        if (erro){
            return res.status(500).json({ erro: erro.message });
        }
        return res.json(resultados);
    });

});

//LISTAR UM UNICO AGENDAMENTO
//localhost:3025/agendamentos/2
server.get('/agendamentos/:id' , (req, res) => {

        const { id } = req.params;
        const sql = 'SELECT * FROM agendamentos WHERE id = ?';

        connection.query(sql, [id], (erro , resultados) => {

        if (erro) {
            return res.status(500).json({ erro:erro.message });
        }

        return res.json(resultados[0]);

        });

});

//CADASTRAR AGENDAMENTO
//Não permite dois agendamentos do mesmo personal na mesma data e horário
server.post('/agendamentos',(req,res)=>{

    const{

        plano_id,
        personal,
        data_aula,
        horario

    } = req.body;

    connection.query(

        'SELECT * FROM agendamentos WHERE personal=? AND data_aula=? AND horario=?',

        [personal, data_aula, horario],

        (erro,resultados)=>{

            if(erro){

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            if(resultados.length>0){

                return res.status(400).json({
                    mensagem:'Choque de horário: este personal já possui aula nesta data e horário.'
                });

            }

            connection.query(

                `

                INSERT INTO agendamentos

                (

                    plano_id,

                    personal,

                    data_aula,

                    horario

                )

                VALUES

                (?,?,?,?)

                `,

                [

                    plano_id,

                    personal,

                    data_aula,

                    horario

                ],

                (erro,resultado)=>{

                    if(erro){

                        return res.status(500).json({
                            mensagem:erro.message
                        });

                    }

                    res.json({

                        mensagem:'Aula agendada com sucesso!',

                        id:resultado.insertId

                    });

                }

            );

        }

    );

});

//ATUALIZAR A DATA (E O HORÁRIO) DE UM AGENDAMENTO
server.put('/agendamentos/:id',(req,res)=>{

    const{

        data_aula,
        horario

    } = req.body;

    const id = req.params.id;

    //verifica choque de horário com OUTRO agendamento do mesmo personal
    connection.query(

        `

        SELECT * FROM agendamentos

        WHERE data_aula=? AND horario=? AND id<>?

        AND personal=(SELECT personal FROM agendamentos WHERE id=?)

        `,

        [data_aula, horario, id, id],

        (erro,resultados)=>{

            if(erro){

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            if(resultados.length>0){

                return res.status(400).json({
                    mensagem:'Choque de horário: este personal já possui aula nesta data e horário.'
                });

            }

            connection.query(

                'UPDATE agendamentos SET data_aula=?, horario=? WHERE id=?',

                [data_aula, horario, id],

                (erro)=>{

                    if(erro){

                        return res.status(500).json({
                            mensagem:erro.message
                        });

                    }

                    res.json({

                        mensagem:'Data do agendamento atualizada com sucesso.'

                    });

                }

            );

        }

    );

});

//EXCLUIR AGENDAMENTO
server.delete('/agendamentos/:id',(req,res)=>{

    connection.query(

        'DELETE FROM agendamentos WHERE id=?',

        [req.params.id],

        (erro)=>{

            if(erro){

                return res.status(500).json({
                    mensagem:erro.message
                });

            }

            res.json({

                mensagem:'Agendamento removido com sucesso.'

            });

        }

    );

});

const PORT = 3025

server.listen(PORT , () => {

    console.log(`Servidor rodando na porta: ${PORT}`)

});
