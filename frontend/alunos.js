listarAlunos();

async function listarAlunos(){
    document.getElementById('busca').value = '';

    const resposta = await fetch('http://localhost:3025/alunos');
    const alunos = await resposta.json();
    montarTabela(alunos);
}

//BUSCA: o usuário digita o termo e confirma no botão Pesquisar
async function pesquisarAluno(){
    const termo = document.getElementById('busca').value;

    if(termo==''){
        listarAlunos();
        return;
    }

    const resposta = await fetch(`http://localhost:3025/alunos/busca/${termo}`);
    const alunos = await resposta.json();

    if(alunos.length==0){
        alert('Nenhum aluno encontrado.');
    }

    montarTabela(alunos);
}

//LGPD: na listagem o CPF aparece mascarado (ex: ***.456.789-**)
function mascararCpf(cpf){
    if(!cpf) return '';
    return '***' + cpf.substring(3, 11) + '-**';
}

//converte 2026-11-10 para 10/11/2026
function formatarData(data){
    const partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function montarTabela(alunos){
    const tabela = document.getElementById('tabelaAlunos');
    tabela.innerHTML = '';

    alunos.forEach(aluno=>{
        tabela.innerHTML += `
        <tr>
            <td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${mascararCpf(aluno.cpf)}</td>
            <td>${aluno.email}</td>
            <td>${aluno.telefone}</td>
            <td>${formatarData(aluno.data_nascimento)}</td>
            <td>
                <button onclick="editarAluno(${aluno.id})">Editar</button>
                <button onclick="excluirAluno(${aluno.id})">Excluir</button>
            </td>
        </tr>
        `;
    });
}

async function cadastrarAluno(){
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const data_nascimento = document.getElementById('data_nascimento').value;

    if(nome==''){
        alert('Informe o nome.');
        return;
    }

    if(cpf==''){
        alert('Informe o CPF.');
        return;
    }

    if(email==''){
        alert('Informe o e-mail.');
        return;
    }

    if(telefone==''){
        alert('Informe o telefone.');
        return;
    }

    if(data_nascimento==''){
        alert('Informe a data de nascimento.');
        return;
    }

    const resposta = await fetch('http://localhost:3025/alunos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            cpf,
            email,
            telefone,
            data_nascimento
        })
    });

    const dados = await resposta.json();
    alert(dados.mensagem);

    if(resposta.ok){
        limparCampos();
        listarAlunos();
    }
}

async function editarAluno(id){
    const resposta = await fetch(`http://localhost:3025/alunos/${id}`);
    const aluno = await resposta.json();

    const nome = prompt('Nome', aluno.nome);
    if(nome==null) return;

    const cpf = prompt('CPF', aluno.cpf);
    if(cpf==null) return;

    const email = prompt('E-mail', aluno.email);
    if(email==null) return;

    const telefone = prompt('Telefone', aluno.telefone);
    if(telefone==null) return;

    const data_nascimento = prompt('Data de nascimento (AAAA-MM-DD)', aluno.data_nascimento);
    if(data_nascimento==null) return;

    const respostaPut = await fetch(`http://localhost:3025/alunos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            cpf,
            email,
            telefone,
            data_nascimento
        })
    });

    const dados = await respostaPut.json();
    alert(dados.mensagem);
    listarAlunos();
}

async function excluirAluno(id){
    const confirmacao = confirm('Deseja excluir este aluno?');
    if(!confirmacao) return;

    const resposta = await fetch(`http://localhost:3025/alunos/${id}`, {
        method: 'DELETE'
    });

    const dados = await resposta.json();
    alert(dados.mensagem);
    listarAlunos();
}

function limparCampos(){
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('data_nascimento').value = '';
}
