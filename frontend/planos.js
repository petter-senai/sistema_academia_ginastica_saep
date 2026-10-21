carregarAlunos();

listarPlanos();

//PREENCHE O SELECT COM OS ALUNOS CADASTRADOS
async function carregarAlunos(){

    const resposta =
        await fetch('http://localhost:3025/alunos');

    const alunos =
        await resposta.json();

    const select =
        document.getElementById('aluno_id');

    alunos.forEach(aluno=>{

        select.innerHTML += `

        <option value="${aluno.id}">${aluno.nome}</option>

        `;

    });

}

async function listarPlanos(){

    const resposta =
        await fetch('http://localhost:3025/planos');

    const planos =
        await resposta.json();

    montarTabela(planos);

}

//converte 2026-11-10 para 10/11/2026
function formatarData(data){

    const partes = data.split('-');

    return partes[2] + '/' + partes[1] + '/' + partes[0];

}

function montarTabela(planos){

    const tabela =
        document.getElementById('tabelaPlanos');

    tabela.innerHTML='';

    planos.forEach(plano=>{

        tabela.innerHTML += `

        <tr>

            <td>${plano.id}</td>

            <td>${plano.aluno_nome}</td>

            <td>${plano.objetivo}</td>

            <td>${plano.descricao}</td>

            <td>${plano.frequencia_semanal}x por semana</td>

            <td>${formatarData(plano.data_inicio)}</td>

            <td>

                <button
                    onclick="editarPlano(${plano.id})">

                    Editar

                </button>

                <button
                    onclick="excluirPlano(${plano.id})">

                    Excluir

                </button>

            </td>

        </tr>

        `;

    });

}

async function cadastrarPlano(){

    const aluno_id =
        document.getElementById('aluno_id').value;

    const objetivo =
        document.getElementById('objetivo').value;

    const descricao =
        document.getElementById('descricao').value;

    const frequencia_semanal =
        document.getElementById('frequencia_semanal').value;

    const data_inicio =
        document.getElementById('data_inicio').value;

    if(aluno_id==''){

        alert('Selecione o aluno.');

        return;

    }

    if(objetivo==''){

        alert('Informe o objetivo.');

        return;

    }

    if(descricao==''){

        alert('Informe a descrição.');

        return;

    }

    if(frequencia_semanal=='' || frequencia_semanal<1 || frequencia_semanal>7){

        alert('Informe uma frequência semanal entre 1 e 7.');

        return;

    }

    if(data_inicio==''){

        alert('Informe a data de início.');

        return;

    }

    const resposta =
        await fetch(

        'http://localhost:3025/planos',

        {

            method:'POST',

            headers:{

                'Content-Type':'application/json'

            },

            body:JSON.stringify({

                aluno_id,

                objetivo,

                descricao,

                frequencia_semanal,

                data_inicio

            })

        }

    );

    const dados =
        await resposta.json();

    alert(dados.mensagem);

    if(resposta.ok){

        limparCampos();

        listarPlanos();

    }

}

async function editarPlano(id){

    const resposta =
        await fetch(

            `http://localhost:3025/planos/${id}`

        );

    const plano =
        await resposta.json();

    const objetivo =
        prompt('Objetivo',plano.objetivo);

    if(objetivo==null) return;

    const descricao =
        prompt('Descrição',plano.descricao);

    if(descricao==null) return;

    const frequencia =
        prompt(

            'Frequência semanal (dias)',

            plano.frequencia_semanal

        );

    if(frequencia==null) return;

    const data_inicio =
        prompt(

            'Data de início (AAAA-MM-DD)',

            plano.data_inicio

        );

    if(data_inicio==null) return;

    const respostaPut =
        await fetch(

        `http://localhost:3025/planos/${id}`,

        {

            method:'PUT',

            headers:{

                'Content-Type':'application/json'

            },

            body:JSON.stringify({

                objetivo,

                descricao,

                frequencia_semanal:frequencia,

                data_inicio

            })

        }

    );

    const dados =
        await respostaPut.json();

    alert(dados.mensagem);

    listarPlanos();

}

async function excluirPlano(id){

    const confirmacao = confirm(

        'Deseja excluir este plano de treino?'

    );

    if(!confirmacao) return;

    const resposta =
        await fetch(

        `http://localhost:3025/planos/${id}`,

        {

            method:'DELETE'

        }

    );

    const dados =
        await resposta.json();

    alert(dados.mensagem);

    listarPlanos();

}

function limparCampos(){

    document.getElementById('aluno_id').value='';

    document.getElementById('objetivo').value='';

    document.getElementById('descricao').value='';

    document.getElementById('frequencia_semanal').value='';

    document.getElementById('data_inicio').value='';

}
