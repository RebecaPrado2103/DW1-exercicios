window.onload = function() {
    // Captura os parâmetros da URL enviados via GET pelo index.html
    const urlParams = new URLSearchParams(window.location.search);
    
    const nome = urlParams.get('nome');
    const cpf = urlParams.get('cpf');
    const idade = parseInt(urlParams.get('idade'));
    const responsavel = urlParams.get('nomeResponsavel');
    const origem = urlParams.get('cidadeOrigem');
    const destino = urlParams.get('cidadeDestino');
    const modalidade = urlParams.get('modalidade');

    // Regra de Negócio: Definição da Categoria com base na Idade
    let categoria = "";
    if (idade >= 7 && idade <= 11) {
        categoria = "Infantil";
    } else if (idade >= 12 && idade <= 13) {
        categoria = "Pré-adolescente";
    } else if (idade >= 14 && idade <= 18) {
        categoria = "Adolescente";
    } else {
        // Redundância de segurança caso acessem a URL diretamente
        alert("Idade inválida para competição. Redirecionando para a tela inicial.");
        window.location.href = "formulario.html";
        return;
    }

    // Preenchimento dos dados no documento HTML
    document.getElementById('resNome').textContent = nome;
    document.getElementById('resCpf').textContent = cpf;
    document.getElementById('resIdade').textContent = idade;
    document.getElementById('resResponsavel').textContent = responsavel;
    document.getElementById('resOrigem').textContent = origem;
    document.getElementById('resDestino').textContent = destino;
    document.getElementById('resModalidade').textContent = modalidade;
    document.getElementById('resCategoria').textContent = categoria;
};

// Lógica do botão de voltar
function voltar(){
    window.location.href = "formulario.html";
}