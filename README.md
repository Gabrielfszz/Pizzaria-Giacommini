# Sistema de Pizzaria (TypeScript + Node.js)

App para gerenciar uma Pizzaria, contendo **Cadastros de Clientes/Produtos**, **Emissão de Recibos** e **Relatórios de Vendas**.  
Desenvolvido pelo grupo:  
Gabriel Filipe dos Santos RA: 2517645  
Italo Guilherme Pinheiro Rodrigues RA: 2526314  
Pedro Henrique Assis de Oliveira RA: 2508585  
Matheus Gomes Nagy RA: 2508094   
Joaquim da Silva dos Santos RA:2502410

## ✨ Recursos

* **Cadastro de Clientes**: nome, telefone, endereco.
* **Cadastro de Produtos**: tipo, nome, valor.
* **Armazenamento**: `csv/clientes.csv`, `csv/pedidos.csv`, `csv/produtos.csv`.
* **Listar Produtos**: lista os produtos cadastrados por tipo (pizza, bebida ou sobremesa).
* **Listar Clientes**: lista os clientes cadastrados.
* **Fazer Pedido**: escolhe um produto ou mais para determinado cliente, seleciona a forma de pagamento e gera o recibo.
* **Listar Pedidos**: lista os pedidos de um determinado cliente.
* **Relatórios**: gera relatórios de vendas diários ou mensal.
* **Extras**: produtos mais vendidos, clientes que mais compraram e total de vendas por forma de pagamento.
* **Criação automática** de pastas e arquivos na primeira execução.

---

## 📁 Estrutura de pastas

```
Pizzaria Giacommini/
├─ csv/               # base de dados em CSV
    └─ recibos/       # recibos em arquivos.txt (gerados após os pedidos)
├─ js/                # arquivos .js gerados pelo TypeScript
├─ node_modules/      # módulos instalados com o comando npm i -D typescript ts-node @types/node && npm i -D @types/readline-sync
├─ ts/                # código-fonte .ts (ex.: ts/index.ts)
├─ .gitignore         # arquivo .gitignore
├─ package.json      
├─ package-lock.json  
├─ pizza.ico          # ícone de pizza (para o atalho criado após executar o .bat)
├─ README.md          # arquivo README
├─ setup-pizzaria.bat # arquivo .bat para configuração automática do sistema
└─ tsconfig.json      
```

### Arquivos gerados

* `csv/clientes.csv`  → `id,nome,telefone,endereco`
* `csv/pedidos.csv`    → `data,idcliente,idproduto,custototal,formapagamento`
* `csv/produtos.csv`    → `id,tipo,nome,valor`
* `csv/recibos/`    → `aqui serão gerados os recibos.txt`
---

## 🔧 Pré-requisitos

* **Node.js 16+** (recomendado 18 ou 20)
* **npm**

---

## 🚀 Instalação

**Temos duas opções para instalação do sistema:**

**Opção 1 - Baixe e execute o arquivo .bat**    
Automaticamente ele clonará o repositório para uma nova pasta chamada "Pizzaria-Giacommini", criará um atalho com o ícone da Pizzaria e executará o programa.

**Opção 2 - Configure manualmente conforme abaixo:**  

Abra o git bash e execute os seguintes comandos:

1. Para ir à sua Área de Trabalho:
```bash
cd Desktop/
```
2. Para clonar o repositório:
```bash
git clone https://github.com/Gabrielfszz/Pizzaria-Giacommini/
```
3. Para ir à pasta do repositório clonado:
```bash
cd Pizzaria-Giacommini/
```
4. Para instalar os módulos do node:
```bash
npm i -D typescript ts-node @types/node && npm i -D @types/readline-sync
```

> No VS Code, se aparecerem erros de tipos do Node, use **Ctrl+Shift+P → TypeScript: Restart TS Server**.

---

## ▶️ Como executar  

1 - **Modo desenvolvimento (executa direto o TypeScript):**

```bash
npm run dev
```

2 - **Transpilar e rodar o JS gerado:**

```bash
npm run build && npm start
```

---

## 🖥️ Como usar o sistema  

 **Menu Principal**  
1. **Cadastros** → abre o menu de Cadastros.  
2. **Pedidos** → abre o menu de Pedidos.  
3. **Sair** → encerra o sistema.  

 **Menu Cadastros**    
1. **Cadastrar Cliente** → informe **nome**, **telefone** e **endereco**. O sistema grava em `clientes.csv`.
2. **Cadastrar Produto** → informe o **tipo (pizza | bebida | sobremesa)**, **nome** e **valor**. O sistema grava em `produtos.csv`.
3. **Listar Produtos** → selecione o **tipo** que quer visualizar, o sistema busca em `produtos.csv` e retorna com os produtos cadastrados do tipo escolhido.
4. **Listar Clientes** → o sistema busca em `clientes.csv` e retorna com os clientes cadastrados.
5. **Voltar ao Menu Principal** → volta ao menu principal.

 **Menu Pedidos**
1. **Fazer Pedido** → informe o **ID Cliente**, selecione o **Tipo** e os **Produtos**, selecione a **Forma de Pagamento**. Automáticamente gera o **Recibo** e grava em `csv/recibos/`
2. **Listar Pedidos** → informe o **ID Cliente**, o sistema busca em `pedidos.csv` e retorna com os pedidos desse determinado cliente.
3. **Relatórios** → selecione entre **Relatório de Vendas Diário** e **Relatório de Vendas Mensal**. O sistema busca em `pedidos.csv` e retorna com o total vendido no dia ou no mês.
4. **Extras** → selecione entre **Top 3 Produtos Mais Vendidos**, **Top 3 Clientes que Mais Compraram** e **Vendas por Forma de Pagamento**.
O sistema busca em `pedidos.csv`e retorna com o top 3 produtos mais vendidos, top 3 clientes que mais compraram ou o total de vendas por forma de pagamento.
6. **Voltar ao Menu Principal** → volta ao menu principal.

---

## 🧹 Limpeza / Reset

Para reiniciar os dados, apague os CSVs dentro de `csv/` (eles serão recriados com cabeçalho na próxima execução):

```bash
rm -f csv/*.csv 
```

*(No Windows, apague manualmente ou use `del` no PowerShell.)*

---


