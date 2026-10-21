# Simulado SAEP — Academia de Ginástica

Sistema de cadastro de **alunos**, **planos de treino** e **agendamentos de aulas** com personal trainer,
com login com expiração de sessão e CPF / senha criptografados no banco (LGPD).

## Entregas

| Nº | Entrega | Arquivo |
|----|---------|---------|
| 1 | Documentação (requisitos funcionais) | `documentacao.pdf` |
| 2 | Diagrama entidade-relacionamento | `der.png` |
| 3 | Script de criação e população do banco | `saep_db.sql` |
| 4–8 | Código-fonte (login, principal, alunos, planos, agendamentos) | pasta `sistema/` |

A pasta `docs/` guarda o HTML usado para gerar o PDF e o PNG (para editar depois).

## Estrutura

```text
sistema/
├── backend/
│   ├── app.js          (rotas da API: login, alunos, planos, agendamentos)
│   ├── db.js           (conexão com o MySQL)
│   └── package.json
└── frontend/
    ├── login.html / login.js
    ├── sessao.js       (verifica login e expiração da sessão)
    ├── principal.html
    ├── alunos.html / alunos.js
    ├── planos.html / planos.js
    ├── agendamentos.html / agendamentos.js
    └── style.css
```

## Como executar

1. No MySQL Workbench, execute o script `saep_db.sql`.
2. Confira usuário e senha do MySQL em `sistema/backend/db.js`.
3. No terminal:

```bash
cd sistema/backend
npm install
node app.js
```

4. Abra `sistema/frontend/login.html` no navegador (ou com o Live Server).

Usuários de teste: `admin`, `carla`, `ricardo` — senha `123`.

## Segurança (LGPD)

- **Senha**: gravada com `SHA2(senha,256)`; o login compara o hash.
- **CPF**: gravado com `AES_ENCRYPT(cpf,'saep2026')` e lido com `AES_DECRYPT`. Na listagem aparece mascarado.
- **Sessão**: expira em 30 minutos (`login.js` grava o horário de expiração e `sessao.js` confere).
