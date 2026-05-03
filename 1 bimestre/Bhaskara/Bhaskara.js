function calcular(){
    let a = parseFloat(document.getElementById("inputA").value);
    let b = parseFloat(document.getElementById("inputB").value);
    let c = parseFloat(document.getElementById("inputC").value);

    let footer = document.getElementById("footer");
    let mensagem = document.getElementById("mensagem");

    if(isNaN(a&&b&&c)){
        footer.classList.add("erro");
        mensagem.innerHTML = "Os espaços precisam ser preenchidos";
        X1 = "-";
        X2 = "-";
    }else{
        footer.classList.remove("erro");
        mensagem.innerHTML = "Os espaços precisam ser preenchidos";
    }

    let d = b**2-4*a*c;
            
    let X1 = (-b+(d**(1/2)))/2;
    let X2 = (-b-(d**(1/2)))/2;

    if(isNaN(X1) || isNaN(X2)){
        X1 = "O delta não possui raiz quadrada. ∆ = " + d;
        X2 = "O delta não possui raiz quadrada. ∆ = " + d;
    }

    document.getElementById("x1").innerHTML = X1;
    document.getElementById("x2").innerHTML = X2;
}