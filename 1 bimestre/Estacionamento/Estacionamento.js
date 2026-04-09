function funcaoCalcular(){
    let g = document.getElementById("inputGrande").checked;
    let f = document.getElementById("inputFrequente").checked;
    let h = parseInt(document.getElementById("inputHoras").value);

    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");

    let preco = 5 + (h-1)*2.5;

    if(isNaN(h)){
        footer.classList.add("erro");
        mensagem.innerHTML = "A quntidade de horas deve ser informada";
        document.getElementById("resposta").innerHTML = "-";
        return;
    }else{
        footer.classList.remove("erro");
        mensagem.innerHTML = "Cálculo realizado com sucesso";
    }

    let resp = preco;
    if(f){
        resp = preco - (preco*5/100);
    }
    if(g){
        resp = resp + (resp*25/100);
    }

    document.getElementById("resposta").innerHTML = resp.toFixed(2);
}