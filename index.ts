import * as path from 'path';
import { promises as fs } from 'fs';
import * as readline from "readline";
import { stdin as input, stdout as output } from 'process';

type Produto = {
    id: number;
    tipo: 'pizza' | 'bebida' | 'sobremesa';
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
    formapagamento?: 'dinheiro' | 'cartao' | 'pix';
};

let iCliente = 1;
let iProduto = 1;

// VERIFICA IDS DOS PRODUTOS CADASTRADOS E ACRESCENTA +1

async function inicializaIdProdutos() { 
    try {
        const data = await fs.readFile(ARQ.produtos, 'utf-8');
        const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
        const ids = linhas.map(linha => parseInt(linha.split(',')[0])).filter(Number.isFinite);
        if (ids.length > 0) {
            iProduto = Math.max(...ids) + 1;
        } else {
            iProduto = 1;
        }
    } catch {
        iProduto = 1;
    }
}

// VERIFICA IDS DOS CLIENTES CADASTRADOS E ACRESCENTA +1
async function inicializaIdClientes() {
    try {
        const data = await fs.readFile(ARQ.clientes, 'utf-8');
        const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
        const ids = linhas.map(linha => parseInt(linha.split(',')[0])).filter(Number.isFinite);
        if (ids.length > 0) {
            iCliente = Math.max(...ids) + 1;
        } else {
            iCliente = 1;
        }
    } catch {
        iCliente = 1;
    }
}

// CONSTANTE RL PARA CRIAR INTERFACE
const rl = readline.createInterface({ input, output });

// DEFININDO CAMINHOS DOS ARQUIVOS CSV
const ROOT = path.resolve(__dirname, '..');
const DIR = {
  ts: path.join(ROOT, 'ts'),
  js: path.join(ROOT, 'js'),
  csv: path.join(ROOT, 'csv'),
  json: path.join(ROOT, 'json'),
};
const ARQ = {
  produtos: path.join(DIR.csv, 'produtos.csv'),
  clientes:   path.join(DIR.csv, 'clientes.csv'),
  pedidos:   path.join(DIR.csv, 'pedidos.csv'),
};
const CAB = {
  produtos: 'id,tipo,nome,valor\n',
  clientes: 'id,nome,telefone,endereco\n',
  pedidos: 'data,idcliente,idproduto,custototal,formapagamento\n',
};

// CRIA OS ARQUIVOS .CSV
async function preparaAmbiente(): Promise<void> {
  await fs.mkdir(DIR.csv,  { recursive: true });
  await criaSeNaoExiste(ARQ.produtos, CAB.produtos);
  await criaSeNaoExiste(ARQ.clientes,   CAB.clientes);
  await criaSeNaoExiste(ARQ.pedidos,   CAB.pedidos);
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
  console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
  console.log("1 - Cadastros");
  console.log("2 - Pedidos");
  console.log("3 - Sair");
  console.log("---------------------------------------------------");
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
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Cadastrar Cliente");
    console.log("2 - Cadastrar Produto");
    console.log("3 - Listar Produtos");
    console.log("4 - Listar Clientes");
    console.log("5 - Voltar ao Menu Principal");
    console.log("---------------------------------------------------\n");
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
                mostrarMenuCad();
        }
    });
}

