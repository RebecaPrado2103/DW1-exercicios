const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let livro = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/livro/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.livro;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const id_livro = document.getElementById("inputId_livro").value;
    if (isNaN(id_livro) || !Number.isInteger(Number(id_livro)) || id_livro === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("inputId_livro").focus();
        return;
    }

    livro = await procurePorChavePrimaria(id_livro);
    if (livro) {
        mostrarDadosCarro(livro);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clique em salvar");
    document.getElementById("inputTitulo_livro").focus();
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clique em salvar");
}

function excluir() {
    bloquearAtributos(true); // Na exclusão não precisa liberar os inputs
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

// Salva as alterações realizando a chamada HTTP correta na API
async function salvar() {
    let id_livro = livro ? livro.id_livro : parseInt(document.getElementById("inputId_livro").value);
    const titulo = document.getElementById("inputTitulo_livro").value;
    const autor = document.getElementById("inputAutor").value;
    const ano_publicacao = parseInt(document.getElementById("inputAno").value);
    const genero = document.getElementById("inputGenero").value;
    const paginas = parseInt(document.getElementById("inputPaginas").value);


    if (!id_livro || !titulo || !autor || !ano_publicacao || !genero || !paginas) {
        alert("Erro nos dados digitados");
        return;
    }

    const dadosLivro = { id_livro: id_livro, titulo: titulo, autor: autor, ano: ano_publicacao, genero: genero, paginas };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/livro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosLivro)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/livro/${id_livro}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosLivro)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/livro/${id_livro}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_livro").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/livros`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.livros);
        } else {
            document.getElementById("outputSaida").innerHTML = "Erro ao carregar dados.";
        }
    } catch (erro) {
        document.getElementById("outputSaida").innerHTML = "Servidor offline.";
    }
}

function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto += `${linha.id_livro} - ${linha.titulo} - ${linha.autor} - ${linha.ano_publicacao} - ${linha.genero} - ${linha.paginas}<br>`;
    }
    return texto || "Nenhum livro cadastrado.";
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosCarro(livro) {
    document.getElementById("inputId_livro").value = livro.id_livro;
    document.getElementById("inputTitulo_livro").value = livro.titulo;
    document.getElementById("inputAutor").value = livro.autor;
    document.getElementById("inputAno").value = livro.ano_publicacao;
    document.getElementById("inputGenero").value = livro.genero;
    document.getElementById("inputPaginas").value = livro.paginas;
    bloquearAtributos(true);
}

function limparAtributos() {
    livro = null;
    document.getElementById("inputTitulo_livro").value = "";
    document.getElementById("inputAutor").value = "";
    document.getElementById("inputAno").value = "";
    document.getElementById("inputGenero").value = "";
    document.getElementById("inputPaginas").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_livro").readOnly = !soLeitura;
    document.getElementById("inputTitulo_livro").readOnly = soLeitura;
    document.getElementById("inputAutor").readOnly = soLeitura;
    document.getElementById("inputAno").readOnly = soLeitura;
    document.getElementById("inputGenero").readOnly = soLeitura;
    document.getElementById("inputPaginas").readOnly = soLeitura;

}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("inputId_livro").focus();
}