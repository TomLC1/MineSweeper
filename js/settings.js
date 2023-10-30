/*  LTI - ITW - 21/22 
 Grupo 42 TP21 Nº58646 Nº58617 Nº58671 */
/* Função para buscar valor de uma cookie */
function buscarCookie(nome) {
    var value = `; ${document.cookie}`;
    var partes = value.split(`; ${nome}=`);
    if (partes.length === 2) return partes.pop().split(';').shift();
}

/* Função para guardar os valores das definições nas cookies */
function guardarSettings(){
    tamanho = document.getElementById("board_size").value;
    if (tamanho == "custum"){
        largura = document.getElementById("board_width").value;
        altura = document.getElementById("board_height").value;
    }
    else{
        largura = tamanho;
        altura = tamanho;
    }
    
    formulario = document.getElementById("settings");
    dificuldade = document.getElementById("dificulty").value;
    som = document.getElementById("som").checked;
    volume = document.getElementById("volume").value;
    theme = document.getElementById("theme").value;
    gameMode = document.getElementById("gameMode").value;
    tempo = document.getElementById("time").value;
    document.cookie = "tamanho="+ tamanho;
    document.cookie = "largura="+ largura;
    document.cookie = "altura="+ altura;
    document.cookie = "dificuldade="+ dificuldade;
    document.cookie = "som="+ som;
    document.cookie = "theme="+ theme;
    document.cookie = "volume=" + volume;
    document.cookie = "gameMode=" + gameMode;
    document.cookie = "time="+tempo;
    window.location.reload();
}

/* Função que faz aparecer os campos para definir os valores de nr de linhas e nr de colunas quando o utilizador define o tamanho do tabuleiro como custum */
function custum(){
    let lista = document.getElementById("board_size");
    if (lista.value == "custum"){
        document.getElementById("custumSet").hidden=false;
    }
    else{
        document.getElementById("custumSet").hidden=true;
    }
}

function gameModeTime(){
    let timenum = document.getElementById("gameMode");
    if (timenum.value == "timetrial"){
        document.getElementById("timeLimit").hidden=false;
        
    }
    else{
        document.getElementById("timeLimit").hidden=true;
    }
}

function mostraVol(){
        if (document.getElementById("som").checked ===true){
        document.getElementById("showvol").hidden=false;
    }
    else{
        document.getElementById("showvol").hidden=true;
    }
}
function mostrarTempo(x){
    document.getElementById("timer").innerHTML=x+" s";
}

function mostrarVolume(x){
    document.getElementById("vol").innerHTML=x+"%";
}

/* Função que vai buscar os valores das definições às cookies e mostra na página */
function mostrarSettings(){
    if (buscarCookie("tamanho")!=undefined && buscarCookie("largura")!=undefined && buscarCookie("altura")!=undefined && buscarCookie("dificuldade")!=undefined && buscarCookie("som")!=undefined && buscarCookie("theme")!=undefined && buscarCookie("volume")!=undefined&& buscarCookie("gameMode")!=undefined ){
        document.getElementById("board_size").value = buscarCookie("tamanho");
        document.getElementById("board_width").value = buscarCookie("largura");
        document.getElementById("board_height").value = buscarCookie("altura");
        document.getElementById("dificulty").value = buscarCookie("dificuldade");
        document.getElementById("volume").value = buscarCookie("volume");
        document.getElementById("vol").innerHTML=buscarCookie("volume")+"%";
        document.getElementById("time").value = buscarCookie("time");
        /* Nota: este valor mesmo que seja false, vem em modo string e não dá para converter diretamente para Boolean, por isso é preciso fazer a verificação do texto, para saber se é 'true' ou 'false' */
        document.getElementById("som").checked = (buscarCookie("som")==='true');
        mostraVol();
        mostrarTempo(buscarCookie("time"));
        document.getElementById("theme").value = buscarCookie("theme");
        document.getElementById("gameMode").value = buscarCookie("gameMode");
    }
    else{
        /* Display das definições por defeito caso não haja dados guardados nas cookies */
        document.getElementById("board_size").value = "9";
        document.getElementById("board_width").value = "9";
        document.getElementById("board_height").value = "9";
        document.getElementById("dificulty").value = "easy";
        document.getElementById("som").checked = false;
        document.getElementById("theme").value ="default";
        document.getElementById("gameMode").value ="normal";
        document.getElementById("time").value = '5';
        mostrarTempo(5);
        mostrarVolume(20);
    }
}

function principal(){
    mostrarSettings();
    custum();
    gameModeTime();
}

window.onload = principal();