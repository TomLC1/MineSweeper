/*  LTI - ITW - 21/22 
 Grupo 42 TP21 Nº58646 Nº58617 Nº58671 */
/*----------------------------------------------------------------------*/
/* Valor das váriaveis de omissão do jogo */
const NUM_LINHAS_OMISSAO = 9;
const NUM_COLUNAS_OMISSAO = 9;
const DIFICULDADE_OMISSAO = 0.14;

/*----------------------------------------------------------------------*/
/* Variavel para saber se o click é o primeiro click */
var primeiroClick= false;

/*----------------------------------------------------------------------*/
/* Obejto do tabuleiro */
let tabuleiro = {
    numeroLinhas: NUM_LINHAS_OMISSAO,
    numeroColunas: NUM_COLUNAS_OMISSAO,
    dificuldade: DIFICULDADE_OMISSAO,
    numeroBombas: 0,
};

/* Array onde são guardadas as celulas exploradas */
let visitados = [];

/* Array com lista de celulas */
let cells = [];

/*----------------------------------------------------------------------*/

/* Função para buscar valor de uma cookie */
function buscarCookie(nome) {
    var value = `; ${document.cookie}`;
    var partes = value.split(`; ${nome}=`);
    if (partes.length === 2) return partes.pop().split(';').shift();
}

/*----------------------------------------------------------------------*/

/* Função para criar tabuleiro */
function CriarTabuleiro() {
    /* Calcula o número de células total (linhas x colunas) */ 
    if (buscarCookie("largura")!= undefined && buscarCookie("altura")!= undefined && buscarCookie("dificuldade") != undefined){
        /* Vai buscar a dificuldade para definir o número de bombas (definido em percentagem) ex. 0.16 = 16% do tabuleiro são bombas */
        tabuleiro.dificuldade = buscarCookie("dificuldade");
        /* Para cada caso atribui um valor de dificuldade, caso não haja nenhum selcionado o default é 0.16 */
        switch(tabuleiro.dificuldade){
            case 'easy': tabuleiro.dificuldade = 0.14;break;
            case 'medium': tabuleiro.dificuldade = 0.25;break;
            case 'hard': tabuleiro.dificuldade = 0.37;break;
            default: tabuleiro.dificuldade = 0.14;break;
        }
        tabuleiro.numeroColunas = buscarCookie("largura");
        tabuleiro.numeroLinhas = buscarCookie("altura");
        tabuleiro.numeroBombas = parseInt((tabuleiro.numeroColunas*tabuleiro.numeroLinhas)*tabuleiro.dificuldade);
    }
    else{
        tabuleiro.numeroBombas = parseInt((tabuleiro.numeroColunas*tabuleiro.numeroLinhas)*tabuleiro.dificuldade);
    }
    /* Insere o div onde vai estar o tabuleiro no main */
    var main = document.getElementById("main");
    main.innerHTML= "<div class='text-center mb-2' id='flags'>Flags: "+tabuleiro.numeroBombas+"</div><div class='Minesweeper single' id='tab1'></div>";
    var tabuleiroJogo = document.getElementById("tab1");

    /* Cria as celulas dentro do tabuleiro */
    for(let y=0;y<tabuleiro.numeroLinhas;y++){
        /* Adiciona uma linha */
        tabuleiroJogo.innerHTML += "<div id='l"+y+"'></div>";
        var linha = document.getElementById("l"+y); 
        /* Adiciona as celulas à linha */
        for(i=0;i<tabuleiro.numeroColunas;i++){
            linha.innerHTML += "<div class='celula' id='l"+y+"c"+i+"'></div>";
            cells.push({
                id: 'l'+y+'c'+i,
                adjacentes: 0,
                bomba: false,
                areaLivre:false,
                visitado: false

            });
        }
    }

    /* Adiciona o evento click a todas as celulas */
    const elements = document.querySelectorAll('.celula');
    for (var i = 0 ; i < elements.length; i++) {
        elements[i].addEventListener('click', celulaClick, false ) ; 
        elements[i].addEventListener('contextmenu', celulaFlag, false );
        elements[i].addEventListener('mousedown', celulaDuvida, false);
     }
}

