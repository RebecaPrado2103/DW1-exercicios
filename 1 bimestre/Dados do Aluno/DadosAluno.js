function funcaoCalcularAproveitamento() {
    let ra = document.getElementById("inputRA").value;
    let nome = document.getElementById("inputNome").value;
    let nota1 = parseFloat(document.getElementById("inputNota1").value);
    let nota2 = parseFloat(document.getElementById("inputNota2").value);
    let nota3 = parseFloat(document.getElementById("inputNota3").value);
    let nota4 = parseFloat(document.getElementById("inputNota4").value);
    let me = parseFloat(document.getElementById("inputME").value);

    let Ma = ( nota1 + nota2*2 + nota3*3 + nota4*4 + me)/11
    let ma = Ma.toFixed(2);
    let situacao  = "";
    let conceito = "";

    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");

      if(ra == ""){
        footer.classList.add("erro");
        mensagem.innerHTML = "O Ra deve ser preenchido";
        document.getElementById("resultado").innerHTML = "-";
        return;
    }else if(nome == ""){
        footer.classList.add("erro");
        mensagem.innerHTML = "Preencer o campo do nome";
        document.getElementById("resultado").innerHTML = "-";
        return;
    }else if(isNaN(nota1) || nota1 < 0){
        footer.classList.add("erro");
        mensagem.innerHTML = "A nota 1 deve ser preenchida com um número maior que 0";
        document.getElementById("resultado").innerHTML = "-";
        return;
    }else if(isNaN(nota2) || nota2 < 0){
        footer.classList.add("erro");
        mensagem.innerHTML = "A nota 2 deve ser preenchida com um número maior que 0";
        document.getElementById("resultado").innerHTML = "-";
        return;
    }else if(isNaN(nota3) || nota3 < 0){
        footer.classList.add("erro");
        mensagem.innerHTML = "A nota 3 deve ser preenchida com um número maior que 0";
        document.getElementById("resultado").innerHTML = "-";
        return;
    }else if(isNaN(nota4) || nota4 < 0){
        footer.classList.add("erro");
        mensagem.innerHTML = "A nota 4 deve ser preenchiada com um número maior que 0";
        document.getElementById("resultado").innerHTML = "-";
        return;
    }else if(me < 0 || isNaN(me)){
        footer.classList.add("erro");
        mensagem.innerHTML = "A média de exercícios deve ser preenchida com um número maior que 0";
        document.getElementById("resultado").innerHTML = "-";
        return;
    }else{
        footer.classList.remove("erro");
        mensagem.innerHTML = "Cálculo realizado com sucesso";
    }
    

        if(ma >= 9){
            conceito = "A";
            situacao = "Aprovado";
        } else if(ma >= 7.5){
            conceito = "B";
            situacao = "Aprovado";
        } else if(ma >= 6){
            conceito = "C";
            situacao = "Aprovado";
        } else if(ma >= 4){
            conceito = "D";
            situacao = "Reprovado";
        } else {
            conceito = "E";
            situacao = "Reprovado";
        }

        let resp = ra + " - " + nome + " - " + nota1 + " - " + nota2 + " - " + nota3 + " - " + nota4 + " - " + me + 
        " - " + ma + " - " + conceito + " - " + situacao;
    
        document.getElementById("resultado").innerHTML = resp;
    
}