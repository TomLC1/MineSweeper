/*  LTI - ITW - 21/22 
 Grupo 42 TP21 Nº58646 Nº58617 Nº58671 */
 /* Função para o hamburguer menu */
menu = document.getElementById('menu');
menu.addEventListener('click',() =>{
    menu.classList.toggle("rodar");
    document.getElementById('navbar').classList.toggle('d-xs-none');
});