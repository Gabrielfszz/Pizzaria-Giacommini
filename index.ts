import * as path from 'path';

import { promises as fs } from 'fs';

import * as readline from "readline";

import { stdin as input, stdout as output } from 'process';


type Produto = {
    id: number;
    nome: string;
    valor: number;
    tipo: 'pizza' | 'bebida' | 'sobremesa';
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
  produtos: 'id,nome,valor,tipo\n',
  clientes: 'id,nome,telefone,endereco\n',
  pedidos: 'data,idcliente,idproduto,custototal\n',
};

// CRIA OS ARQUIVOS .CSV
async function preparaAmbiente(): Promise<void> {
  await fs.mkdir(DIR.csv,  { recursive: true });

  await criaSeNaoExiste(ARQ.produtos, CAB.produtos);
  await criaSeNaoExiste(ARQ.clientes,   CAB.clientes);
  await criaSeNaoExiste(ARQ.pedidos,   CAB.pedidos);
  await criaSeNaoExiste(ARQ.vendas,   'RESUMO DIÁRIO DE VENDAS DA PIZZARIA\n');
}

async function criaSeNaoExiste(caminho: string, conteudo: string): Promise<void> {
  try { await fs.access(caminho); }
  catch { 
    const cabecalho = conteudo.endsWith('\n') ? conteudo : conteudo + '\n';
    await fs.writeFile(caminho, cabecalho, 'utf8'); 
  }
}

// MOSTRAR MENU PRINCIPAL
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

