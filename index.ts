import * as path from 'path';

import { promises as fs } from 'fs';

import * as readline from "readline";

import { stdin as input, stdout as output } from 'process';


type Produto = {
    id: number;
    nome: string;
    valor: number;
};
type Cliente = {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
};
type Pedido = {
    data: string;
    idcliente: number;
    idproduto: number;
    custototal: number;
};

type vendas = {
    data: string;
    totalvendas: number;
};

let i = 1;

async function inicializaIdProdutos() {
    try {
        const data = await fs.readFile(ARQ.produtos, 'utf-8');
        const linhas = data.trim().split('\n').slice(1); // Ignora cabeçalho
        const ids = linhas.map(linha => parseInt(linha.split(',')[0])).filter(Number.isFinite);
        if (ids.length > 0) {
            i = Math.max(...ids) + 1;
        }
    } catch {
        i = 1;
    }
}

async function inicializaIdClientes() {
    try {
        const data = await fs.readFile(ARQ.clientes, 'utf-8');
        const linhas = data.trim().split('\n').slice(1); // Ignora cabeçalho
        const ids = linhas.map(linha => parseInt(linha.split(',')[0])).filter(Number.isFinite);
        if (ids.length > 0) {
            i = Math.max(...ids) + 1;
        }
    } catch {
        i = 1;
    }
}


const rl = readline.createInterface({ input, output });

const ROOT = path.resolve('.');
const DIR = {
  ts: path.join(ROOT, 'ts'),
  js: path.join(ROOT, 'js'),
  csv: path.join(ROOT, 'csv'),
  json: path.join(ROOT, 'json'),
};
const ARQ = {
  produtos: path.join(DIR.csv, 'produtos.csv'), // Produtos disponíveis
  clientes:   path.join(DIR.csv, 'clientes.csv'),   // Clientes cadastrados
  pedidos:   path.join(DIR.csv, 'pedidos.csv'),   // Pedidos realizados
  vendas:   path.join(DIR.csv, 'vendas.csv'), // Relatorio de vendas
};
const CAB = {
  produtos: 'id,nome,valor\n',
  clientes:   'id,nome,telefone,endereco\n',
  pedidos:   'data,idcliente,idproduto,custototal\n',
};


async function preparaAmbiente(): Promise<void> {
  await fs.mkdir(DIR.csv,  { recursive: true });

  await criaSeNaoExiste(ARQ.produtos, CAB.produtos);
  await criaSeNaoExiste(ARQ.clientes,   CAB.clientes);
  await criaSeNaoExiste(ARQ.pedidos,   CAB.pedidos);
  await criaSeNaoExiste(ARQ.vendas,   'RESUMO DIÁRIO DE VENDAS DA PIZZARIA\n');
}
async function criaSeNaoExiste(caminho: string, conteudo: string): Promise<void> {
  try { await fs.access(caminho); }
  catch { await fs.writeFile(caminho, conteudo, 'utf8'); }
}


async function cadastrarCliente() {
    await inicializaIdClientes();
    rl.question('Digite o nome do cliente: ', (nome) => {
        rl.question('Digite o telefone do cliente: ', (telefone) => {
            rl.question('Digite o endereço do cliente: ', (endereco) => {
                const novoCliente = { id: i++, nome, telefone, endereco };
                fs.appendFile(ARQ.clientes, `${novoCliente.id},${novoCliente.nome},${novoCliente.telefone},${novoCliente.endereco}\n`, 'utf8')
                    .then(() => {
                        console.log('Cliente cadastrado com sucesso!');
                        voltarMenu();
                    })
                    .catch((err) => {
                        console.error('Erro ao cadastrar cliente:', err);
                        voltarMenu();
                    });
            });
        });
    }); 
}


async function cadastrarProdutos() {
    await inicializaIdProdutos();
    rl.question('Digite o nome do produto: ', (nome) => {
        rl.question('Digite o valor do produto: ', (valor) => {
            const novoProduto: Produto = { id: i++, nome, valor: parseFloat(valor) };
            fs.appendFile(ARQ.produtos, `${novoProduto.id},${novoProduto.nome},${novoProduto.valor}\n`, 'utf8')
                .then(() => {
                    console.log('Produto cadastrado com sucesso!');
                    voltarMenu();
                })
                .catch((err) => {
                    console.error('Erro ao cadastrar produto:', err);
                    voltarMenu();
                });
        });
    });
}




function listarProdutos() {
    fs.readFile(ARQ.produtos, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1); // Ignora o cabeçalho
            console.log('Produtos disponíveis:');
            linhas.forEach((linha) => {
                const [id, nome, valor] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Valor: R$${valor}`);
            }); mostrarMenu();
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
        });
}

function listarClientes() {
    fs.readFile(ARQ.clientes, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1); // Ignora o cabeçalho
            console.log('Clientes cadastrados:');
            linhas.forEach((linha) => {
                const [id, nome, telefone, endereco] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Telefone: R$${telefone}, Endereço: ${endereco}`);
            }); mostrarMenu();
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
        });
}

function mostrarMenu() {
  preparaAmbiente();
  console.log("\n-------- PIZZARIA GIACOMMINI --------");
  console.log("1 - Cadastros");
  console.log("2 - Pedidos");
  console.log("3 - Sair");
    console.log("-------------------------------------\n");
    rl.question("\nEscolha uma opção: ", (opcao) => {
        switch (opcao) {
            case "1":
                mostrarMenuCad();
                break;
            case "2":
                mostrarMenuPed();
                break;
            case "3":
                console.log("Encerrando o Sistema.");
                rl.close();
                break;
            default:
                console.log("Opção Inválida.");
                mostrarMenu();
        }
    });
}

function mostrarMenuCad() {
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("1 - Cadastrar Cliente");
    console.log("2 - Cadastrar Produto");
    console.log("3 - Listar Produtos");
    console.log("4 - Listar Clientes");
    console.log("5 - Voltar ao Menu Principal");
    console.log("-------------------------------------\n");
    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case "1":
                cadastrarCliente();
                break;
            case "2":
                cadastrarProdutos();
                break;
            case "3":
                listarProdutos();
                break;
            case "4":
                listarClientes();
                break;
            case "5":
                mostrarMenu();
                break;
            default:
                console.log("Opção Inválida.");
                mostrarMenu();
        }
    });
}



function mostrarMenuPed() {
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("1 - Fazer Pedido");
    console.log("2 - Listar Pedidos");
    console.log("3 - Voltar ao Menu Principal");
    console.log("-------------------------------------\n");
    rl.question("\nEscolha uma opção: ", (opcao) => {
        switch (opcao) {
            case "1":
                //fazerPedido();
                break;  
            case "2":
               // listarPedidos();
                break;
            case "3":
                mostrarMenu();
                break;
            default:
                console.log("Opção Inválida.");
                mostrarMenu();
        }
    });
}
mostrarMenu();

function voltarMenu() {
    console.log("\nEscolha uma opção: ");
    console.log("1 - Cadastrar novamente");
    console.log("2 - Voltar ao menu principal");
    console.log("3 - Sair");
    rl.question("Digite a opção desejada: ", (opcao) => {
        switch (opcao) {
            case "1":
                cadastrarProdutos();
                break;
            case "2":
                mostrarMenu();
                break;
            case "3":
                console.log("Encerrando o Sistema.");
                rl.close();
                break;
        }
    });
}