const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

app.post('/addPessoa', (req, res) => {
    const novaPessoa = req.body;

    // Caminho absoluto para pessoas.json
    const filePath = path.join(__dirname, './public/pessoas.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao ler o arquivo');
        }

        let pessoas;
        try {
            pessoas = JSON.parse(data);
        } catch (parseError) {
            console.error('Erro ao processar o arquivo:', parseError);
            return res.status(500).send('Erro ao processar o arquivo');
        }

        pessoas.push(novaPessoa);

        fs.writeFile(filePath, JSON.stringify(pessoas, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
                return res.status(500).send('Erro ao escrever no arquivo');
            }
            res.status(200).send('Pessoa adicionada com sucesso!');
        });
    });
});

app.delete('/deletePessoa', (req, res) => {
    console.log('Dados recebidos:', req.body.nome);
    const nome = req.body.nome;

    // Caminho absoluto para pessoas.json
    const filePath = path.join(__dirname, './public/pessoas.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao ler o arquivo');
        }

        let pessoas;
        try {
            pessoas = JSON.parse(data);
        } catch (parseError) {
            console.error('Erro ao processar o arquivo:', parseError);
            return res.status(500).send('Erro ao processar o arquivo');
        }

        const index = pessoas.findIndex(p => p.nome === nome);
        if (index === -1) {
            return res.status(404).send('Nenhuma pessoa encontrada com o nome: ' + nome);
        }

        pessoas.splice(index, 1);

        fs.writeFile(filePath, JSON.stringify(pessoas, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
                return res.status(500).send('Erro ao escrever no arquivo');
            }
            res.status(200).send('Pessoa excluída com sucesso!');
        });
    });
});


// Rota para servir a aplicação principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
