let listaFilme = [];
let oQueEstaFazendo = '';
let filme = null;
bloquearAtributos(true);

function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaFilme.length; i++) {
        const filme = listaFilme[i];
        if (filme.id == chave) {
            filme.posicaoNaLista = i;
            return listaFilme[i];
        }
    }
    return null;
}

function procure() {
    const id = document.getElementById("inputId").value;
    if (isNaN(id) || !Number.isInteger(Number(id))) {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("inputId").focus();
        return;
    }

    if (id) {
        filme = procurePorChavePrimaria(id);
        if (filme) {
            mostrarDadosFilme(filme);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else {
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else {
        document.getElementById("inputId").focus();
        return;
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputId").focus();
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}

function excluir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {

    let id;
    if (filme == null) {
        id = parseInt(document.getElementById("inputId").value);
    } else {
        id = filme.id;
    }


    const nome = document.getElementById("inputNome").value;

    const diretor = document.getElementById("inputDiretor").value;

    const data = document.getElementById("inputData").value;

    const duracao = document.getElementById("inputDuracao").value;
    if (id && nome && diretor && data && duracao) {
        switch (oQueEstaFazendo) {
            case 'inserindo':
                filme = new Filme(id, nome, diretor, data, duracao);
                listaFilme.push(filme);
                mostrarAviso("Inserido na lista")
                break;
            case 'alterando':
                filmeAlterado = new Filme(id, nome, diretor, data, duracao);
                listaFilme[filme.posicaoNaLista] = filmeAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novalista = [];
                for (let i = 0; i < listaFilme.length; i++) {
                    if (filme.posicaoNaLista != i) {
                        novalista.push(listaFilme[i]);
                    }
                }
                listaFilme = novalista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                mostrarAviso("Erro aleatório")
        }       visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputId").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto +=
            linha.id + " - " +
            linha.nome + " - " +
            linha.diretor + " - " +
            linha.data + " - " +
            linha.duracao + " - " +
            "<br>";
    }
    return texto;
}
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaFilme);
}
function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}
function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}
function mostrarDadosFilme(filme) {

    document.getElementById("inputId").value = filme.id
    document.getElementById("inputNome").value = filme.nome
    document.getElementById("inputDiretor").value = filme.diretor
    document.getElementById("inputData").value = filme.data
    document.getElementById("inputDuracao").value = filme.duracao

    bloquearAtributos(true);
}
function limparAtributos() {

    document.getElementById("inputNome").value = ""
    document.getElementById("inputDiretor").value = ""
    document.getElementById("inputData").value = ""
    document.getElementById("inputDuracao").value = ""

    bloquearAtributos(true);
} function bloquearAtributos(soLeitura) {

    document.getElementById("inputId").readOnly = !soLeitura
    document.getElementById("inputNome").readOnly = soLeitura
    document.getElementById("inputDiretor").readOnly = soLeitura
    document.getElementById("inputData").readOnly = soLeitura
    document.getElementById("inputDuracao").readOnly = soLeitura
}
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("inputId").focus();
}

function persistirEmLocalPermanente(arquivoDestino, conteudo) {
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = arquivoDestino;
    link.click();
    URL.revokeObjectURL(link.href);
}

function abrirArquivoSalvoEmLocalPermanente() {

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = function (event) {
        const arquivo = event.target.files[0];
        console.log(arquivo.name);
        if (arquivo) {
            converterDeCSVparaListaObjeto(arquivo);
        }
    }
    input.click();
}

function prepararESalvarCSV() {
    let nomeDoArquivoDestino = "./Filme.csv;"
    let textoCSV = "";
    for (let i = 0; i < listaFilme.length; i++) {
        const linha = listaFilme[i];
        textoCSV += linha.id + ";" + linha.nome + ";" + linha.diretor + ";" + linha.data + ";" + linha.duracao + ";" + fimDeLinha
    }
    persistirEmLocalPermanente(nomeDoArquivoDestino, textoCSV);
}
function converterDeCSVparaListaObjeto(arquivo) {
    const leitor = new FileReader();
    leitor.onload = function (e) {
        const conteudo = e.target.result;
        const linhas = conteudo.split('fimDeLinha');
        listaFilme = [];
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (linha) {
                const dados = linha.split(';');
                if (dados.length === 5) {
                    listaFilme.push({
                        id: dados[0],
                        nome: dados[1],
                        diretor: dados[2],
                        data: dados[3],
                        duracao: dados[4],
                    });
                }
            }
        }
        listar();
    };
    leitor.readAsText(arquivo);
}