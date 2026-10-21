-- =========================================================
-- BANCO DE DADOS - ACADEMIA DE GINÁSTICA
-- =========================================================
-- Senha dos usuários: criptografada com SHA2 (hash de 256 bits)
-- CPF dos alunos: criptografado com AES_ENCRYPT (chave 'saep2026')
--                 para poder ser descriptografado na edição (LGPD)
-- =========================================================

DROP DATABASE IF EXISTS saep_db;

CREATE DATABASE saep_db;
USE saep_db;

-- =========================================================
-- TABELA DE USUÁRIOS
-- =========================================================

CREATE TABLE usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(64) NOT NULL
);

-- senha de todos os usuários: 123
INSERT INTO usuarios(nome, login, senha)
VALUES
('Administrador','admin',SHA2('123',256)),
('Carla Souza','carla',SHA2('123',256)),
('Ricardo Lima','ricardo',SHA2('123',256));


-- =========================================================
-- TABELA DE ALUNOS
-- =========================================================

CREATE TABLE alunos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARBINARY(255) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL
);

INSERT INTO alunos
(nome,cpf,email,telefone,data_nascimento)

VALUES

('Ana Paula Martins',AES_ENCRYPT('123.456.789-01','saep2026'),'ana@email.com','(11) 98888-1111','1998-03-15'),
('Bruno Henrique Costa',AES_ENCRYPT('234.567.890-12','saep2026'),'bruno@email.com','(11) 97777-2222','1990-07-22'),
('Camila Ferreira',AES_ENCRYPT('345.678.901-23','saep2026'),'camila@email.com','(11) 96666-3333','2001-11-05');


-- =========================================================
-- TABELA DE PLANOS DE TREINO
-- =========================================================

CREATE TABLE planos_treino(
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    objetivo VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    frequencia_semanal INT NOT NULL,
    data_inicio DATE NOT NULL,
    FOREIGN KEY(aluno_id) REFERENCES alunos(id)
);

INSERT INTO planos_treino
(aluno_id,objetivo,descricao,frequencia_semanal,data_inicio)

VALUES

(1,'Emagrecimento','Treino aeróbico + musculação leve',4,'2026-10-01'),
(2,'Hipertrofia','Musculação com divisão ABC',5,'2026-10-05'),
(3,'Condicionamento','Treino funcional e alongamento',3,'2026-10-10');


-- =========================================================
-- TABELA DE AGENDAMENTOS (AULAS COM PERSONAL)
-- =========================================================

CREATE TABLE agendamentos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    plano_id INT NOT NULL,
    personal VARCHAR(100) NOT NULL,
    data_aula DATE NOT NULL,
    horario TIME NOT NULL,
    FOREIGN KEY(plano_id) REFERENCES planos_treino(id)
);

INSERT INTO agendamentos
(plano_id,personal,data_aula,horario)

VALUES

(2,'Marcos Personal','2026-11-12','08:00:00'),
(1,'Juliana Personal','2026-11-10','18:00:00'),
(3,'Marcos Personal','2026-11-11','07:00:00');
