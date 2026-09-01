const URL_API = 'http://localhost:3001';
const SILHUETA_URL = `${URL_API}/imagens/silhueta.png`;

let oQueEstaFazendo = '';
let pessoa = null;
bloquearAtributos(true);

// Carrega a imagem do banco ou mostra a silhueta
function carregarImagem(id) {
    const img = document.getElementById('imgFoto');
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
        document.getElementById('imgFoto').src = url;
        mostrarAviso("Imagem escolhida! Clique em Salvar para concluir.");
    }
}

// Função auxiliar para enviar a imagem para a API
async function uploadImagemParaServidor(id) {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length === 0) return; // Se não escolheu imagem, não faz nada

    const formData = new FormData();
    formData.append('foto', inputFiles[0]);

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
        const resposta = await fetch(`${URL_API}/pessoa/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.pessoa : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_pessoa = document.getElementById("inputId_pessoa").value;
    if (isNaN(id_pessoa) || !Number.isInteger(Number(id_pessoa)) || id_pessoa === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    pessoa = await procurePorChavePrimaria(id_pessoa);
    oQueEstaFazendo = ''; // Reseta o estado
    
    if (pessoa) {
        mostrarDadosPessoa(pessoa);
        carregarImagem(id_pessoa);
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
    let id_pessoa = document.getElementById("inputId_pessoa").value;
    const nome_pessoa = document.getElementById("inputNome_pessoa").value;
    const data_nascimento = document.getElementById("inputData_nascimento").value;
    const nome_da_mae = document.getElementById("inputNomeMae").value;

    const dadosPessoa = { id_pessoa, nome_pessoa, data_nascimento, nome_da_mae };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/pessoa`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosPessoa) });
            await uploadImagemParaServidor(id_pessoa); // Salva a imagem após o texto
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/pessoa/${id_pessoa}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosPessoa) });
            await uploadImagemParaServidor(id_pessoa); // Atualiza a imagem após o texto
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/pessoa/${id_pessoa}`, { method: 'DELETE' });
            carregarImagem(null);
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_pessoa").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/pessoas`);
        const data = await resposta.json();
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.pessoas) {
                let dataFormatada = linha.data_nascimento ? linha.data_nascimento.split('T')[0] : '';
                texto += `${linha.id_pessoa} - ${linha.nome_pessoa} - ${dataFormatada} - ${linha.nome_da_mae} <br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhuma pessoa cadastrada.";
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

function mostrarDadosPessoa(f) {
    document.getElementById("inputId_pessoa").value = f.id_pessoa;
    document.getElementById("inputNome_pessoa").value = f.nome_pessoa;
    document.getElementById("inputData_nascimento").value = f.data_nascimento ? f.data_nascimento.split('T')[0] : "";
    document.getElementById("inputNomeMae").value = f.nome_da_mae;
    bloquearAtributos(true);
}

function limparAtributos() {
    pessoa = null;
    oQueEstaFazendo = ''; // Limpa a ação atual
    document.getElementById("inputNome_pessoa").value = "";
    document.getElementById("inputData_nascimento").value = "";
    document.getElementById("inputNomeMae").value = "";
    document.getElementById("inputImagem").value = ""; 
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_pessoa").readOnly = !soLeitura;
    document.getElementById("inputNome_pessoa").readOnly = soLeitura;
    document.getElementById("inputData_nascimento").readOnly = soLeitura;
    document.getElementById("inputNomeMae").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}