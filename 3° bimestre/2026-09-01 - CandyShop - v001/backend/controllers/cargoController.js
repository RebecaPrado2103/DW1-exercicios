const { query } = require('../database');

// Listar todas os cargos
exports.listarCargos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.cargo ORDER BY id_cargo');
        res.json({ sucesso: true, cargos: result.rows });
    } catch (error) {
        console.error('Erro ao listar cargos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar cargos.' });
    }
};

// Obter cargo por ID
exports.obterCargo = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        if (!id ) {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID é obrigatório.' });
        }

        const result = await query('SELECT * FROM public.cargo WHERE id_cargo = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Cargo não encontrado.' });
        }

        res.json({ sucesso: true, cargo: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter cargo:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar cargo
exports.criarCargo = async (req, res) => {
    try {
        const { id_cargo, nome_cargo } = req.body;
        const id = id_cargo ? id_cargo.trim().toUpperCase() : '';

        if (!id ) {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID é obrigatório.' });
        }

        if (!nome_cargo) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome do cargo é obrigatório.' });
        }

        const sql = `
            INSERT INTO public.cargo (id_cargo, nome_cargo)
            VALUES ($1, $2)
            RETURNING *
        `;

        const result = await query(sql, [id, nome_cargo]);
        res.status(201).json({ sucesso: true, mensagem: 'Cargo inserido com sucesso!', unidade: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar cargo:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'Este id de cargo já está cadastrado' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir cargo no banco de dados.' });
    }
};

// Atualizar cargo
exports.atualizarCargo = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        const { nome_cargo } = req.body;

        if (!id ) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const sql = `
            UPDATE public.cargo 
            SET nome_cargo = $1 
            WHERE id_cargo = $2
            RETURNING *
        `;

        const result = await query(sql, [nome_cargo, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Cargo não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Cargo alterado com sucesso!', unidade: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar cargo:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar cargo.' });
    }
};

// Deletar cargo
exports.deletarCargo = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';

        if (!id ) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        await query('DELETE FROM public.cargo WHERE id_cargo = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Cargo excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar cargo:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem funcionários associados a este cargo.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir cargo.' });
    }
};