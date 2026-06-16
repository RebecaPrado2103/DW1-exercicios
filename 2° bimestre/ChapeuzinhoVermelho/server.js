const express = require('express');
const os = require('os');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configuração do pool de conexão com PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS (Verificação de origem da Servidorina)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Rota Única: Enviar e Receber Mensagens (POST)
app.post('/api/mensagens', async (req, res) => {
    try {
        const mensagemRecebida = req.body.mensagem;

        if (!mensagemRecebida) {
            return res.status(400).json({ status: "erro", mensagem: "Bilhete vazio!" });
        }

        const agora = new Date();
        const dataHora = `${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`;
        console.log(`Bilhete recebido da Clientina: ${mensagemRecebida} - ${dataHora}`);

        // REGRA 1: Se for "vovó"
        if (mensagemRecebida === "vovó") {
            return res.status(200).json({
                status: "sucesso",
                mensagem: "Oi, em que posso ajudar?"
            });
        }

        // REGRA 2: Se for "chegou"
        else if (mensagemRecebida === "chegou") {
            return res.status(200).json({
                status: "sucesso",
                mensagem: "a Chapeuzinho chegou aqui com o bilhete"
            });
        }


        // REGRA 3: Se for "situacao" - consulta o estoque e retorna o que precisa ser reposto
        else if (mensagemRecebida === "situacao") {
            try {
                // Consulta o banco de dados
                const query = 'SELECT * FROM public.produto';
                const result = await pool.query(query);

                // Aplica a regra de negócio (calcula o que precisa ser reposto)
                let reposicao = {};

                result.rows.forEach(produto => {
                    if (produto.quantidade_produto < produto.quantidade_minima_produto) {
                        const quantidadeParaPedir = produto.quantidade_maxima_produto - produto.quantidade_produto;

                        // Formata o nome para minúsculo
                        let nomeFormatado = produto.nome_produto.toLowerCase();

                        reposicao[nomeFormatado] = quantidadeParaPedir;
                    }
                });

                // Prepara uma mensagem amigável para mostrar no frontend
                let mensagemResposta = "";
                const itens = Object.entries(reposicao);

                if (itens.length === 0) {
                    mensagemResposta = "Tudo ok! Nenhum item precisa ser reposto no momento.";
                } else {
                    mensagemResposta = "Precisamos repor:\n";
                    itens.forEach(([item, quantidade]) => {
                        mensagemResposta += `- ${item}: ${quantidade} unidades\n`;
                    });
                }

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta,
                    dados_reposicao: reposicao  // Dados estruturados caso queira usar
                });

            } catch (dbError) {
                console.error('Erro no banco de dados:', dbError);
                return res.status(500).json({
                    status: "erro",
                    mensagem: 'Erro ao consultar situação do estoque'
                });
            }
        }

        // REGRA 4: Se for "paes" - consulta o estoque e retorna a quantidade de paes no estoque
        else if (mensagemRecebida === "pao"){
            try{
                const query = "SELECT quantidade_produto FROM public.produto WHERE nome_produto = 'Pão' ";
                const result = await pool.query(query);
                const paes = result.rows[0].quantidade_produto;

                let mensagemResposta = `Temos ${paes} pães no estoque`;

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta
                });
            
            } catch (dbError) {
                console.error('Erro no banco de dados:', dbError);
                return res.status(500).json({
                    status: "erro",
                    mensagem: 'Erro ao consultar situação do estoque'
                });
            }
        }

        // REGRA 5: Se for "bolo" - consulta o estoque e retorna a quantidade de bolos no estoque
        else if (mensagemRecebida === "bolo"){
            try{
                const query = "SELECT quantidade_produto FROM public.produto WHERE nome_produto = 'Bolo' ";
                const result = await pool.query(query);
                const bolos = result.rows[0].quantidade_produto;

                let mensagemResposta = `Temos ${bolos} bolos no estoque`;

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta
                });
            
            } catch (dbError) {
                console.error('Erro no banco de dados:', dbError);
                return res.status(500).json({
                    status: "erro",
                    mensagem: 'Erro ao consultar situação do estoque'
                });
            }
        }

        // REGRA 6: Se for "minimos" - mostra a quntidade minima de produtos
        else if (mensagemRecebida === "minimos") {
            try {
                // Consulta o banco de dados
                const query = `SELECT nome_produto, quantidade_minima_produto FROM public.produto`;
                const result = await pool.query(query);

                // Aplica a regra de negócio (calcula o que precisa ser reposto)
                let mensagemResposta = "Quantidade mínima de cada produto: \n"

                result.rows.forEach(produto => {
                    mensagemResposta +=
                    `-${produto.nome_produto}: ${produto.quantidade_minima_produto}\n`
                });

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta
                });

            } catch (dbError) {
                console.error('Erro no banco de dados:', dbError);
                return res.status(500).json({
                    status: "erro",
                    mensagem: 'Erro ao consultar situação do estoque'
                });
            }
        }

        // REGRA 7: Qualquer outra palavra
        else {
            return res.status(200).json({
                status: "sucesso",
                mensagem: "mensagem não entendida"
            });
        }

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        res.status(500).json({ status: "erro", mensagem: 'Erro interno da Servidorina' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidorina atenta na porta ${port}`);
    console.log(`Rota disponível:`);
    console.log(`  POST http://localhost:${port}/api/mensagens - Enviar Bilhetes`);
    console.log(`\nMensagens disponíveis (possíveis)`);
    console.log(`  "vovó"     -> Resposta de saudação`);
    console.log(`  "chegou"   -> Confirmação de chegada`);
    console.log(`  "situacao" -> Consulta de reposição de estoque`);
    console.log(`  "pao" -> Consulta a quantidade de paes no estoque`);
    console.log(`  "bolo" -> Consulta a quantidade de bolos no estoque`);
    console.log(`  "minimos" -> Consulta a quantidade minima de cada produto`);
    console.log(`  (outras)   -> Mensagem não entendida`);
});