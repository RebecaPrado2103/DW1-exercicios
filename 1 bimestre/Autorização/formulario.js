document.getElementById('formInscricao').addEventListener('submit', function(event) {
    const idade = parseInt(document.getElementById('idade').value);

    // Regras de negócio para bloqueio na origem
    if (idade < 7) {
        event.preventDefault(); // Impede o envio do formulário
        alert("Inscrição bloqueada: O atleta não pode participar por não atingir a idade mínima (7 anos).");
    } else if (idade > 18) {
        event.preventDefault(); // Impede o envio do formulário
        alert("Inscrição bloqueada: O atleta não pode competir, pois o torneio é restrito a menores de idade (até 18 anos).");
    }
    // Se a idade for válida (entre 7 e 18), o formulário seguirá normalmente via GET.
});