/* Gerar número aleatório entre min e max */
function numAleatorio(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
/* Função para obter o utilizador logado */
function getLoggedUser() {
    return localStorage.getItem("loggedUser");
}


/* Certifica que nas celulas adjacentes à primeira não há bombas */
function gerarAreaLivre(l,c) {
    /* Lista de casas onde é necessário procurar */
    var moves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    /* Adiciona a class areaLivre à celula para não gerar bombas lá */
    for(let x=0; x<moves.length; x++){
        /* Verifica se as celulcas com esses indices fazem parte do tabuleiro */
        if(parseInt(l+moves[x][0]) >=0 && parseInt(c+moves[x][1]) >=0 && parseInt(l+moves[x][0]) <tabuleiro.numeroLinhas &&  parseInt(c+moves[x][1]) <tabuleiro.numeroColunas){
            cells.find(cell =>cell.id === "l"+parseInt(l+moves[x][0])+"c"+parseInt(c+moves[x][1])).areaLivre = true;
        }
    }

}

/* Atribui números ás celulas conforme as bombas que adjacentes */
function gerarNumeros(l,c) {
    /* Lista de casas onde é necessário procurar */
    var moves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    /* Procura bombas nas casas adjacentes */
    for(let x=0; x<moves.length; x++){
        /* Verifica se as celulcas com esses indices fazem parte do tabuleiro */
        if(parseInt(l+moves[x][0]) >=0 && parseInt(c+moves[x][1]) >=0 && parseInt(l+moves[x][0]) <tabuleiro.numeroLinhas &&  parseInt(c+moves[x][1]) <tabuleiro.numeroColunas){
            /* Se existir uma bomba adjacente adiciona mais 1 ao 'data-num' */
            cells.find(cell => cell.id === "l"+parseInt(l+moves[x][0])+"c"+parseInt(c+moves[x][1])).adjacentes+=1;
        }
    }

}

/* Função para mostrar as flags em cada celula */
function mostrarFlags(num) {
    document.getElementById("flags").innerHTML="Flags:"+num;
}
/* Função para fazer o modo Contra relógio */
function contraRelogio(){
    /* Verifica se o tempo atual já atingiu o limite, se sim para os timers e termina o jogo */
    if(seconds==buscarCookie("time"))
    {
        clearInterval(temporizador);
        clearInterval(timer);
        terminarJogo("You lost!","Be more fast next time :(");
    }
    
}

/*-----------timer-----------*/

let [milliseconds,seconds,minutes] = [0,0,0];
let timerRef = document.getElementById('timerDisplay');
let timer = null;

/* Função para mostrar o tempo no relógio do jogo */
function displayTimer() {
    milliseconds+=10;
    if(milliseconds == 1000){
        milliseconds = 0;
        seconds++;
        if(seconds == 60){
            seconds = 0;
            minutes++;
        }
    }

    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;

    timerRef.innerHTML = ` ${m} : ${s} : ${ms}`;
}

/*----------------------------------------*/



/* Gera as bombas aleatóriamente no tabuleiro */
function gerarBombas() {
    if(buscarCookie("gameMode")=="timetrial"){
        let contador = buscarCookie("time");
        if(timer!==null){
            clearInterval(int);
        }
        temporizador = setInterval(contraRelogio,10);
        timer = setInterval(displayTimer,10);
        displayTimer();
    }
    else{
        if(timer!==null){
            clearInterval(int);
        }
        timer = setInterval(displayTimer,10);
        displayTimer();
    }
    
    /* Multiplica o numero de celulas pela percentagem de bombas para definir o número de bombas */
    tabuleiro.numeroBombas = parseInt((tabuleiro.numeroLinhas*tabuleiro.numeroColunas)*tabuleiro.dificuldade);
    var celulas = tabuleiro.numeroLinhas*tabuleiro.numeroColunas;
    for(let i=0;i<tabuleiro.numeroBombas;i++){
        /* Gera um número aleatório entre 0 e o número total de celulas */
        let numero = numAleatorio(0,celulas-1);
        /* Divide o numero gerado pelo número de linhas para saber a que linha pertence */
        var l = Math.floor(numero/tabuleiro.numeroColunas);
        /* O resto da divisão corresponde ao nr da coluna na linha */
        var c = numero%tabuleiro.numeroColunas;
        /* Se por acaso no numero gerado já existir uma bomba, gera outro número até calhar uma celula sem bomba */
        
        while(document.getElementById("l"+l+"c"+c).classList!="celula" || cells.find(cell => cell.id ==="l"+l+"c"+c).bomba === true || cells.find(cell => cell.id ==="l"+l+"c"+c).areaLivre === true){
            numero = numAleatorio(0,celulas-1);
        l = Math.floor(numero/tabuleiro.numeroColunas);
        c = numero%tabuleiro.numeroColunas;
        }
        /* Adiciona a class bomba à celula, esta classe permite ver quais são as celulas que já estão ocupadas */
        cells.find(cell => cell.id === "l"+l+"c"+c).bomba=true;
        /* Adiciona 1 à contagem de bombas de cada célula adjacente */
        gerarNumeros(l,c);
    }
}

/* Função para reiniciar o jogo */
function reiniciar() {
    tempoDeJogoTotal([minutes,seconds,milliseconds]);
    window.location.reload()
}
/* Função para explorar automaticamente as celulas vizinhas */
function verificarVizinhos(linha, coluna) {
    let celulaId = "l"+linha+"c"+coluna;
    if (visitados.includes(celulaId) === false) {
        cells.find(cell => cell.id == celulaId).visitado=true;
        visitados.push(celulaId);
        if(cells.find(cell => cell.id === celulaId).adjacentes === 0) {
            document.getElementById(celulaId).style.background="black";
             /* Verifica em cima */
            if (linha > '0') {
                verificarVizinhos(linha-1, coluna);}
            /* Verifica em cima à direita */
            if (linha > '0' && coluna+1 < tabuleiro.numeroColunas) {
                verificarVizinhos(linha-1, coluna+1);}
             /* Verifica à direita */
            if (coluna+1 < tabuleiro.numeroColunas) {
                verificarVizinhos(linha, coluna+1);}
            /* Verifica em baixo à direita */
            if (linha + 1 < tabuleiro.numeroLinhas && coluna+1 < tabuleiro.numeroColunas) {
                verificarVizinhos(linha+1, coluna+1);}
            /* Verifica em baixo */
            if (linha + 1 < tabuleiro.numeroLinhas) {
                verificarVizinhos(linha+1, coluna);}
           /* Verifica em baixo à esquerda */
           if (linha + 1 < tabuleiro.numeroLinhas && coluna > '0') {
            verificarVizinhos(linha+1, coluna-1);}
            /* Verifica à esquerda */
            if (coluna > '0') {
                verificarVizinhos(linha, coluna-1);}
            /* Verifica em cima à esquerda */
            if (linha > '0' && coluna > '0') {
                verificarVizinhos(linha-1, coluna-1);}                
        }
        else if(cells.find(cell => cell.id === celulaId).adjacentes != 0) {
            document.getElementById(celulaId).innerHTML = cells.find(cell => cell.id === celulaId).adjacentes;
            document.getElementById(celulaId).style.background="black";
        }
    }   
}

/* Função para terminar o jogo */
/* Recebe o resultado, vitoria ou derrota e uma frase complementar */
function terminarJogo(resultado,frase) {
    document.getElementById("endGameModal").style.display='block';
    document.getElementById("resultado").innerHTML=resultado;
    document.getElementById("frase").innerHTML=frase;
}

/* Função para guardar o score na localStorage */
function guardarScore(tempo) {
    let scores = JSON.parse(window.localStorage.getItem('scores')) || []
    let resultado = {
        user: getLoggedUser(),
        temp: tempo,
        mode: tabuleiro.dificuldade
    }
    scores.push(resultado); 
    window.localStorage.setItem('scores',JSON.stringify(scores));
}

/* Função para adicionar o tempo de jogo ao tempo total de jogo na localStorage */
function tempoDeJogoTotal(tempo){
    let userPlayTime = JSON.parse(window.localStorage.getItem('lista')).find(user => user['user'] === getLoggedUser()).playTime
    userPlayTime[0] += tempo[1];
    if (userPlayTime[0] > 60){
        userPlayTime[0] -= 60;
        userPlayTime[1]++; 
    }
    userPlayTime[1] += tempo[0]
    if (userPlayTime[1] > 60){
        userPlayTime[1] -= 60;
        userPlayTime[2]++;
    }
    let users = JSON.parse(window.localStorage.getItem('lista'))
    users.find(user => user['user'] === getLoggedUser()).playTime = userPlayTime
    window.localStorage.setItem('lista', JSON.stringify(users))
}

/* Função para ordenar os scores */
function ordernarScores(scores) {
    res = []
    var newArray = scores.filter(score => score.mode == 0.37);

    let hard = newArray.sort(function(a, b){return ((a.temp[0]*60000) + (a.temp[1]*1000) +(a.temp[2])) - ((b.temp[0]*60000) + (b.temp[1]*1000) +(b.temp[2]))});
    res = res.concat(newArray);
    newArray = scores.filter(score => score.mode == 0.25);

    let medium = newArray.sort(function(a, b){return ((a.temp[0]*60000) + (a.temp[1]*1000) +(a.temp[2])) - ((b.temp[0]*60000) + (b.temp[1]*1000) +(b.temp[2]))});
    res = res.concat(newArray);
    newArray = scores.filter(score => score.mode == 0.14);

    let easy = newArray.sort(function(a, b){return ((a.temp[0]*60000) + (a.temp[1]*1000) +(a.temp[2])) - ((b.temp[0]*60000) + (b.temp[1]*1000) +(b.temp[2]))});
    res = res.concat(newArray);
    return [hard,medium,easy]
}

/* Função para mostrar os scores na tabela */
function mostrarScores() {
    document.getElementById("scores").style.display ="block";
    let scores = JSON.parse(window.localStorage.getItem('scores')) || [];
    let loop = 10
    scores = ordernarScores(scores);
    for(let x = 0; x<3;x++){
        if (scores[x][0]!=undefined){
        
            if (scores[x].length<10){
                loop = scores[x].length;
            }
            else{
                loop = 10
            }
            for(let y=0;y<loop;y++){
                let dificuldade = "" ;
                switch(scores[x][y].mode){
                    case 0.14 : dificuldade = "easy" ;break;
                    case 0.25 : dificuldade = "medium";break;
                    case 0.37: dificuldade = "hard";break;
                }
                document.getElementById("scoreTab"+dificuldade).innerHTML += "<tr><td>"+scores[x][y].user +"</td><td>"+ scores[x][y].temp[0] + ":"+scores[x][y].temp[1] +""+":"+scores[x][y].temp[2] +"</td></tr>";
            }
        }
        else{
            let dificuldade = "" ;
            switch(x){
                case 2 : dificuldade = "easy" ;break;
                case 1 : dificuldade = "medium";break;
                case 0: dificuldade = "hard";break;
            }
            document.getElementById("scoreTab"+dificuldade).innerHTML +="<tr><td colspan='2'>Não tem registos de jogos</td></tr>"
        }
    }
    
    
}

/* Função ativada quando se clicka numa celula */
function celulaClick() {
    if(document.getElementById(this.id).classList.contains("flag")==false && document.getElementById(this.id).classList.contains("duvida")==false){
        let linha = parseInt(this.id.split("c")[0].replace("l",""));
        let coluna = parseInt(this.id.split("c")[1]);
        /* Verifica se o click corresponde ao primeiro click, se for o caso adiciona a classe firstClick, o que faz com que seja impossivel colocar uma bomba na primeira celula */
        if (primeiroClick == false){
            document.getElementById(this.id).classList = "celula firstClick";
            /* Define a cor de fundo após clickar */ 
            document.getElementById(this.id).style.background="black";
            gerarAreaLivre(linha, coluna);
            gerarBombas();
            primeiroClick = true;
            verificarVizinhos(linha, coluna);
            
        }
        else if(cells.find(cell => cell.id === this.id).bomba === true){
                clearInterval(timer);
                visitados.push("l${linha}c${coluna}");
                document.getElementById(this.id).style.backgroundImage="url('./img/bomba.png')";
                document.getElementById(this.id).style.backgroundSize="cover";
                terminarJogo("You lost!","Be more careful next time :(");
                tempoDeJogoTotal([minutes,seconds,milliseconds]);
        }
        else {
            if(buscarCookie("gameMode")=="timetrial"){
                [milliseconds,seconds,minutes]=[0,0,0];
            }
            
            if(visitados.length == parseInt(tabuleiro.numeroColunas*tabuleiro.numeroLinhas*(1-tabuleiro.dificuldade))){
                if(buscarCookie("gameMode")=="timetrial"){
                    clearInterval(temporizador)
                    clearInterval(timer);          
                    terminarJogo("YOU WON!", "Nice work soldier, keep grinding for a better score!");
                }
                else{
                    clearInterval(timer);
                    guardarScore([minutes,seconds,milliseconds]);
                    terminarJogo("YOU WON!", "Nice work soldier, keep grinding for a better score! <hr> Your score was "+minutes+":"+seconds+":"+milliseconds);
                    mostrarScores();
                    tempoDeJogoTotal([minutes,seconds,milliseconds]);
                }
                
            }
            verificarVizinhos(linha, coluna);
        }
        
    }
    
}

function celulaFlag() {
    let element = document.getElementById(this.id);
    let flags = document.getElementsByClassName("flag");
    if (document.getElementsByClassName("firstClick").length!= 0 && cells.find(cell => cell.id == this.id).visitado===false && element.classList.contains("duvida")===false){
        if(element.classList.contains("flag")){
            element.classList.remove('flag');
        }
        else{
            
            if(flags.length<tabuleiro.numeroBombas){
                element.classList+=" flag"; 
            }
        }
        mostrarFlags(tabuleiro.numeroBombas-flags.length);
        event.preventDefault();
    }
}

function celulaDuvida(e) {
    let element = document.getElementById(this.id);
    if (e.button == 1) {
        if (document.getElementsByClassName("firstClick").length!= 0 && cells.find(cell => cell.id == this.id).visitado===false && element.classList.contains("flag") === false){
            if(element.classList.contains("duvida")){
                element.classList.remove("duvida");
            }
            else{
                element.classList+=" duvida"; 
            }
        }
    }
    event.preventDefault();
}    

function principal() {
    CriarTabuleiro();
}

window.onload = function() {
    principal();
}

