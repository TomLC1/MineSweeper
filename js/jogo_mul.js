/*  LTI - ITW - 21/22 
 Grupo 42 TP21 Nº58646 Nº58617 Nº58671 */

const NUM_LINHAS_OMISSAO = 9;
const NUM_COLUNAS_OMISSAO = 9;
const DIFICULDADE_OMISSAO = 0.14;
const TEMPO_OMISSAO = 0.10;
var primeiroClick1= false;
var primeiroClick2= false;
let tabuleiro = {
    numeroLinhas: NUM_LINHAS_OMISSAO,
    numeroColunas: NUM_COLUNAS_OMISSAO,
    dificuldade: DIFICULDADE_OMISSAO,
    numeroBombas: 0,
};
let visitados = [];
let cells = [];
let tempo = TEMPO_OMISSAO;
var temporizador = 0;
var quaseMorto = false;


/* Função para buscar valor de uma cookie */
function buscarCookie(nome) {
    var value = `; ${document.cookie}`;
    var partes = value.split(`; ${nome}=`);
    if (partes.length === 2) return partes.pop().split(';').shift();
}

function mostrarTempo(x){
    document.getElementById("tempo").innerHTML=x+" s";
}

function inicializar(){
    jogadores = document.forms.nomes;
    document.getElementById("jogador1Nome").innerHTML=jogadores[0].value;
    document.getElementById("jogador2Nome").innerHTML=jogadores[1].value;
    document.getElementById("nomesModal").style.display="none";
    tempo = jogadores[2].value;
    document.getElementById("disable1").classList.add("d-none");
    temporizador = setInterval(alternarJogadas,tempo*1000);
    if(timer!==null){
        clearInterval(int);
    }
    let ref = document.getElementById("timerDisplay1");
    timer = setInterval(displayTimer,10,ref);
    displayTimer(ref);
}

function alternarJogadas(){
    let dis1 = document.getElementById("disable1");
    let dis2 = document.getElementById("disable2");
    if(dis1.classList.contains("d-none")){
        dis1.classList.remove("d-none");
        dis2.classList.add("d-none");
        clearInterval(timer);
        [milliseconds,seconds,minutes] = [0,0,0];
        document.getElementById("timerDisplay1").innerHTML = '00:00:000';
        let ref = document.getElementById("timerDisplay2");
        timer = setInterval(displayTimer,10,ref);
        displayTimer(ref);
    }
    else{
        dis2.classList.remove("d-none");
        dis1.classList.add("d-none");
        clearInterval(timer);
        [milliseconds,seconds,minutes] = [0,0,0];
        document.getElementById("timerDisplay2").innerHTML = '00:00:000';
        let ref = document.getElementById("timerDisplay1");
        timer = setInterval(displayTimer,10,ref);
        displayTimer(ref);
    }

}

