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
            return res.status(400).json({ status: "erro", mensagem: "Mensagem vazia!" });
        }

        const agora = new Date();
        const dataHora = `${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`;
        console.log(`Mensagem recebida: ${mensagemRecebida} - ${dataHora}`);



        // REGRA 1: Se for "cidades" - lista todas as cidades cadastradas
         if (mensagemRecebida === "cidades") {
            try {
                // Consulta o banco de dados
                const query = `SELECT nome_cidade FROM cidade`;
                const result = await pool.query(query);

                // Aplica a regra de negócio (calcula o que precisa ser reposto)
                let mensagemResposta = "Cidades cadastradas: \n"

                result.rows.forEach(cidade => {
                    mensagemResposta +=
                    `-${cidade.nome_cidade}\n`
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

         // REGRA 2: Se for "listar" - Lista as cidades e os nomes de seus respectivos estados
        else if (mensagemRecebida === "listar") {
            try {
                // Consulta o banco de dados
                const query = `SELECT nome_cidade, nome_estado FROM cidade C, estado E 
                WHERE C.sigla_estado = E.sigla_estado`;
                const result = await pool.query(query);

                // Aplica a regra de negócio (calcula o que precisa ser reposto)
                let mensagemResposta = "Cidades e seus repectivos estados: \n\n"

                result.rows.forEach(cidade=> {
                    mensagemResposta +=
                    `-${cidade.nome_cidade} ---→ ${cidade.nome_estado}\n`
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

         // REGRA 3: Se for o nome de alguma cidade cadastrada - mostra o id da cidade e o nome da cidade
        else {
            try {
                const query = "SELECT id_cidade, nome_cidade FROM cidade WHERE UPPER(nome_cidade) = UPPER('" + mensagemRecebida + "')";
                const result = await pool.query(query);

                if (result.rows.length > 0) {
                    return res.status(200).json({
                        status: "sucesso",
                        mensagem:
                            `id: ${result.rows[0].id_cidade}
                            Cidade: ${result.rows[0].nome_cidade}`
                    });

                } else {

                    return res.status(200).json({
                        status: "sucesso",
                        mensagem: "mensagem não entendida"
                    });

                }


            } catch (dbError) {
                console.error('Erro no banco de dados:', dbError);
                return res.status(500).json({
                    status: "erro",
                    mensagem: 'Erro ao consultar situação do estoque'
                });
            }
        }

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        res.status(500).json({ status: "erro", mensagem: 'Erro interno da Servidorina' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor atento na porta ${port}`);
    console.log(`Rota disponível:`);
    console.log(`  POST http://localhost:${port}/api/mensagens - Enviar Bilhetes`);
    console.log(`\nMensagens disponíveis (possíveis)`);
    console.log(`  "cidades" -> Lista todas as cidades cadastradas`);
    console.log(`  "listar" -> Lista as cidades e o nome se seus repectivos estados`);
    console.log(`  (nome de alguma cidade) -> Se estiver cadastrada, lista o nome da cidade e seu id`);
    console.log(`  (outras)   -> Mensagem não entendida`);
});