// MENU DE CADASTROS (CLIENTES, PRODUTOS, LISTAR)
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
// FUNÇÕES REFERENTES AO CADASTRO DE CLIENTES
async function cadastrarCliente() {
    await inicializaIdClientes();
    rl.question('Digite o nome do cliente: ', (nome) => {
        rl.question('Digite o telefone do cliente (11 Dígitos): ', 
            function perguntarTelefone(telefone) {
            // Remove espaços e verifica se é numérico e tem 11 caracteres
            if (!/^\d{11}$/.test(telefone)) {
                console.log('Digite um telefone válido.');
                rl.question('Digite o telefone do cliente (11 Dígitos): ', perguntarTelefone);
                return;
            }
            rl.question('Digite o endereço do cliente: ', (endereco) => {
                const novoCliente: Cliente = { id: i++, nome, telefone, endereco };
                fs.appendFile(ARQ.clientes, `${novoCliente.id},${novoCliente.nome},${novoCliente.telefone},${novoCliente.endereco}\n`, 'utf8')
                    .then(() => {
                        console.log('Cliente cadastrado com sucesso!');
                        voltarMenuCadClientes();
                    })
                    .catch((err) => {
                        console.error('Erro ao cadastrar cliente:', err);
                        voltarMenuCadClientes();
                    });
            });
        });
    }); 
}
function listarClientes() {
    fs.readFile(ARQ.clientes, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1); // Ignora o cabeçalho
            if (linhas.length === 0) {
                console.log('Não há clientes cadastrados.');
                voltarMenuCadClientes();
                return;
            }
            console.log('Clientes cadastrados:');
            linhas.forEach((linha) => {
                const [id, nome, telefone, endereco] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Telefone: +55${telefone}, Endereço: ${endereco}`);
            });
            alteracaoClientes();
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
        });
}
function voltarMenuCadClientes() {
    console.log("\nEscolha uma opção: ");
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("1 - Cadastrar novo Cliente");
    console.log("2 - Listar Clientes");
    console.log("3 - Voltar");
    console.log("4 - Sair");
    console.log("-------------------------------------\n");    
    rl.question("Digite a opção desejada: ", (opcao) => {
        switch (opcao) {
            case "1":
                cadastrarCliente();
                break;
            case "2":
                listarClientes();
                break;
            case "3":
                mostrarMenuCad();
                break;
            case "4":
                console.log("Encerrando o Sistema.");
                rl.close();
                break;
            default:
                console.log("Opção Inválida.");
                voltarMenuCadClientes();
                break;
        }
    });
}
function alteracaoClientes() {
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("1 - Atualizar Cliente");
    console.log("2 - Excluir Cliente");
    console.log("3 - Voltar");
    console.log("-------------------------------------\n");
    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case "1":
                atualizarCliente();
                break;
            case "2":
                excluirCliente();
                break;
            case "3":
                mostrarMenuCad();
                break;
            default:
                console.log("Opção Inválida.");
                alteracaoClientes();
        }
    });
}
function excluirCliente() {
    fs.readFile(ARQ.clientes, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1);
            console.log('Clientes cadastrados:');
            linhas.forEach((linha) => {
                const [id, nome, telefone, endereco] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Telefone: +55${telefone}, Endereço: ${endereco}`);
            });
            rl.question('Digite o ID do cliente que deseja excluir: ', (id) => {
                const cliente = linhas.find(linha => linha.startsWith(id + ','));
                if (cliente) {
                    const novasLinhas = linhas.filter(linha => !linha.startsWith(id + ','));
                    fs.writeFile(ARQ.clientes, CAB.clientes + novasLinhas.join('\n') + '\n', 'utf-8')
                        .then(() => {
                            console.log('Cliente excluído com sucesso!');
                            alteracaoClientes();
                        })
                        .catch((err) => {
                            console.error('Erro ao excluir cliente:', err);
                            alteracaoClientes();
                        });
                } else {
                    console.log('Cliente não encontrado.');
                    alteracaoClientes();
                }
            });
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            alteracaoClientes();
        });
}
function atualizarCliente() {
    fs.readFile(ARQ.clientes, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1);
            console.log('Clientes cadastrados:');
            linhas.forEach((linha) => {
                const [id, nome, telefone, endereco] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Telefone: +55${telefone}, Endereço: ${endereco}`);
            });
            rl.question('Digite o ID do cliente que deseja atualizar: ', (id) => {
                const cliente = linhas.find(linha => linha.startsWith(id + ','));
                if (cliente) {
                    const [_, nomeAtual, telefoneAtual, enderecoAtual] = cliente.split(',');
                    rl.question(`Digite o novo nome do cliente (atual: ${nomeAtual}): `, (novoNome) => {
                        rl.question(`Digite o novo telefone do cliente (atual: ${telefoneAtual}): `, (novoTelefone) => {
                            rl.question(`Digite o novo endereço do cliente (atual: ${enderecoAtual}): `, (novoEndereco) => {
                                const atualizado = `${id},${novoNome || nomeAtual},${novoTelefone || telefoneAtual},${novoEndereco || enderecoAtual}`;
                                const novasLinhas = linhas.map(linha => linha.startsWith(id + ',') ? atualizado : linha);
                                fs.writeFile(ARQ.clientes, CAB.clientes + novasLinhas.join('\n') + '\n', 'utf-8')
                                    .then(() => {
                                        console.log('Cliente atualizado com sucesso!');
                                        alteracaoClientes();
                                    })
                                    .catch((err) => {
                                        console.error('Erro ao atualizar cliente:', err);
                                        alteracaoClientes();
                                    });
                            });
                        });
                    });
                } else {
                    console.log('Cliente não encontrado.');
                    alteracaoClientes();
                }
            });
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            alteracaoClientes();
        });
}


// FUNÇÕES REFERENTES AO CADASTRO DE PRODUTOS

async function cadastrarProdutos() {
    await inicializaIdProdutos();
    rl.question('Digite o tipo do produto (pizza, bebida, sobremesa): ', (tipo) => {
        const tipoValido = ['pizza', 'bebida', 'sobremesa'].includes(tipo.toLowerCase());
        if (!tipoValido) {
            console.log('Tipo inválido. Digite pizza, bebida ou sobremesa.');
            return cadastrarProdutos();
        }
        rl.question('Digite o nome do produto: ', (nome) => {
            rl.question('Digite o valor do produto: ', (valor) => {
                const novoProduto: Produto = { id: i++, nome, valor: parseFloat(valor), tipo: tipo.toLowerCase() as any };
                fs.appendFile(ARQ.produtos, `${novoProduto.id},${novoProduto.nome},${novoProduto.valor},${novoProduto.tipo}\n`, 'utf8')
                    .then(() => {
                        console.log('Produto cadastrado com sucesso!');
                        voltarMenuCadProdutos();
                    })
                    .catch((err) => {
                        console.error('Erro ao cadastrar produto:', err);
                        voltarMenuCadProdutos();
                    });
            });
        });
    });
}
function listarProdutos() {
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("Escolha o tipo de produto para listar:");
    console.log("1 - Pizzas");
    console.log("2 - Bebidas");
    console.log("3 - Sobremesas");
    console.log("4 - Voltar");
    console.log("-------------------------------------\n");
    rl.question("Digite a opção desejada: ", (opcao) => {
        switch (opcao) {
            case "1":
                listarProdutosPorTipo('pizza');
                break;
            case "2":
                listarProdutosPorTipo('bebida');
                break;
            case "3":
                listarProdutosPorTipo('sobremesa');
                break;
            case "4":
                voltarMenuCadProdutos();
                break;    
            default:
                console.log("Opção Inválida.");
        }
    });
}
function listarProdutosPorTipo(tipo: 'pizza' | 'bebida' | 'sobremesa') {
    fs.readFile(ARQ.produtos, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1); // Ignora o cabeçalho
            const filtrados = linhas.filter(linha => linha.split(',')[3] === tipo);
            if (filtrados.length === 0) {
                console.log(`Não há produtos do tipo ${tipo} cadastrados.`);
                voltarMenuCadProdutos();
                return;
            }
            console.log(`Produtos do tipo ${tipo}:`);
            filtrados.forEach((linha) => {
                const [id, nome, valor] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Valor: R$${valor}`);
            });
            alteracaoProdutos();
        }
        )
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            voltarMenuCadProdutos();
        });
}
function voltarMenuCadProdutos() {
    console.log("\nEscolha uma opção: ");
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("1 - Cadastrar novo Produto");
    console.log("2 - Listar Produtos");
    console.log("3 - Voltar");
    console.log("4 - Sair");
    console.log("-------------------------------------\n");    
    rl.question("Digite a opção desejada: ", (opcao) => {
        switch (opcao) {
            case "1":
                cadastrarProdutos();
                break;
            case "2":
                listarProdutos();
                break;
            case "3":
                mostrarMenuCad();
                break;
            case "4":
                console.log("Encerrando o Sistema.");
                rl.close();
                break;
            default:
                console.log("Opção Inválida.");
                voltarMenuCadProdutos();
                break;
        }
    });
}
function alteracaoProdutos() {
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("1 - Atualizar Produto");
    console.log("2 - Excluir Produto");
    console.log("3 - Voltar");
    console.log("-------------------------------------\n");
    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case "1":
                atualizarProduto();
                break;
            case "2":
                excluirProduto();
                break;
            case "3":
                listarProdutos();
                break;
            default:
                console.log("Opção Inválida.");
                alteracaoProdutos();
        }
    });
}
function excluirProduto() {
    fs.readFile(ARQ.produtos, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1);
            console.log('Produtos disponíveis:');
            linhas.forEach((linha) => {
                const [id, nome, valor] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Valor: R$${valor}`);
            });
            rl.question('Digite o ID do produto que deseja excluir: ', (id) => {
                const produto = linhas.find(linha => linha.startsWith(id + ','));
                if (produto) {
                    const novasLinhas = linhas.filter(linha => !linha.startsWith(id + ','));
                    fs.writeFile(
                        ARQ.produtos,
                        CAB.produtos + novasLinhas.join('\n') + (novasLinhas.length ? '\n' : ''),
                        'utf-8'   )
                        .then(() => {
                            console.log('Produto excluído com sucesso!');
                            alteracaoProdutos();
                        })
                        .catch((err) => {
                            console.error('Erro ao excluir produto:', err);
                            alteracaoProdutos();
                        });
                } else {
                    console.log('Produto não encontrado.');
                    alteracaoProdutos();
                }
            });
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            alteracaoProdutos();
        });
}
function atualizarProduto() {
    fs.readFile(ARQ.produtos, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1);
            console.log('Produtos disponíveis:');
            linhas.forEach((linha) => {
                const [id, nome, valor, tipo] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Valor: R$${valor}, Tipo: ${tipo}`);
            });
            rl.question('Digite o ID do produto que deseja atualizar: ', (id) => {
                const produto = linhas.find(linha => linha.startsWith(id + ','));
                if (produto) {
                    const [_, nomeAtual, valorAtual, tipoAtual] = produto.split(',');
                    rl.question(`Digite o novo nome do produto (atual: ${nomeAtual}): `, (novoNome) => {
                        rl.question(`Digite o novo valor do produto (atual: R$${valorAtual}): `, (novoValor) => {
                            rl.question(`Digite o novo tipo do produto (atual: ${tipoAtual}): `, (novoTipo) => {
                                const tipoValido = novoTipo ? ['pizza', 'bebida', 'sobremesa'].includes(novoTipo.toLowerCase()) : true;
                                if (!tipoValido) {
                                    console.log('Tipo inválido. Digite Pizza, Bebida ou Sobremesa.');
                                    return atualizarProduto();
                                }
                                const atualizado = `${id},${novoNome || nomeAtual},${novoValor || valorAtual},${novoTipo ? novoTipo.toLowerCase() : tipoAtual}`;
                                const novasLinhas = linhas.map(linha => linha.startsWith(id + ',') ? atualizado : linha);
                                fs.writeFile(ARQ.produtos, CAB.produtos + novasLinhas.join('\n') + '\n', 'utf-8')
                                    .then(() => {
                                        console.log('Produto atualizado com sucesso!');
                                        alteracaoProdutos();
                                    })
                                    .catch((err) => {
                                        console.error('Erro ao atualizar produto:', err);
                                        alteracaoProdutos();
                                    });
                            });
                        });
                    });
                } else {
                    console.log('Produto não encontrado.');
                    alteracaoProdutos();
                }
            });
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            alteracaoProdutos();
        });
}


// FUNÇÕES RELACIONADAS AOS PEDIDOS

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

function voltarMenuPed() {
    console.log("\nEscolha uma opção: ");
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("1 - Fazer novo Pedido");
    console.log("2 - Voltar");
    console.log("3 - Sair");
    console.log("-------------------------------------\n");
    rl.question("Digite a opção desejada: ", (opcao) => {
        switch (opcao) {
            case "1":
                //fazerPedido();
                break;
            case "2":
                mostrarMenuPed();
                break;
            case "3":
                console.log("Encerrando o Sistema.");
                rl.close();
                break;
        }
    });
}








mostrarMenu();