/* Função para criar tabuleiro */
function CriarTabuleiro(){
    
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
        tabuleiro.numeroColunas = 9;
        tabuleiro.numeroLinhas = 9;
        tabuleiro.numeroBombas = parseInt((tabuleiro.numeroColunas*tabuleiro.numeroLinhas)*tabuleiro.dificuldade);
    }else{
        tabuleiro.numeroBombas = parseInt((tabuleiro.numeroColunas*tabuleiro.numeroLinhas)*tabuleiro.dificuldade);
    }
    
    /* Insere o div onde vai estar o tabuleiro no main */
    var main = document.getElementById("main");
    main.innerHTML+= "<div class='d-flex justify-md-between'><div><div class='text-center mb-2' id='jogador1Nome'>Jogador 1</div><div class='text-center mb-2' id='flags1'>Flags: "+tabuleiro.numeroBombas+"</div><div class='timerDisplay' id='timerDisplay1'>00 : 00 : 000</div><div class='Minesweeper' id='tab1'><div class='disable' id='disable1'></div></div></div><div><div class='text-center mb-2' id='jogador2Nome'>Jogador 2</div><div class='text-center mb-2' id='flags2'>Flags: "+tabuleiro.numeroBombas+"</div><div class='timerDisplay' id='timerDisplay2'>00 : 00 : 000</div><div class='Minesweeper' id='tab2'><div class='disable' id='disable2'></div></div></div></div>";
    var tabuleiroJogo = document.getElementById("tab1");

    /* Cria as celulas dentro do tabuleiro */
    for(let y=0;y<tabuleiro.numeroLinhas;y++){
        /* Adiciona uma linha */
        tabuleiroJogo.innerHTML += "<div id='1l"+y+"'></div>";
        var linha = document.getElementById("1l"+y); 
        /* Adiciona as celulas à linha */
        for(i=0;i<tabuleiro.numeroColunas;i++){
            linha.innerHTML += "<div class='celula' id='1l"+y+"c"+i+"'></div>";
            cells.push({
                id: '1l'+y+'c'+i,
                adjacentes: 0,
                bomba: false,
                areaLivre:false,
                visitado: false

            });
        }
    }

    var tabuleiroJogo = document.getElementById("tab2");

    /* Cria as celulas dentro do tabuleiro */
    for(let y=0;y<tabuleiro.numeroLinhas;y++){
        /* Adiciona uma linha */
        tabuleiroJogo.innerHTML += "<div id='2l"+y+"'></div>";
        var linha = document.getElementById("2l"+y); 
        /* Adiciona as celulas à linha */
        for(i=0;i<tabuleiro.numeroColunas;i++){
            linha.innerHTML += "<div class='celula' id='2l"+y+"c"+i+"'></div>";
            cells.push({
                id: '2l'+y+'c'+i,
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
        elements[i].addEventListener('click' , celulaClick , false); 
        elements[i].addEventListener('contextmenu' , celulaFlag , false);
        elements[i].addEventListener('mousedown', celulaDuvida, false);
     }
}

/* Gerar número aleatório entre min e max */
function numAleatorio(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getLoggedUser(){
    return localStorage.getItem("loggedUser");
}


/* Certifica que nas celulas adjacentes à primeira não há bombas */
function gerarAreaLivre(l,c,tab){
    /* Lista de casas onde é necessário procurar */
    var moves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    /* Adiciona a class areaLivre à celula para não gerar bombas lá */
    for(let x=0; x<moves.length; x++){
        /* Verifica se as celulcas com esses indices fazem parte do tabuleiro */
        if(parseInt(l+moves[x][0]) >=0 && parseInt(c+moves[x][1]) >=0 && parseInt(l+moves[x][0]) <tabuleiro.numeroLinhas &&  parseInt(c+moves[x][1]) <tabuleiro.numeroColunas){
            cells.find(cell =>cell.id === tab+"l"+parseInt(l+moves[x][0])+"c"+parseInt(c+moves[x][1])).areaLivre = true;
        }
    }

}

/* Atribui números ás celulas conforme as bombas que adjacentes */
function gerarNumeros(l,c,tab){
    /* Lista de casas onde é necessário procurar */
    var moves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    /* Procura bombas nas casas adjacentes */
    for(let x=0; x<moves.length; x++){
        /* Verifica se as celulcas com esses indices fazem parte do tabuleiro */
        if(parseInt(l+moves[x][0]) >=0 && parseInt(c+moves[x][1]) >=0 && parseInt(l+moves[x][0]) <tabuleiro.numeroLinhas &&  parseInt(c+moves[x][1]) <tabuleiro.numeroColunas){
            /* Se existir uma bomba adjacente adiciona mais 1 ao 'data-num' */
            cells.find(cell => cell.id === tab+"l"+parseInt(l+moves[x][0])+"c"+parseInt(c+moves[x][1])).adjacentes+=1;
        }
    }

}

function mostrarFlags(num,tab){
    document.getElementById("flags"+tab).innerHTML="Flags: "+num;
}

/*-----------timer-----------*/
let [milliseconds,seconds,minutes] = [0,0,0];

let timer = null;

function displayTimer(ref){
    

    let timerRef = ref
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
function gerarBombas(tab){
    
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
        
        while(document.getElementById(tab+"l"+l+"c"+c).classList!="celula" || cells.find(cell => cell.id ===tab+"l"+l+"c"+c).bomba === true || cells.find(cell => cell.id ===tab+"l"+l+"c"+c).areaLivre === true){
            numero = numAleatorio(0,celulas-1);
        l = Math.floor(numero/tabuleiro.numeroColunas);
        c = numero%tabuleiro.numeroColunas;
        }
        /* Adiciona a class bomba à celula, esta classe permite ver quais são as celulas que já estão ocupadas */
        cells.find(cell => cell.id === tab+"l"+l+"c"+c).bomba=true;
        /* Adiciona 1 à contagem de bombas de cada célula adjacente */
        gerarNumeros(l,c,tab);
    }
}

function verificarVizinhos(linha, coluna,tab) {
    let celulaId = tab+"l"+linha+"c"+coluna;
    if (visitados.includes(celulaId) === false) {
        cells.find(cell => cell.id == celulaId).visitado=true;
        visitados.push(celulaId);
        if(cells.find(cell => cell.id === celulaId).adjacentes === 0) {
            document.getElementById(celulaId).style.background="black";
             /* Verifica em cima */
            if (linha > '0') {
                verificarVizinhos(linha-1, coluna,tab);}
            /* Verifica em cima à direita */
            if (linha > '0' && coluna+1 < tabuleiro.numeroColunas) {
                verificarVizinhos(linha-1, coluna+1,tab);}
             /* Verifica à direita */
            if (coluna+1 < tabuleiro.numeroColunas) {
                verificarVizinhos(linha, coluna+1,tab);}
            /* Verifica em baixo à direita */
            if (linha + 1 < tabuleiro.numeroLinhas && coluna+1 < tabuleiro.numeroColunas) {
                verificarVizinhos(linha+1, coluna+1,tab);}
            /* Verifica em baixo */
            if (linha + 1 < tabuleiro.numeroLinhas) {
                verificarVizinhos(linha+1, coluna,tab);}
           /* Verifica em baixo à esquerda */
           if (linha + 1 < tabuleiro.numeroLinhas && coluna > '0') {
            verificarVizinhos(linha+1, coluna-1,tab);}
            /* Verifica à esquerda */
            if (coluna > '0') {
                verificarVizinhos(linha, coluna-1,tab);}
            /* Verifica em cima à esquerda */
            if (linha > '0' && coluna > '0') {
                verificarVizinhos(linha-1, coluna-1,tab);}                
        }
        else if(cells.find(cell => cell.id === celulaId).adjacentes != 0) {
            document.getElementById(celulaId).innerHTML = cells.find(cell => cell.id === celulaId).adjacentes;
            document.getElementById(celulaId).style.background="black";
        }
        else{
        }
    }   
}

function terminarJogo(resultado,frase){
    document.getElementById("endGameModal").style.display='block';
    document.getElementById("resultado").innerHTML=resultado;
    document.getElementById("frase").innerHTML=frase;

}

function guardarScore(tempo){
    let scores = JSON.parse(window.localStorage.getItem('scores')) || []
    let resultado = {
        user: getLoggedUser(),
        temp: tempo,
        mode: tabuleiro.dificuldade
    }
    scores.push(resultado); 
    window.localStorage.setItem('scores',JSON.stringify(scores));

}

function ordernarScores(scores){
    res = []
    var newArray = scores.filter(score => score.mode == 0.37);

    newArray.sort(function(a, b){return ((a.temp[0]*60000) + (a.temp[1]*1000) +(a.temp[2])) - ((b.temp[0]*60000) + (b.temp[1]*1000) +(b.temp[2]))});
    res = res.concat(newArray);
    newArray = scores.filter(score => score.mode == 0.25);

    newArray.sort(function(a, b){return ((a.temp[0]*60000) + (a.temp[1]*1000) +(a.temp[2])) - ((b.temp[0]*60000) + (b.temp[1]*1000) +(b.temp[2]))});
    res = res.concat(newArray);

    newArray = scores.filter(score => score.mode == 0.14);

    newArray.sort(function(a, b){return ((a.temp[0]*60000) + (a.temp[1]*1000) +(a.temp[2])) - ((b.temp[0]*60000) + (b.temp[1]*1000) +(b.temp[2]))});
    res = res.concat(newArray);
    return res
}

function celulaClick(){
    if(document.getElementById(this.id).classList.contains("flag")==false && document.getElementById(this.id).classList.contains("duvida")==false){
        let tab = parseInt(this.id.split("l")[0]);
        let id = this.id.replace(tab,"");
        let linha = parseInt(id.split("c")[0].replace("l",""));
        let coluna = parseInt(id.split("c")[1]);
        /* Verifica se o click corresponde ao primeiro click, se for o caso adiciona a classe firstClick, o que faz com que seja impossivel colocar uma bomba na primeira celula */
        if ((tab==1 && primeiroClick1 == false) || (tab==2 && primeiroClick2 == false)){

            document.getElementById(this.id).classList = "celula firstClick";
            /* Define a cor de fundo após clickar */ 
            document.getElementById(this.id).style.background="black";
            gerarAreaLivre(linha, coluna,tab);
            gerarBombas(tab);
            if (tab==1){
                primeiroClick1 = true;
            }
            else{
                primeiroClick2 = true;
            }
            verificarVizinhos(linha, coluna,tab);
        }
        else if(cells.find(cell => cell.id === this.id).bomba === true){
                clearInterval(timer);
                visitados.push("l${linha}c${coluna}");
                document.getElementById(this.id).style.backgroundImage="url('./img/bomba.png')";
                document.getElementById(this.id).style.backgroundSize="cover";
                clearInterval(temporizador);
                let dis1 = document.getElementById("disable1");
                let dis2 = document.getElementById("disable2");
                if(quaseMorto == true){
                    terminarJogo("You both lost","Be more careful next time :(");
                }
                if (tab==1){
                    var loser = jogadores[0].value;
                    dis1.style.display="block";
                    dis2.style.display="none";
                    quaseMorto = true;
                    
                }
                else{
                    var loser = jogadores[1].value;
                    dis2.style.display="block";
                    dis1.style.display="none";
                    quaseMorto = true;
                }
                
        }
        else {
            verificarVizinhos(linha, coluna,tab);
        }
        if(visitados.filter(x => x[0]==tab).length == parseInt(tabuleiro.numeroColunas*tabuleiro.numeroLinhas*(1-tabuleiro.dificuldade)+1)){
            clearInterval(timer);
            clearInterval(temporizador);
            if (tab==1){
                var vencedor = jogadores[0].value;
                var loser = jogadores[1].value;
            }
            else{
                var vencedor = jogadores[1].value;
                var loser = jogadores[0].value;
            }
            terminarJogo("YOU WON, "+vencedor+"!", "Nice work soldier, oh and by the way... You suck "+loser+"!");
        }
    }  
}

function celulaFlag(){
    let tab = parseInt(this.id.split("l")[0]);
    let element = document.getElementById(this.id);
    if (((tab==1 && primeiroClick1)||(tab==2 && primeiroClick2)) && cells.find(cell => cell.id == this.id).visitado===false && element.classList.contains("duvida")===false){
        
        let flags = document.getElementById("tab"+tab).getElementsByClassName("flag")
        if(element.classList.contains("flag")){
            element.classList.remove('flag');
        }
        else{
            
            if(flags.length<tabuleiro.numeroBombas){
                element.classList+=" flag"; 

            }
        }
        

        mostrarFlags(tabuleiro.numeroBombas-flags.length,tab);
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

function principal(){
    CriarTabuleiro();
    document.getElementById("tempo").innerHTML = document.forms.nomes.tempopj.value+" s";
}

window.onload = function() {
    principal();
  }