// CADASTRO DE CLIENTES
async function cadastrarCliente() {
    await inicializaIdClientes();
    rl.question('Digite o nome do cliente: ', (nome) => {
        rl.question('Digite o telefone do cliente (11 Dígitos): ',
            function perguntarTelefone(telefone) {
            if (!/^\d{11}$/.test(telefone)) {
                console.log('\nERRO: Digite um telefone válido.');
                rl.question('Digite o telefone do cliente (11 Dígitos): ', perguntarTelefone);
                return;
            }
            rl.question('Digite o endereço do cliente: ', (endereco) => {
                const novoCliente: Cliente = { id: iCliente++, nome, telefone, endereco };
                fs.appendFile(ARQ.clientes, `${novoCliente.id},${novoCliente.nome},${novoCliente.telefone},${novoCliente.endereco}\n`, 'utf8')
                    .then(() => {
                        console.log('\nCliente cadastrado com sucesso!');
                        voltarMenuCadClientes();
                    })
                    .catch((err) => {
                        console.error('\nErro ao cadastrar cliente:', err);
                        voltarMenuCadClientes();
                    });
            });
        });
    });
}
function listarClientes() {
    fs.readFile(ARQ.clientes, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            if (linhas.length === 0) {
                console.log('Não há clientes cadastrados.');
                voltarMenuCadClientes();
                return;
            }
            console.log('\n-------------------------------------------------- PIZZARIA GIACOMMINI --------------------------------------------------\nClientes cadastrados:');
            linhas.forEach((linha) => {
                const [id, nome, telefone, endereco] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Telefone: +55${telefone}, Endereço: ${endereco}`);
            });
            console.log("-------------------------------------------------------------------------------------------------------------------------");
            alteracaoClientes();
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
        });
}
function voltarMenuCadClientes() {
    console.log("\nEscolha uma opção: ");
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Cadastrar novo Cliente");
    console.log("2 - Listar Clientes");
    console.log("3 - Voltar");
    console.log("4 - Sair");
    console.log("---------------------------------------------------\n");
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
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Atualizar Cliente");
    console.log("2 - Excluir Cliente");
    console.log("3 - Voltar");
    console.log("---------------------------------------------------\n");
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
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            console.log('Clientes cadastrados:');
            linhas.forEach((linha) => {
                const [id, nome, telefone, endereco] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Telefone: +55${telefone}, Endereço: ${endereco}`);
            });
            rl.question('Digite o ID do cliente que deseja excluir: ', (id) => {
                const cliente = linhas.find(linha => linha.startsWith(id + ','));
                if (cliente) {
                    const novasLinhas = linhas.filter(linha => !linha.startsWith(id + ','));
                    fs.writeFile(ARQ.clientes, CAB.clientes + novasLinhas.join('\n') + (novasLinhas.length ? '\n' : ''), 'utf-8')
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
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            console.log('\n-------------------------------------------------- PIZZARIA GIACOMMINI --------------------------------------------------\nClientes cadastrados:');
            linhas.forEach((linha) => {
                const [id, nome, telefone, endereco] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Telefone: +55${telefone}, Endereço: ${endereco}`);
            });
            console.log("-------------------------------------------------------------------------------------------------------------------------");
            rl.question('Digite o ID do cliente que deseja atualizar: ', (id) => {
                const cliente = linhas.find(linha => linha.startsWith(id + ','));
                if (cliente) {
                    const [_, nomeAtual, telefoneAtual, enderecoAtual] = cliente.split(',');
                    rl.question(`Digite o novo nome do cliente (atual: ${nomeAtual}): `, (novoNome) => {
                        rl.question(`Digite o novo telefone do cliente (atual: ${telefoneAtual}): `, function perguntarNovoTelefone(novoTelefone) {
                            if (novoTelefone && !/^\d{11}$/.test(novoTelefone)) {
                                console.log('\nERRO: Digite um telefone válido.');
                                rl.question(`Digite o novo telefone do cliente (atual: ${telefoneAtual}): `, perguntarNovoTelefone);
                                return;
                            }
                            rl.question(`Digite o novo endereço do cliente (atual: ${enderecoAtual}): `, (novoEndereco) => {
                                const atualizado = `${id},${novoNome || nomeAtual},${novoTelefone || telefoneAtual},${novoEndereco || enderecoAtual}`;
                                const novasLinhas = linhas.map(linha => linha.startsWith(id + ',') ? atualizado : linha);
                                fs.writeFile(ARQ.clientes, CAB.clientes + novasLinhas.join('\n') + (novasLinhas.length ? '\n' : ''), 'utf-8')
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

// CADASTRO DE PRODUTOS
async function cadastrarProdutos() {
    await inicializaIdProdutos();
    rl.question('Digite o tipo do produto (pizza, bebida, sobremesa): ', (tipo) => {
        const tipoValido = ['pizza', 'bebida', 'sobremesa'].includes(tipo.toLowerCase());
        if (!tipoValido) {
            console.log('Tipo inválido. Digite pizza, bebida ou sobremesa.');
            return cadastrarProdutos();
        }
        rl.question('Digite o nome do produto: ', (nome) => {
            rl.question('Digite o valor do produto: ', function perguntarValor(valor) {
                const valorNum = parseFloat(valor);
                if (isNaN(valorNum) || valorNum <= 0) {
                    console.log('Digite um valor numérico válido e maior que zero.');
                    rl.question('Digite o valor do produto: ', perguntarValor);
                    return;
                }
                const novoProduto: Produto = { id: iProduto++, nome, valor: valorNum, tipo: tipo.toLowerCase() as any };
                fs.appendFile(ARQ.produtos, `${novoProduto.id},${novoProduto.tipo},${novoProduto.nome},${novoProduto.valor}\n`, 'utf8')
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
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("Escolha o tipo de produto para listar:");
    console.log("1 - Pizzas");
    console.log("2 - Bebidas");
    console.log("3 - Sobremesas");
    console.log("4 - Voltar");
    console.log("---------------------------------------------------\n");
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
                mostrarMenuCad();
                break;
            default:
                console.log("Opção Inválida.");
                listarProdutos();
                break;
        }
    });
}

function listarProdutosPorTipo(tipo: 'pizza' | 'bebida' | 'sobremesa') {
    fs.readFile(ARQ.produtos, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            const filtrados = linhas.filter(linha => linha.split(',')[1] === tipo);
            if (filtrados.length === 0) {
                console.log(`\nNão há produtos do tipo ${tipo} cadastrados.`);
                voltarMenuCadProdutos();
                return;
            }
            console.log(`\n--------------- PIZZARIA GIACOMMINI ---------------\nProdutos do tipo ${tipo}:`);
            filtrados.forEach((linha) => {
                const [id, , nome, valor] = linha.split(',');
                console.log(`ID: ${id}, Nome: ${nome}, Valor: R$${valor}`);
            });
            console.log("---------------------------------------------------");
            alteracaoProdutos();
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            voltarMenuCadProdutos();
        });
}
function voltarMenuCadProdutos() {
    console.log("\nEscolha uma opção: ");
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Cadastrar novo Produto");
    console.log("2 - Listar Produtos");
    console.log("3 - Voltar");
    console.log("4 - Sair");
    console.log("---------------------------------------------------\n");
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
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Atualizar Produto");
    console.log("2 - Excluir Produto");
    console.log("3 - Voltar");
    console.log("---------------------------------------------------\n");
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
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
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
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            console.log('\n--------------- PIZZARIA GIACOMMINI ---------------\nProdutos disponíveis:');
            linhas.forEach((linha) => {
                const [id, tipo, nome, valor] = linha.split(',');
                console.log(`ID: ${id}, Tipo: ${tipo}, Nome: ${nome}, Valor: R$${valor}`);
            });
            console.log("---------------------------------------------------\n");
            rl.question('Digite o ID do produto que deseja atualizar: ', (id) => {
                const produto = linhas.find(linha => linha.startsWith(id + ','));
                if (produto) {
                    const [_, tipoAtual, nomeAtual, valorAtual] = produto.split(',');
                    rl.question(`Digite o novo tipo do produto (atual: ${tipoAtual}): `, (novoTipo) => {
                        const tipoValido = ['pizza', 'bebida', 'sobremesa'].includes(novoTipo.toLowerCase());
                        if (novoTipo && !tipoValido) {
                            console.log('Tipo inválido. Digite pizza, bebida ou sobremesa.');
                            return atualizarProduto();
                        }
                        rl.question(`Digite o novo nome do produto (atual: ${nomeAtual}): `, (novoNome) => {
                            rl.question(`Digite o novo valor do produto (atual: R$${valorAtual}): `, function perguntarValor(novoValor) {
                                if (novoValor) {
                                    const valorNum = parseFloat(novoValor);
                                    if (isNaN(valorNum) || valorNum <= 0) {
                                        console.log('Digite um valor numérico válido e maior que zero.');
                                        rl.question(`Digite o novo valor do produto (atual: R$${valorAtual}): `, perguntarValor);
                                        return;
                                    }
                                    const atualizado = `${id},${novoTipo || tipoAtual},${novoNome || nomeAtual},${valorNum}`;
                                    const novasLinhas = linhas.map(linha => linha.startsWith(id + ',') ? atualizado : linha);
                                    fs.writeFile(ARQ.produtos, CAB.produtos + novasLinhas.join('\n') + (novasLinhas.length ? '\n' : ''), 'utf-8')
                                        .then(() => {
                                            console.log('Produto atualizado com sucesso!');
                                            alteracaoProdutos();
                                        })
                                        .catch((err) => {
                                            console.error('Erro ao atualizar produto:', err);
                                            alteracaoProdutos();
                                        });
                                } else {
                                    const atualizado = `${id},${novoTipo || tipoAtual},${novoNome || nomeAtual},${valorAtual}`;
                                    const novasLinhas = linhas.map(linha => linha.startsWith(id + ',') ? atualizado : linha);
                                    fs.writeFile(ARQ.produtos, CAB.produtos + novasLinhas.join('\n') + (novasLinhas.length ? '\n' : ''), 'utf-8')
                                        .then(() => {
                                            console.log('Produto atualizado com sucesso!');
                                            alteracaoProdutos();
                                        })
                                        .catch((err) => {
                                            console.error('Erro ao atualizar produto:', err);
                                            alteracaoProdutos();
                                        });
                                }
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

// PEDIDOS
function mostrarMenuPed() {
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Fazer Pedido");
    console.log("2 - Listar Pedidos");
    console.log("3 - Relatórios");
    console.log("4 - Extras")
    console.log("5 - Voltar ao Menu Principal");
    console.log("---------------------------------------------------\n");
    rl.question("\nEscolha uma opção: ", (opcao) => {
        switch (opcao) {
            case "1":
                fazerPedido();
                break;
            case "2":
               listarPedidos();
                break;
            case "3":
                menuRelatorios();
                break;
            case "4":
                menuExtras();
                break;
            case "5":
                mostrarMenu();
                break;
            default:
                console.log("Opção Inválida.");
                mostrarMenuPed();
        }
    });
}
function voltarMenuPed() {
    console.log("\nEscolha uma opção: ");
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Fazer novo Pedido");
    console.log("2 - Voltar");
    console.log("3 - Sair");
    console.log("---------------------------------------------------\n");
    rl.question("Digite a opção desejada: ", (opcao) => {
        switch (opcao) {
            case "1":
                fazerPedido();
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
async function fazerPedido() {
    const clientesData = await fs.readFile(ARQ.clientes, 'utf-8');
    const clientes = clientesData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
    if (clientes.length === 0) {
        console.log('Nenhum cliente cadastrado.');
        mostrarMenuPed();
        return;
    }
    console.log('Clientes:\n');
    clientes.forEach(linha => {
        const [id, nome, telefone] = linha.split(',');
        console.log(`ID: ${id}, Nome: ${nome}, Telefone: +55${telefone}`);
    });
    rl.question('\nDigite o ID do cliente: ', async (idCliente) => {
        const clienteExiste = clientes.some(linha => linha.startsWith(idCliente + ','));
        if (!clienteExiste) {
            console.log('Cliente não encontrado.');
            return mostrarMenuPed();
        }
        const produtosData = await fs.readFile(ARQ.produtos, 'utf-8');
        const produtos = produtosData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
        if (produtos.length === 0) {
            console.log('Nenhum produto cadastrado.');
            return mostrarMenuPed();
        }
        let pedidoItens: { idproduto: number, valor: number }[] = [];
        selecionarTipoProduto(produtos, pedidoItens, idCliente);
    });
}
function selecionarTipoProduto(
    produtos: string[],
    pedidoItens: { idproduto: number, valor: number }[],
    idCliente: string
) {
    let total = 0;
    console.log('\nSelecione o tipo de produto:');
    console.log('1 - Pizza');
    console.log('2 - Bebida');
    console.log('3 - Sobremesa');
    console.log('4 - Finalizar pedido');
    rl.question('\nDigite a opção desejada: ', (opcaoTipo) => {
        let tipo: 'pizza' | 'bebida' | 'sobremesa' | null = null;
        switch (opcaoTipo) {
            case '1': tipo = 'pizza'; break;
            case '2': tipo = 'bebida'; break;
            case '3': tipo = 'sobremesa'; break;
            case '4':
                if (pedidoItens.length === 0) {
                    console.log('Nenhum produto selecionado.');
                    return mostrarMenuPed();
                }
                total = pedidoItens.reduce((acc, item) => acc + item.valor, 0);
                console.log(`\nTotal do pedido: R$${total.toFixed(2)}`);
                return selecionarFormaPagamento(total, pedidoItens, parseInt(idCliente));
            default:
                console.log('Opção inválida.');
                return selecionarTipoProduto(produtos, pedidoItens, idCliente);
        }
        selecionarProdutoPorTipo(tipo, produtos, pedidoItens, idCliente);
    });
}
function selecionarProdutoPorTipo(
    tipo: 'pizza' | 'bebida' | 'sobremesa',
    produtos: string[],
    pedidoItens: { idproduto: number, valor: number }[],
    idCliente: string
) {
    const produtosFiltrados = produtos.filter(linha => linha.split(',')[1] === tipo);
    if (produtosFiltrados.length === 0) {
        console.log(`Não há produtos do tipo ${tipo} cadastrados.`);
        return selecionarTipoProduto(produtos, pedidoItens, idCliente);
    }
    console.log(`\nProdutos do tipo ${tipo}:`);
    produtosFiltrados.forEach(linha => {
        const [id, , nome, valor] = linha.split(',');
        console.log(`ID: ${id}, Nome: ${nome}, Valor: R$${valor}`);
    });
    rl.question('\nDigite o ID do produto para adicionar ao pedido: ', (idProduto) => {
        const produtoLinha = produtosFiltrados.find(linha => linha.startsWith(idProduto + ','));
        if (!produtoLinha) {
            console.log('Produto não encontrado.');
            return selecionarProdutoPorTipo(tipo, produtos, pedidoItens, idCliente);
        }
        const [id, , nome, valor] = produtoLinha.split(',');
        pedidoItens.push({ idproduto: parseInt(id), valor: parseFloat(valor) });
        console.log(`Produto "${nome}" adicionado ao pedido.`);
        rl.question('\nDeseja adicionar mais algum item? (s/n): ', (resposta) => {
            if (resposta.trim().toLowerCase() === 's') {
                selecionarTipoProduto(produtos, pedidoItens, idCliente);
            } else {
                if (pedidoItens.length === 0) {
                    console.log('Nenhum produto selecionado.');
                    return mostrarMenuPed();
                }
                const total = pedidoItens.reduce((acc, item) => acc + item.valor, 0);
                console.log(`\nTotal do pedido: R$${total.toFixed(2)}`);
                return selecionarFormaPagamento(total, pedidoItens, parseInt(idCliente));
            }
        });
    });
}
function selecionarFormaPagamento(
    total: number,
    itens: { idproduto: number, valor: number }[], idcliente: number) {
    console.log('\n--------------- PIZZARIA GIACOMMINI ---------------\nSelecione a forma de pagamento:');
    console.log('1 - Dinheiro');
    console.log('2 - Cartão');
    console.log('3 - Pix');
    console.log("---------------------------------------------------\n");
    rl.question('\nOpção: ', async (opcao) => {
        let forma = '';
        switch (opcao) {
            case '1': forma = 'Dinheiro';
            break;
            case '2': forma = 'Cartão';
            break;
            case '3': forma = 'Pix';
            break;
            default:
                console.log('Opção inválida.');
                return selecionarFormaPagamento(total, itens, idcliente);
        }
        const dataPedido = new Date().toISOString().split('T')[0];

        // --- NOVO: Verifica histórico de compras ---
        let desconto = 0;
        let primeiraCompra = false;
        try {
            const pedidosData = await fs.readFile(ARQ.pedidos, 'utf-8');
            const linhas = pedidosData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            const comprasCliente = linhas.filter(linha => linha.split(',')[1] === idcliente.toString());
            if (comprasCliente.length === 0) {
                desconto = 0.2; // 20%
                primeiraCompra = true;
            }
        } catch {
            desconto = 0.2;
            primeiraCompra = true;
        }
        let totalComDesconto = total;
        if (desconto > 0) {
            totalComDesconto = total * (1 - desconto);
            console.log('\nPromoção: 20% de desconto na primeira compra! 🎉');
            console.log(`Total com desconto: R$${totalComDesconto.toFixed(2)}`);
        }

        try {
            await Promise.all(itens.map(item => {
                const pedido: Pedido = {
                    data: dataPedido,
                    idcliente: idcliente,
                    idproduto: item.idproduto,
                    custototal: item.valor,
                    formapagamento: forma.toLowerCase() as 'dinheiro' | 'cartao' | 'pix'
                };
                return fs.appendFile(
                    ARQ.pedidos,
                    `${pedido.data},${pedido.idcliente},${pedido.idproduto},${pedido.custototal},${pedido.formapagamento}\n`,
                    'utf8'
                );
            }));
            const clientesData = await fs.readFile(ARQ.clientes, 'utf-8');
            const clienteLinha = clientesData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '').find(linha => linha.startsWith(idcliente + ','));
            let cliente: Cliente = { id: idcliente, nome: '', telefone: '', endereco: '' };
            if (clienteLinha) {
                const [id, nome, telefone, endereco] = clienteLinha.split(',');
                cliente = { id: parseInt(id), nome, telefone, endereco };
            }
            const produtosData = await fs.readFile(ARQ.produtos, 'utf-8');
            const produtos = produtosData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            await gerarRecibo(
                dataPedido,
                cliente,
                itens,
                produtos,
                totalComDesconto,
                forma + (primeiraCompra ? ' (1ª compra - 20% OFF)' : '')
            );
            console.log(`Pedido registrado com sucesso! Recibo gerado.`);
            voltarMenuPed();
        } catch (err) {
            console.error('Erro ao registrar pedido:', err);
            voltarMenuPed();
        }
    });
}
async function listarPedidos() {
    try {
        const clientesData = await fs.readFile(ARQ.clientes, 'utf-8');
        const clientes = clientesData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
        if (clientes.length === 0) {
            console.log('\nNão há clientes cadastrados.');
            mostrarMenuPed();
            return;
        }
        console.log('\n--------------- CLIENTES CADASTRADOS ---------------');
        clientes.forEach(linha => {
            const [id, nome, telefone] = linha.split(',');
            console.log(`ID: ${id}, Nome: ${nome}, Telefone: +55${telefone}`);
        });
        console.log('----------------------------------------------------\n');
        rl.question('\nDigite o ID do cliente para listar os pedidos: ', async (idCliente) => {
            const clienteLinha = clientes.find(linha => linha.startsWith(idCliente + ','));
            if (!clienteLinha) {
                console.log('Cliente não encontrado.');
                return mostrarMenuPed();
            }
            const nomeCliente = clienteLinha.split(',')[1];

            const pedidosData = await fs.readFile(ARQ.pedidos, 'utf-8');
            const produtosData = await fs.readFile(ARQ.produtos, 'utf-8');
            const pedidos = pedidosData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            const produtos = produtosData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');

            const pedidosCliente = pedidos.filter(linha => linha.split(',')[1] === idCliente);

            if (pedidosCliente.length === 0) {
                console.log(`\nO cliente "${nomeCliente}" ainda não fez nenhum pedido.`);
                mostrarMenuPed();
                return;
            }

            console.log(`\n-------------------------------------- PIZZARIA GIACOMMINI --------------------------------------\nPEDIDOS DE ${(nomeCliente).toUpperCase()}:\n `);
            pedidosCliente.forEach((linha, idx) => {
                const [data, , idproduto, custototal, formapagamento] = linha.split(',');
                const produtoLinha = produtos.find(l => l.startsWith(idproduto + ','));
                const nomeProduto = produtoLinha ? produtoLinha.split(',')[2] : 'Desconhecido';
                console.log(`${idx + 1}. Data: ${data} | Produto: ${nomeProduto} | Valor: R$${parseFloat(custototal).toFixed(2)} | Pagamento: ${formapagamento}`);
            });
            console.log('-------------------------------------------------------------------------------------------------\n');
            mostrarMenuPed();
        });
    } catch (err) {
        console.error('Erro ao ler os arquivos:', err);
        mostrarMenuPed();
    }
}

//COMPROVANTE DE COMPRA
async function gerarRecibo(
    data: string,
    cliente: Cliente,
    itens: { idproduto: number, valor: number }[],
    produtos: string[],
    total: number,
    formaPagamento: string
) {
    let produtosRecibo = '';
    itens.forEach((item, idx) => {
        const prodLinha = produtos.find(linha => linha.split(',')[0] === item.idproduto.toString());
        if (prodLinha) {
            const [, , nome, valor] = prodLinha.split(',');
            produtosRecibo += `${idx + 1}. ${nome} - R$${parseFloat(valor).toFixed(2)}\n`;
        }
    });

    const recibo =
`\n--------------- PIZZARIA GIACOMMINI ---------------  
Data: ${data}
Cliente: ${cliente.nome}
Telefone: +55${cliente.telefone}
Endereço: ${cliente.endereco}
Itens do pedido:
${produtosRecibo}
Total: R$${total.toFixed(2)}
Forma de pagamento: ${formaPagamento}
---------------------------------------------------\n`;
    console.log(recibo);

    const recibosDir = path.join(DIR.csv, 'recibos');
    await fs.mkdir(recibosDir, { recursive: true });
    const nomeArquivo = `recibo_${data.replace(/-/g, '')}_${cliente.id}_${Date.now()}.txt`;
    await fs.writeFile(path.join(recibosDir, nomeArquivo), recibo, 'utf8');
}

// RELATÓRIOS DE VENDAS
function menuRelatorios() {
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Relatório de Vendas Diário");
    console.log("2 - Relatório de Vendas Mensal");
    console.log("3 - Voltar");
    console.log("---------------------------------------------------\n");
    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case "1":
                relatorioVendasDiario();
                break;
            case "2":
                relatorioVendasMensal();
                break;
            case "3":
                mostrarMenuPed();
                break;
            default:
                console.log("Opção Inválida.");
                menuRelatorios();
        }});
}
function relatorioVendasMensal() {
    fs.readFile(ARQ.pedidos, 'utf-8')
        .then((data) => {
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            if (linhas.length === 0) {
                console.log('\nNão há pedidos registrados.');
                menuRelatorios();
                return;
            }
            const vendasPorMes: { [mes: string]: number } = {};
            linhas.forEach((linha) => {
                const [data, , , custototal] = linha.split(',');
                const mes = data.slice(0, 7);
                const valor = parseFloat(custototal);
                if (!vendasPorMes[mes]) {
                    vendasPorMes[mes] = 0;
                }
                vendasPorMes[mes] += valor;
            });
            console.log('\n--------------- PIZZARIA GIACOMMINI ---------------\nRelatório de Vendas Mensal:\n');
            for (const mes in vendasPorMes) {
                console.log(`${mes}: R$${vendasPorMes[mes].toFixed(2)}`);
            console.log("---------------------------------------------------");
            }
            menuRelatorios();
        }
        )
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            menuRelatorios();
        });
}
function relatorioVendasDiario() {
fs.readFile(ARQ.pedidos, 'utf-8')
    .then((data) => {
        const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
        if (linhas.length === 0) {
            console.log('\nNão há pedidos registrados.');
            menuRelatorios();
            return;
        }
        const vendasPorDia: { [dia: string]: number } = {};
        linhas.forEach((linha) => {
            const [data, , , custototal] = linha.split(',');
            const valor = parseFloat(custototal);
            if (!vendasPorDia[data]) {
                vendasPorDia[data] = 0;
            }
            vendasPorDia[data] += valor;
        });
        console.log('\n--------------- PIZZARIA GIACOMMINI ---------------\nRelatório de Vendas Diário:\n');
        for (const dia in vendasPorDia) {
            console.log(`${dia}: R$${vendasPorDia[dia].toFixed(2)}`);
            console.log("---------------------------------------------------");
        }
        menuRelatorios();
    })
    .catch((err) => {
        console.error('Erro ao ler o arquivo:', err);
        menuRelatorios();
    });
}

// EXTRAS
function menuExtras() {
    console.log("\n--------------- PIZZARIA GIACOMMINI ---------------");
    console.log("1 - Top 3 Produtos Mais Vendidos");
    console.log("2 - Top 3 Clientes que Mais Compraram");
    console.log("3 - Voltar");
    console.log("---------------------------------------------------\n");
    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case "1":
                maisVendidos();
                break;
            case "2":
                clienteFrequente();
                break;
            case "3":
                mostrarMenuPed();
                break;
            default:
                console.log("Opção Inválida.");
                menuExtras();
        }
    });
}
function maisVendidos() {
    fs.readFile(ARQ.pedidos, 'utf-8')
        .then(async (data) => {
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            if (linhas.length === 0) {
                console.log('\nNão há pedidos registrados.');
                menuExtras();
                return;
            }
            const vendasPorProduto: { [idproduto: string]: number } = {};
            linhas.forEach((linha) => {
                const [, , idproduto, custototal] = linha.split(',');
                const valor = parseFloat(custototal);
                if (!vendasPorProduto[idproduto]) {
                    vendasPorProduto[idproduto] = 0;
                }
                vendasPorProduto[idproduto] += valor;
            });
            const produtosOrdenados = Object.entries(vendasPorProduto)
                .sort(([, valorA], [, valorB]) => valorB - valorA)
                .slice(0, 3);

            const produtosData = await fs.readFile(ARQ.produtos, 'utf-8');
            const produtosLinhas = produtosData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');

            console.log('\n--------------- PIZZARIA GIACOMMINI ---------------\nTop 3 Produtos Mais Vendidos:\n');
            produtosOrdenados.forEach(([idproduto, total], index) => {
                const produtoLinha = produtosLinhas.find(linha => linha.startsWith(idproduto + ','));
                let nome = 'Desconhecido';
                if (produtoLinha) {
                    const [, , nomeProduto] = produtoLinha.split(',');
                    nome = nomeProduto;
                }
                console.log(`${index + 1}. ${nome} (ID: ${idproduto}) - Total Vendido: R$${total.toFixed(2)}`);
                });
            console.log("---------------------------------------------------\n");
            menuExtras();
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            menuExtras();
        });
}
function clienteFrequente() {
    fs.readFile(ARQ.pedidos, 'utf-8')
        .then(async (data) => {
            const linhas = data.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            if (linhas.length === 0) {
                console.log('Não há pedidos registrados.');
                menuExtras();
                return;
            }
            const gastoPorCliente: { [idcliente: string]: number } = {};
            linhas.forEach((linha) => {
                const [, idcliente, , custototal] = linha.split(',');
                const valor = parseFloat(custototal);
                if (!gastoPorCliente[idcliente]) {
                    gastoPorCliente[idcliente] = 0;
                }
                gastoPorCliente[idcliente] += valor;
            });
            const topClientes = Object.entries(gastoPorCliente)
                .sort(([, totalA], [, totalB]) => totalB - totalA)
                .slice(0, 3);
            const clientesData = await fs.readFile(ARQ.clientes, 'utf-8');
            const clientesLinhas = clientesData.trim().split('\n').slice(1).filter(linha => linha.trim() !== '');
            console.log('\n--------------- PIZZARIA GIACOMMINI ---------------\nTop 3 Clientes que mais compraram:\n');
            topClientes.forEach(([idcliente, totalGasto], idx) => {
                const clienteLinha = clientesLinhas.find(linha => linha.startsWith(idcliente + ','));
                let nome = 'Desconhecido';
                if (clienteLinha) {
                    const [, nomeCliente] = clienteLinha.split(',');
                    nome = nomeCliente;
                }
                console.log(`${idx + 1}. ${nome} (ID: ${idcliente}) - Total gasto: R$${totalGasto.toFixed(2)}`);
            });
            console.log("---------------------------------------------------\n");
            menuExtras();
        })
        .catch((err) => {
            console.error('Erro ao ler o arquivo:', err);
            menuExtras();
        });
}

// INICIALIZA O SISTEMA
mostrarMenu();