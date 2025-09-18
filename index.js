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
    produtos: 'id,nome,valor\n',
    clientes: 'id,nome,telefone,endereco\n',
    pedidos: 'data,idcliente,idproduto,custototal\n',
};
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
        var _a;
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
                    return [4 /*yield*/, fs_1.promises.writeFile(caminho, conteudo, 'utf8')];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function cadastrarCliente() {
    rl.question('Digite o nome do cliente: ', function (nome) {
        rl.question('Digite o telefone do cliente: ', function (telefone) {
            rl.question('Digite o endereço do cliente: ', function (endereco) {
                var novoCliente = { id: i++, nome: nome, telefone: telefone, endereco: endereco };
                fs_1.promises.appendFile(ARQ.clientes, "".concat(novoCliente.id, ",").concat(novoCliente.nome, ",").concat(novoCliente.telefone, ",").concat(novoCliente.endereco, "\n"), 'utf8')
                    .then(function () {
                    console.log('Cliente cadastrado com sucesso!');
                    rl.close();
                })
                    .catch(function (err) {
                    console.error('Erro ao cadastrar cliente:', err);
                    rl.close();
                });
            });
        });
    });
}
function cadastrarProdutos() {
    rl.question('Digite o nome do produto: ', function (nome) {
        rl.question('Digite o valor do produto: ', function (valor) {
            var novoProduto = { id: i++, nome: nome, valor: parseFloat(valor) };
            fs_1.promises.appendFile(ARQ.produtos, "".concat(novoProduto.id, ",").concat(novoProduto.nome, ",").concat(novoProduto.valor, "\n"), 'utf8')
                .then(function () {
                console.log('Produto cadastrado com sucesso!');
                rl.close();
            })
                .catch(function (err) {
                console.error('Erro ao cadastrar produto:', err);
                rl.close();
            });
        });
    });
}
function listarProdutos() {
    fs_1.promises.readFile(ARQ.produtos, 'utf-8')
        .then(function (data) {
        var linhas = data.trim().split('\n').slice(1); // Ignora o cabeçalho
        console.log('Produtos disponíveis:');
        linhas.forEach(function (linha) {
            var _a = linha.split(','), id = _a[0], nome = _a[1], valor = _a[2];
            console.log("ID: ".concat(id, ", Nome: ").concat(nome, ", Valor: R$").concat(valor));
        });
    })
        .catch(function (err) {
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
    rl.question("Escolha uma opção: ", function (opcao) {
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
    console.log("4 - Voltar ao Menu Principal");
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
    rl.question("Escolha uma opção: ", function (opcao) {
        switch (opcao) {
            case "1":
                fazerPedido();
                break;
            case "2":
                listarPedidos();
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
