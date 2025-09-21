"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
var readline = require("readline");
var process_1 = require("process");
var i = 1;
function inicializaIdProdutos() {
    return __awaiter(this, void 0, void 0, function () {
        var data, linhas, ids, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(ARQ.produtos, 'utf-8')];
                case 1:
                    data = _b.sent();
                    linhas = data.trim().split('\n').slice(1);
                    ids = linhas.map(function (linha) { return parseInt(linha.split(',')[0]); }).filter(Number.isFinite);
                    if (ids.length > 0) {
                        i = Math.max.apply(Math, ids) + 1;
                    }
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    i = 1;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function inicializaIdClientes() {
    return __awaiter(this, void 0, void 0, function () {
        var data, linhas, ids, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(ARQ.clientes, 'utf-8')];
                case 1:
                    data = _b.sent();
                    linhas = data.trim().split('\n').slice(1);
                    ids = linhas.map(function (linha) { return parseInt(linha.split(',')[0]); }).filter(Number.isFinite);
                    if (ids.length > 0) {
                        i = Math.max.apply(Math, ids) + 1;
                    }
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    i = 1;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
var ROOT = path.resolve('.');
var DIR = {
    ts: path.join(ROOT, 'ts'),
    js: path.join(ROOT, 'js'),
    csv: path.join(ROOT, 'csv'),
    json: path.join(ROOT, 'json'),
};
var ARQ = {
    produtos: path.join(DIR.csv, 'produtos.csv'), // Produtos disponíveis
    clientes: path.join(DIR.csv, 'clientes.csv'), // Clientes cadastrados
    pedidos: path.join(DIR.csv, 'pedidos.csv'), // Pedidos realizados
    vendas: path.join(DIR.csv, 'vendas.csv'), // Relatorio de vendas
};
var CAB = {
    produtos: 'id,nome,valor,tipo\n',
    clientes: 'id,nome,telefone,endereco\n',
    pedidos: 'data,idcliente,idproduto,custototal\n',
};
// CRIA OS ARQUIVOS .CSV
function preparaAmbiente() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.mkdir(DIR.csv, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.produtos, CAB.produtos)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.clientes, CAB.clientes)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.pedidos, CAB.pedidos)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.vendas, 'RESUMO DIÁRIO DE VENDAS DA PIZZARIA\n')];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function criaSeNaoExiste(caminho, conteudo) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cabecalho;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 4]);
                    return [4 /*yield*/, fs_1.promises.access(caminho)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2:
                    _a = _b.sent();
                    cabecalho = conteudo.endsWith('\n') ? conteudo : conteudo + '\n';
                    return [4 /*yield*/, fs_1.promises.writeFile(caminho, cabecalho, 'utf8')];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// MOSTRAR MENU PRINCIPAL
function mostrarMenu() {
    preparaAmbiente();
    console.log("\n-------- PIZZARIA GIACOMMINI --------");
    console.log("1 - Cadastros");
    console.log("2 - Pedidos");
    console.log("3 - Sair");
    console.log("-------------------------------------\n");
    rl.question("\nEscolha uma opção: ", function (opcao) {
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
    rl.question("Escolha uma opção: ", function (opcao) {
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
function cadastrarCliente() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inicializaIdClientes()];
                case 1:
                    _a.sent();
                    rl.question('Digite o nome do cliente: ', function (nome) {
                        rl.question('Digite o telefone do cliente (11 Dígitos): ', function perguntarTelefone(telefone) {
                            // Remove espaços e verifica se é numérico e tem 11 caracteres
                            if (!/^\d{11}$/.test(telefone)) {
                                console.log('Digite um telefone válido.');
                                rl.question('Digite o telefone do cliente (11 Dígitos): ', perguntarTelefone);
                                return;
                            }
                            rl.question('Digite o endereço do cliente: ', function (endereco) {
                                var novoCliente = { id: i++, nome: nome, telefone: telefone, endereco: endereco };
                                fs_1.promises.appendFile(ARQ.clientes, "".concat(novoCliente.id, ",").concat(novoCliente.nome, ",").concat(novoCliente.telefone, ",").concat(novoCliente.endereco, "\n"), 'utf8')
                                    .then(function () {
                                    console.log('Cliente cadastrado com sucesso!');
                                    voltarMenuCadClientes();
                                })
                                    .catch(function (err) {
                                    console.error('Erro ao cadastrar cliente:', err);
                                    voltarMenuCadClientes();
                                });
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function listarClientes() {
    fs_1.promises.readFile(ARQ.clientes, 'utf-8')
        .then(function (data) {
        var linhas = data.trim().split('\n').slice(1); // Ignora o cabeçalho
        if (linhas.length === 0) {
            console.log('Não há clientes cadastrados.');
            voltarMenuCadClientes();
            return;
        }
        console.log('Clientes cadastrados:');
        linhas.forEach(function (linha) {
            var _a = linha.split(','), id = _a[0], nome = _a[1], telefone = _a[2], endereco = _a[3];
            console.log("ID: ".concat(id, ", Nome: ").concat(nome, ", Telefone: +55").concat(telefone, ", Endere\u00E7o: ").concat(endereco));
        });
        alteracaoClientes();
    })
        .catch(function (err) {
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
    rl.question("Digite a opção desejada: ", function (opcao) {
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
    rl.question("Escolha uma opção: ", function (opcao) {
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
    fs_1.promises.readFile(ARQ.clientes, 'utf-8')
        .then(function (data) {
        var linhas = data.trim().split('\n').slice(1);
        console.log('Clientes cadastrados:');
        linhas.forEach(function (linha) {
            var _a = linha.split(','), id = _a[0], nome = _a[1], telefone = _a[2], endereco = _a[3];
            console.log("ID: ".concat(id, ", Nome: ").concat(nome, ", Telefone: +55").concat(telefone, ", Endere\u00E7o: ").concat(endereco));
        });
        rl.question('Digite o ID do cliente que deseja excluir: ', function (id) {
            var cliente = linhas.find(function (linha) { return linha.startsWith(id + ','); });
            if (cliente) {
                var novasLinhas = linhas.filter(function (linha) { return !linha.startsWith(id + ','); });
                fs_1.promises.writeFile(ARQ.clientes, CAB.clientes + novasLinhas.join('\n') + '\n', 'utf-8')
                    .then(function () {
                    console.log('Cliente excluído com sucesso!');
                    alteracaoClientes();
                })
                    .catch(function (err) {
                    console.error('Erro ao excluir cliente:', err);
                    alteracaoClientes();
                });
            }
            else {
                console.log('Cliente não encontrado.');
                alteracaoClientes();
            }
        });
    })
        .catch(function (err) {
        console.error('Erro ao ler o arquivo:', err);
        alteracaoClientes();
    });
}
function atualizarCliente() {
    fs_1.promises.readFile(ARQ.clientes, 'utf-8')
        .then(function (data) {
        var linhas = data.trim().split('\n').slice(1);
        console.log('Clientes cadastrados:');
        linhas.forEach(function (linha) {
            var _a = linha.split(','), id = _a[0], nome = _a[1], telefone = _a[2], endereco = _a[3];
            console.log("ID: ".concat(id, ", Nome: ").concat(nome, ", Telefone: +55").concat(telefone, ", Endere\u00E7o: ").concat(endereco));
        });
        rl.question('Digite o ID do cliente que deseja atualizar: ', function (id) {
            var cliente = linhas.find(function (linha) { return linha.startsWith(id + ','); });
            if (cliente) {
                var _a = cliente.split(','), _ = _a[0], nomeAtual_1 = _a[1], telefoneAtual_1 = _a[2], enderecoAtual_1 = _a[3];
                rl.question("Digite o novo nome do cliente (atual: ".concat(nomeAtual_1, "): "), function (novoNome) {
                    rl.question("Digite o novo telefone do cliente (atual: ".concat(telefoneAtual_1, "): "), function (novoTelefone) {
                        rl.question("Digite o novo endere\u00E7o do cliente (atual: ".concat(enderecoAtual_1, "): "), function (novoEndereco) {
                            var atualizado = "".concat(id, ",").concat(novoNome || nomeAtual_1, ",").concat(novoTelefone || telefoneAtual_1, ",").concat(novoEndereco || enderecoAtual_1);
                            var novasLinhas = linhas.map(function (linha) { return linha.startsWith(id + ',') ? atualizado : linha; });
                            fs_1.promises.writeFile(ARQ.clientes, CAB.clientes + novasLinhas.join('\n') + '\n', 'utf-8')
                                .then(function () {
                                console.log('Cliente atualizado com sucesso!');
                                alteracaoClientes();
                            })
                                .catch(function (err) {
                                console.error('Erro ao atualizar cliente:', err);
                                alteracaoClientes();
                            });
                        });
                    });
                });
            }
            else {
                console.log('Cliente não encontrado.');
                alteracaoClientes();
            }
        });
    })
        .catch(function (err) {
        console.error('Erro ao ler o arquivo:', err);
        alteracaoClientes();
    });
}
// FUNÇÕES REFERENTES AO CADASTRO DE PRODUTOS
function cadastrarProdutos() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inicializaIdProdutos()];
                case 1:
                    _a.sent();
                    rl.question('Digite o tipo do produto (pizza, bebida, sobremesa): ', function (tipo) {
                        var tipoValido = ['pizza', 'bebida', 'sobremesa'].includes(tipo.toLowerCase());
                        if (!tipoValido) {
                            console.log('Tipo inválido. Digite pizza, bebida ou sobremesa.');
                            return cadastrarProdutos();
                        }
                        rl.question('Digite o nome do produto: ', function (nome) {
                            rl.question('Digite o valor do produto: ', function (valor) {
                                var novoProduto = { id: i++, nome: nome, valor: parseFloat(valor), tipo: tipo.toLowerCase() };
                                fs_1.promises.appendFile(ARQ.produtos, "".concat(novoProduto.id, ",").concat(novoProduto.nome, ",").concat(novoProduto.valor, ",").concat(novoProduto.tipo, "\n"), 'utf8')
                                    .then(function () {
                                    console.log('Produto cadastrado com sucesso!');
                                    voltarMenuCadProdutos();
                                })
                                    .catch(function (err) {
                                    console.error('Erro ao cadastrar produto:', err);
                                    voltarMenuCadProdutos();
                                });
                            });
                        });
                    });
                    return [2 /*return*/];
            }
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
    rl.question("Digite a opção desejada: ", function (opcao) {
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
function listarProdutosPorTipo(tipo) {
    fs_1.promises.readFile(ARQ.produtos, 'utf-8')
        .then(function (data) {
        var linhas = data.trim().split('\n').slice(1); // Ignora o cabeçalho
        var filtrados = linhas.filter(function (linha) { return linha.split(',')[3] === tipo; });
        if (filtrados.length === 0) {
            console.log("N\u00E3o h\u00E1 produtos do tipo ".concat(tipo, " cadastrados."));
            voltarMenuCadProdutos();
            return;
        }
        console.log("Produtos do tipo ".concat(tipo, ":"));
        filtrados.forEach(function (linha) {
            var _a = linha.split(','), id = _a[0], nome = _a[1], valor = _a[2];
            console.log("ID: ".concat(id, ", Nome: ").concat(nome, ", Valor: R$").concat(valor));
        });
        alteracaoProdutos();
    })
        .catch(function (err) {
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
    rl.question("Digite a opção desejada: ", function (opcao) {
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
    rl.question("Escolha uma opção: ", function (opcao) {
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
    fs_1.promises.readFile(ARQ.produtos, 'utf-8')
        .then(function (data) {
        var linhas = data.trim().split('\n').slice(1);
        console.log('Produtos disponíveis:');
        linhas.forEach(function (linha) {
            var _a = linha.split(','), id = _a[0], nome = _a[1], valor = _a[2];
            console.log("ID: ".concat(id, ", Nome: ").concat(nome, ", Valor: R$").concat(valor));
        });
        rl.question('Digite o ID do produto que deseja excluir: ', function (id) {
            var produto = linhas.find(function (linha) { return linha.startsWith(id + ','); });
            if (produto) {
                var novasLinhas = linhas.filter(function (linha) { return !linha.startsWith(id + ','); });
                fs_1.promises.writeFile(ARQ.produtos, CAB.produtos + novasLinhas.join('\n') + (novasLinhas.length ? '\n' : ''), 'utf-8')
                    .then(function () {
                    console.log('Produto excluído com sucesso!');
                    alteracaoProdutos();
                })
                    .catch(function (err) {
                    console.error('Erro ao excluir produto:', err);
                    alteracaoProdutos();
                });
            }
            else {
                console.log('Produto não encontrado.');
                alteracaoProdutos();
            }
        });
    })
        .catch(function (err) {
        console.error('Erro ao ler o arquivo:', err);
        alteracaoProdutos();
    });
}
function atualizarProduto() {
    fs_1.promises.readFile(ARQ.produtos, 'utf-8')
        .then(function (data) {
        var linhas = data.trim().split('\n').slice(1);
        console.log('Produtos disponíveis:');
        linhas.forEach(function (linha) {
            var _a = linha.split(','), id = _a[0], nome = _a[1], valor = _a[2], tipo = _a[3];
            console.log("ID: ".concat(id, ", Nome: ").concat(nome, ", Valor: R$").concat(valor, ", Tipo: ").concat(tipo));
        });
        rl.question('Digite o ID do produto que deseja atualizar: ', function (id) {
            var produto = linhas.find(function (linha) { return linha.startsWith(id + ','); });
            if (produto) {
                var _a = produto.split(','), _ = _a[0], nomeAtual_2 = _a[1], valorAtual_1 = _a[2], tipoAtual_1 = _a[3];
                rl.question("Digite o novo nome do produto (atual: ".concat(nomeAtual_2, "): "), function (novoNome) {
                    rl.question("Digite o novo valor do produto (atual: R$".concat(valorAtual_1, "): "), function (novoValor) {
                        rl.question("Digite o novo tipo do produto (atual: ".concat(tipoAtual_1, "): "), function (novoTipo) {
                            var tipoValido = novoTipo ? ['pizza', 'bebida', 'sobremesa'].includes(novoTipo.toLowerCase()) : true;
                            if (!tipoValido) {
                                console.log('Tipo inválido. Digite Pizza, Bebida ou Sobremesa.');
                                return atualizarProduto();
                            }
                            var atualizado = "".concat(id, ",").concat(novoNome || nomeAtual_2, ",").concat(novoValor || valorAtual_1, ",").concat(novoTipo ? novoTipo.toLowerCase() : tipoAtual_1);
                            var novasLinhas = linhas.map(function (linha) { return linha.startsWith(id + ',') ? atualizado : linha; });
                            fs_1.promises.writeFile(ARQ.produtos, CAB.produtos + novasLinhas.join('\n') + '\n', 'utf-8')
                                .then(function () {
                                console.log('Produto atualizado com sucesso!');
                                alteracaoProdutos();
                            })
                                .catch(function (err) {
                                console.error('Erro ao atualizar produto:', err);
                                alteracaoProdutos();
                            });
                        });
                    });
                });
            }
            else {
                console.log('Produto não encontrado.');
                alteracaoProdutos();
            }
        });
    })
        .catch(function (err) {
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
    rl.question("\nEscolha uma opção: ", function (opcao) {
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
    rl.question("Digite a opção desejada: ", function (opcao) {
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
