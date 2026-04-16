function funcaoCalcular(){
    let cqb = parseInt(document.getElementById("inputCQB").value) || 0;
    let cqd = parseInt(document.getElementById("inputCQD").value)|| 0;
    let xs = parseInt(document.getElementById("inputXS").value)|| 0;
    let refri = parseInt(document.getElementById("inputRefri").value)|| 0;
    let r = parseInt(document.getElementById("inputR").value)|| 0;

    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");

    let total = (22*cqb) + (27*cqd) + (29*xs) + (5*refri) + (8*r);

    if(cqb<0 || cqd<0 || xs<0 || refri<0 || r<0){
        footer.classList.add("erro");
        mensagem.innerHTML = "Os valores não podem ser negativos";
        document.getElementById("resposta").innerHTML = "-";
        return;
    }else{
        footer.classList.remove("erro");
        mensagem.innerHTML = "Cálculo realizado com sucesso";
    }

    document.getElementById("resposta").innerHTML = total;
}

