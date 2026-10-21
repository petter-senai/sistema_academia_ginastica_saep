//TEMPO DE EXPIRAÇÃO DA SESSÃO (30 minutos)
const TEMPO_SESSAO = 30 * 60 * 1000;

async function entrar(){

    const login =
    document.getElementById('login').value;

    const senha =
    document.getElementById('senha').value;

    const mensagem =
    document.getElementById('mensagem');

    mensagem.innerHTML = '';

    if(login==""){

        mensagem.innerHTML = "Informe o login.";

        return;

    }

    if(senha==""){

        mensagem.innerHTML = "Informe a senha.";

        return;

    }

    try{

        const resposta = await fetch(

            'http://localhost:3025/login',

            {

                method:'POST',

                headers:{

                    'Content-Type':'application/json'

                },

                body:JSON.stringify({

                    login,

                    senha

                })

            }

        );

        const dados = await resposta.json();

        if(dados.sucesso){

            localStorage.setItem(

                'usuario',

                JSON.stringify(dados.usuario)

            );

            //guarda o horário em que a sessão vai expirar
            localStorage.setItem(

                'expira',

                Date.now() + TEMPO_SESSAO

            );

            window.location.href="principal.html";

        }

        else{

            //falha na autenticação
            mensagem.innerHTML = dados.mensagem;

            document.getElementById('senha').value = '';

        }

    }

    catch(erro){

        mensagem.innerHTML = "Não foi possível conectar ao servidor.";

    }

}
