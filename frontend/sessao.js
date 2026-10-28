//=========================================================
// CONTROLE DE SESSÃO
// Este arquivo é carregado em todas as páginas protegidas.
//=========================================================

const usuario = JSON.parse(localStorage.getItem('usuario'));
const expira = localStorage.getItem('expira');

//não está logado
if(!usuario){
    window.location.href = 'login.html';
}
//sessão expirada
else if(!expira || Date.now() > Number(expira)){
    alert('Sua sessão expirou. Faça login novamente.');
    logout();
}

//verifica a expiração a cada 30 segundos, mesmo sem trocar de página
setInterval(()=>{
    if(Date.now() > Number(localStorage.getItem('expira'))){
        alert('Sua sessão expirou. Faça login novamente.');
        logout();
    }
}, 30000);

function logout(){
    localStorage.removeItem('usuario');
    localStorage.removeItem('expira');
    window.location.href = 'login.html';
}

function voltar(){
    window.location.href = 'principal.html';
}
