carregarPlanos();

listarAgendamentos();

//PREENCHE O SELECT COM OS PLANOS DE TREINO (E O NOME DO ALUNO)
async function carregarPlanos(){

    const resposta =
        await fetch('http://localhost:3025/planos');

    const planos =
        await resposta.json();

    const select =
        document.getElementById('plano_id');

    planos.forEach(plano=>{

        select.innerHTML += `

        <option value="${plano.id}">${plano.aluno_nome} - ${plano.objetivo}</option>

        `;

    });

}

//A API JÁ DEVOLVE A LISTA ORDENADA POR DATA DA AULA
async function listarAgendamentos(){

    const resposta =
        await fetch('http://localhost:3025/agendamentos');

    const agendamentos =
        await resposta.json();

    montarTabela(agendamentos);

}

//converte 2026-11-10 para 10/11/2026
function formatarData(data){

    const partes = data.split('-');

    return partes[2] + '/' + partes[1] + '/' + partes[0];

}

//LGPD: CPF mascarado na listagem
function mascararCpf(cpf){

    if(!cpf) return '';

    return '***' + cpf.substring(3, 11) + '-**';

}

function montarTabela(agendamentos){

    const tabela =
        document.getElementById('tabelaAgendamentos');

    tabela.innerHTML='';

    agendamentos.forEach(ag=>{

        tabela.innerHTML += `

        <tr>

            <td>${ag.id}</td>

            <td>${formatarData(ag.data_aula)}</td>

            <td>${ag.horario.substring(0,5)}</td>

            <td>${ag.personal}</td>

            <td>${ag.aluno_nome}</td>

            <td>${mascararCpf(ag.aluno_cpf)}</td>

            <td>${ag.aluno_email}</td>

            <td>${ag.aluno_telefone}</td>

            <td>${formatarData(ag.aluno_nascimento)}</td>

            <td>${ag.objetivo}</td>

            <td>${ag.descricao}</td>

            <td>${ag.frequencia_semanal}x por semana</td>

            <td>${formatarData(ag.data_inicio)}</td>

            <td>

                <button
                    onclick="editarData(${ag.id})">

                    Alterar Data

                </button>

                <button
                    onclick="excluirAgendamento(${ag.id})">

                    Excluir

                </button>

            </td>

        </tr>

        `;

    });

}

async function cadastrarAgendamento(){

    const plano_id =
        document.getElementById('plano_id').value;

    const personal =
        document.getElementById('personal').value;

    const data_aula =
        document.getElementById('data_aula').value;

    const horario =
        document.getElementById('horario').value;

    if(plano_id==''){

        alert('Selecione o plano de treino.');

        return;

    }

    if(personal==''){

        alert('Informe o personal trainer.');

        return;

    }

    if(data_aula==''){

        alert('Informe a data da aula.');

        return;

    }

    if(horario==''){

        alert('Informe o horário.');

        return;

    }

    const resposta =
        await fetch(

        'http://localhost:3025/agendamentos',

        {

            method:'POST',

            headers:{

                'Content-Type':'application/json'

            },

            body:JSON.stringify({

                plano_id,

                personal,

                data_aula,

                horario

            })

        }

    );

    const dados =
        await resposta.json();

    alert(dados.mensagem);

    if(resposta.ok){

        limparCampos();

        listarAgendamentos();

    }

}

//ATUALIZA A DATA DE UM AGENDAMENTO JÁ CADASTRADO
async function editarData(id){

    const resposta =
        await fetch(

            `http://localhost:3025/agendamentos/${id}`

        );

    const agendamento =
        await resposta.json();

    const data_aula =
        prompt(

            'Nova data da aula (AAAA-MM-DD)',

            agendamento.data_aula

        );

    if(data_aula==null) return;

    const horario =
        prompt(

            'Horário (HH:MM)',

            agendamento.horario.substring(0,5)

        );

    if(horario==null) return;

    const respostaPut =
        await fetch(

        `http://localhost:3025/agendamentos/${id}`,

        {

            method:'PUT',

            headers:{

                'Content-Type':'application/json'

            },

            body:JSON.stringify({

                data_aula,

                horario

            })

        }

    );

    const dados =
        await respostaPut.json();

    alert(dados.mensagem);

    listarAgendamentos();

}

async function excluirAgendamento(id){

    const confirmacao = confirm(

        'Deseja excluir este agendamento?'

    );

    if(!confirmacao) return;

    const resposta =
        await fetch(

        `http://localhost:3025/agendamentos/${id}`,

        {

            method:'DELETE'

        }

    );

    const dados =
        await resposta.json();

    alert(dados.mensagem);

    listarAgendamentos();

}

function limparCampos(){

    document.getElementById('plano_id').value='';

    document.getElementById('personal').value='';

    document.getElementById('data_aula').value='';

    document.getElementById('horario').value='';

}
