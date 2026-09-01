const URL_API = 'http://localhost:3001';
const SILHUETA_URL = `${URL_API}/imagens/silhueta.png`;

let oQueEstaFazendo = '';
let produtos = null;
bloquearAtributos(true);

// Carrega a imagem do banco ou mostra a silhueta
function carregarImagem(id) {
    const img = document.getElementById('imgProduto');
    if (!id) {
        img.src = SILHUETA_URL;
        return;
    }
    img.src = `${URL_API}/imagens/${id}.png?t=${new Date().getTime()}`;
    img.onerror = () => { img.src = SILHUETA_URL; };
}

// Aciona o clique no input hidden APENAS se estiver inserindo ou alterando
function acionarUpload() {
    if (oQueEstaFazendo !== 'inserindo' && oQueEstaFazendo !== 'alterando') {
        mostrarAviso("Clique em Inserir ou Alterar primeiro para poder escolher uma imagem.");
        return;
    }
    document.getElementById('inputImagem').click();
}

// Apenas mostra a imagem na tela localmente (sem enviar pro servidor ainda)
function previewImagem() {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length > 0) {
        // Cria uma URL temporária para visualização instantânea
        const url = URL.createObjectURL(inputFiles[0]);
        document.getElementById('imgProduto').src = url;
        mostrarAviso("Imagem escolhida! Clique em Salvar para concluir.");
    }
}

// Função auxiliar para enviar a imagem para a API
async function uploadImagemParaServidor(id) {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length === 0) return; // Se não escolheu imagem, não faz nada

    const formData = new FormData();
    formData.append('imagem', inputFiles[0]);

    try {
        await fetch(`${URL_API}/upload/${id}`, {
            method: 'POST',
            body: formData
        });
    } catch (erro) {
        console.error("Erro ao enviar imagem:", erro);
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/produto/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.produto : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_produto = document.getElementById("inputId_produto").value;
    if (isNaN(id_produto) || !Number.isInteger(Number(id_produto)) || id_produto === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    produtos = await procurePorChavePrimaria(id_produto);
    oQueEstaFazendo = ''; // Reseta o estado
    
    if (produtos) {
        mostrarDadosFilme(produtos);
        carregarImagem(id_produto);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        carregarImagem(null);
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos, escolha a imagem e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos, mude a imagem (opcional) e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    let id_produto = document.getElementById("inputId_produto").value;
    const nome_produto = document.getElementById("inputNome_produto").value;
    const tamanho = document.getElementById("inputTamanho").value;
    const preco = parseFloat(document.getElementById("inputPreco").value);

    const dadosProduto = { id_produto, nome_produto, tamanho, preco };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/produto`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosProduto) });
            await uploadImagemParaServidor(id_produto); // Salva a imagem após o texto
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/produto/${id_produto}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosProduto) });
            await uploadImagemParaServidor(id_produto); // Atualiza a imagem após o texto
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/produto/${id_produto}`, { method: 'DELETE' });
            carregarImagem(null);
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_produto").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/produtos`);
        const data = await resposta.json();
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.produtos) {
                texto += `${linha.id_produto} - ${linha.nome_produto} - ${linha.tamanho} - R$${linha.preco} <br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum produto cadastrado.";
        }
    } catch (erro) {
        document.getElementById("outputSaida").innerHTML = "Servidor offline.";
    }
}

function cancelarOperacao() {
    limparAtributos();
    carregarImagem(null);
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosFilme(f) {
    document.getElementById("inputId_produto").value = f.id_produto;
    document.getElementById("inputNome_produto").value = f.nome_produto;
    document.getElementById("inputTamanho").value = f.tamanho;
    document.getElementById("inputPreco").value = f.preco;
    bloquearAtributos(true);
}

function limparAtributos() {
    produtos = null;
    oQueEstaFazendo = ''; // Limpa a ação atual
    document.getElementById("inputNome_produto").value = "";
    document.getElementById("inputTamanho").value = "";
    document.getElementById("inputPreco").value = "";
    document.getElementById("inputImagem").value = ""; 
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_produto").readOnly = !soLeitura;
    document.getElementById("inputNome_produto").readOnly = soLeitura;
    document.getElementById("inputTamanho").readOnly = soLeitura;
    document.getElementById("inputPreco").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}