const express = require('express');
const os = require('os');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = 3000;

// Pasta onde as imagens serão salvas
const pastaImagens = './imagens/';

// Verifica se a pasta existe.
// Caso não exista, ela será criada.
if (!fs.existsSync(pastaImagens)) {
    fs.mkdirSync(pastaImagens, { recursive: true });
}

// ---------------------------------------------------
// CONFIGURAÇÃO DO MULTER
// ---------------------------------------------------

// Define em qual pasta a imagem será salva
function definirDestino(req, file, callback) {
    callback(null, pastaImagens);
}

// Define o nome do arquivo da imagem
function definirNomeArquivo(req, file, callback) {
    // Usa o RA do aluno como nome da imagem
    // Exemplo: 123.png
    const ra = req.body.ra || 'sem-ra';
    const nomeArquivo = ra + '.png';
    callback(null, nomeArquivo);
}

// Configuração do armazenamento
const armazenamento = multer.diskStorage({
    destination: definirDestino,
    filename: definirNomeArquivo
});

// Middleware do multer
const upload = multer({
    storage: armazenamento
});

// ---------------------------------------------------
// MIDDLEWARES
// ---------------------------------------------------

app.use(express.json());

// Middleware CORS
// Permite que o navegador acesse o servidor
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'POST, GET, OPTIONS'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );
    next();
});

// ---------------------------------------------------
// ROTA PRINCIPAL
// ---------------------------------------------------

// Esta rota:
// 1) Recebe os dados do aluno
// 2) Calcula a média
// 3) Calcula a situação
// 4) Retorna o resultado

app.post('/enviar-dados-aluno', upload.single('foto'), function (req, res) {
    try {
        // Dados recebidos do formulário
        const ra = req.body.ra;
        const nome = req.body.nome;

        const nota1 = parseFloat(req.body.nota1);
        const nota2 = parseFloat(req.body.nota2);
        const nota3 = parseFloat(req.body.nota3);
        const nota4 = parseFloat(req.body.nota4);

        if (!ra || !nome) {
            return res.status(400).json({
                erro: 'RA e nome são obrigatórios.'
            });
        }

        if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3) || isNaN(nota4)
        ) {
            return res.status(400).json({
                erro: 'As notas devem ser numéricas.'
            });
        }
        const media = (nota1 + nota2 + nota3 + nota4) / 4;
        let situacao = '';
        if (media >= 7) {
            situacao = 'Aprovado';
        } else if (media >= 5) {
            situacao = 'Recuperação';
        } else {
            situacao = 'Reprovado';
        }

        // -----------------------------------------
        // EXIBE NO TERMINAL ONDE O SERVIDOR ESTÁ RODANDO
        // -----------------------------------------

        console.log('--------------------------------');
        console.log('Aluno:', nome);
        console.log('RA:', ra);
        console.log('Média:', media.toFixed(2));
        console.log('Situação:', situacao);

        if (req.file) {
            console.log(
                'Imagem salva:',
                req.file.filename
            );
        }

        // -----------------------------------------
        // RESPOSTA PARA O CLIENTE
        // -----------------------------------------

        res.json({
            mensagem: 'Dados processados com sucesso!',
            nomeArquivo: req.file
                ? req.file.filename
                : null,
            aluno: {
                ra: ra,
                nome: nome,
                media: media.toFixed(2),
                situacao: situacao
            }
        });

    } catch (erro) {
        console.log('Erro:', erro);
        res.status(500).json({
            erro: 'Erro interno do servidor.'
        });
    }
}
);


function obterIP() { // FUNÇÃO PARA OBTER O IP DA MÁQUINA
    const interfaces = os.networkInterfaces();
    for (let nomeInterface in interfaces) {
        for (let info of interfaces[nomeInterface]) {
            if (info.family === 'IPv4' && !info.internal) {
                return info.address;
            }
        }
    }
    return 'localhost';
}

const ip = obterIP();

// ---------------------------------------------------
// INICIA O SERVIDOR
// ---------------------------------------------------

app.listen(port, '0.0.0.0', function () {
    console.log(`Servidor rodando em http://${ip}:${port}`);
    console.log('Pasta das imagens:', pastaImagens);
});