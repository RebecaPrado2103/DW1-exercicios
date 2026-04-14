function funcaoCalcular(){
    let g = document.getElementById("inputGrande").checked;
    let f = document.getElementById("inputFrequente").checked;
    const entrada = new Date(document.getElementById("inputEntrada").value);
    const saida = new Date(document.getElementById("inputSaida").value);

    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");

    if (isNaN(entrada.getTime()) || isNaN(saida.getTime())) {
    footer.classList.add("erro");
    mensagem.innerHTML = "Informe entrada e saída corretamente";
    document.getElementById("resposta").innerHTML = "-";
    return;
    }

    // diferença em milissegundos
    let diffMs = saida - entrada;

    // converte para horas
    let h = diffMs / (1000 * 60 * 60);

    // arredonda para cima (cobrança por hora iniciada)
    h = Math.ceil(h);

    if (h <= 0) {
    footer.classList.add("erro");
    mensagem.innerHTML = "Horário de saída deve ser após a entrada";
    resposta.innerHTML = "-";
    return;
    }

    footer.classList.remove("erro");
    mensagem.innerHTML = "Cálculo realizado com sucesso";

    let preco = 5 + (h-1)*2.5;

    let resp = preco;
    if(f){
        resp = preco - (preco*5/100);
    }
    if(g){
        resp = resp + (resp*25/100);
    }


    document.getElementById("resposta").innerHTML = "Horas utilizadas: " + h + "h<br>Preço: " + resp.toFixed(2);
}