
/*  LTI - ITW - 21/22 
 Grupo 42 TP21 Nº58646 Nº58617 Nº58671 */

function getLoggedUser() {
    return localStorage.getItem("loggedUser");
}
function register(){
    let campos = document.forms.registo.elements;
    let lista = JSON.parse(window.localStorage.getItem('lista')) || [];
    if(campos.r_nome.value=='' || campos.r_pass.value=='' || campos.r_cpass.value == ''){
        document.getElementById("avisoR").innerHTML = "Please fill in all the fields";
        brake; }
    if(lista.find(user => user['user']== campos.r_nome.value)!=undefined){
        document.getElementById("avisoR").innerHTML = "There is already a user with that username";
        brake;}
    else{
        if (campos.r_pass.value==campos.r_cpass.value){
            let user = {
                user: campos.r_nome.value,
                password: campos.r_pass.value,
                playTime: [0, 0, 0]
            }
            lista.push(user);
            window.localStorage.setItem('lista',JSON.stringify(lista));
            document.getElementById("avisoG").innerHTML = "User registered successfully";
        }
        else{
            document.getElementById("avisoR").innerHTML = "Passwords do not match";
        }
    } 
}

function login(){
    let campos = document.forms.login.elements;
    let lista = JSON.parse(window.localStorage.getItem('lista')) || [];
    if(lista.find(user => user['user']== campos.l_nome.value)==undefined){
        document.getElementById("avisoL").innerHTML = "User not found";
    }
    else if(lista.find(user => user['user']== campos.l_nome.value).password != campos.l_pass.value){
        document.getElementById("avisoL").innerHTML = "User and password don't match";
    }
    else{
        localStorage.setItem("loggedUser", campos.l_nome.value);
        loggedInAction()
        window.location.reload();
    }
}

function checkLogged() {
    if (localStorage.getItem("loggedUser") != undefined) {
        loggedInAction();
    }
}

function ordernarScores(scores){
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

function mostrarScores(){
    let tempoDeJogototal = JSON.parse(window.localStorage.getItem('lista')).find(user => user['user'] === getLoggedUser()).playTime;
    document.getElementById("tempoDeJogo").innerHTML = `${tempoDeJogototal[2]}:${tempoDeJogototal[1]}:${tempoDeJogototal[0]}`
    document.getElementById("scores").style.display ="block";
    let scores = JSON.parse(window.localStorage.getItem('scores')) || [];
    document.getElementById("totalJogos").innerHTML = scores.filter(user => user['user']== getLoggedUser()).length;
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
            document.getElementById("scoreTab"+dificuldade).innerHTML +="<tr><td colspan='2'>No games played</td></tr>"
        }
    }
    
    
}

function loggedInAction() {
    document.getElementById("h1").innerHTML = "Welcome back " + localStorage.getItem("loggedUser") +"!";
    document.getElementById("forms").style.display = "none";
    document.getElementById("ready").innerHTML = "Are you ready to play!?";
    document.getElementById("scores").style.display = "block";
    document.getElementById("btnLogOut").style.display = "block";
    document.getElementById("btnJogar").style.display = "block";
    document.forms.login.reset();
    mostrarScores();
}

document.getElementById("btnLogOut").addEventListener('click', function logOut() {
    localStorage.removeItem("loggedUser");
    document.getElementById("forms").style.display = "flex";
    document.getElementById("ready").innerHTML = "<strong>Welcome to Minesweeper</strong>, register to play! <br> If you already have an account please Login!";
    document.getElementById("scores").style.display = "none";
    document.getElementById("btnLogOut").style.display = "none";
    document.getElementById("btnJogar").style.display = "none";
    window.location.reload();
    }
);

document.getElementById("btnLogOut").addEventListener('click', function logOut() {
    localStorage.removeItem("loggedUser");
    document.getElementById("forms").style.display = "flex";
    document.getElementById("ready").innerHTML = "<strong>Welcome to Minesweeper</strong>, register to play! <br> If you already have an account please Login!";
    document.getElementById("scores").style.display = "none";
    document.getElementById("btnLogOut").style.display = "none";
    }
);

document.getElementById("btnRegister").addEventListener('click', function switchToRegister() {
    document.getElementById("divLogin").style.display = "none";
    document.getElementById("divRegister").style.display = "block";
    document.forms.login.reset();
    }
);

document.getElementById("btnLogin").addEventListener('click', function switchToLogin() {
    document.getElementById("divLogin").style.display = "block";
    document.getElementById("divRegister").style.display = "none";
    document.forms.registo.reset();
    }
);

window.onload = checkLogged();