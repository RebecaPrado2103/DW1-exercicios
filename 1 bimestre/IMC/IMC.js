function funcaoCalcularIMC() {
    let p = parseFloat(document.getElementById("inputPeso").value);
    let a = parseFloat(document.getElementById("inputAltura").value);

    let imc = p / (a * a);
    let i = imc.toFixed(2);

    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");
    let classific = "";

    if(isNaN(p) || isNaN(a)){
        footer.classList.add("erro");
        mensagem.innerHTML = "Os espaços precisam ser preenchidos";
        classific = "-";
        i = "-";
    } else if(p <= 0 || a <= 0){
        footer.classList.add("erro");
        mensagem.innerHTML = "Os valores não podem ser negativos ou iguais a 0";
        classific = "-";
        i = "-";
    }else{
        footer.classList.remove("erro");
        mensagem.innerHTML = "Cálculo realizado com sucesso";
        
        if(imc < 18.5){
            classific = "Abaixo do peso";
         }else if(imc < 25){
            classific = "Peso normal";
        }else if(imc < 30){
            classific = "Sobrepeso";
        }else if(imc < 35){
            classific = "Obesidade grau I";
        }else if(imc < 40){
            classific = "Obesidade grau II";
        }else if(imc >= 40){
            classific = "Obesidade grau III";
        }
    }

    document.getElementById("respIMC").innerHTML = i;
    document.getElementById("respClassificacao").innerHTML = classific;
}