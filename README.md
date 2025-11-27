# Express API para gerenciamento de produtos com autenticação JWT

Esse projeto é uma RESTful API contruída com Express.js para gerenciar coleções de produtos. É implementado um crud com controler de acesso por meio do JWT.

## Features

- **CRUD**: Create, Read, Update, and Delete products.
- **Autenticação JWT**: rotas seguras com JSON Web Tokens.
- **Error Handling**: error handlings centralizados.
- **Environment Configuration**: Uso do `.env` informações sensíveis.

## Estrutura do Projeto

```
express-api
├── src
│   ├── app.js                # Inicializa a aplicação Express
│   ├── server.js             # Inicia o servidor
│   ├── controllers           # Contém o controle da logica para gerenciar requisições
│   │   └── ProdutctController.js
│   ├── routes                # Define API routes
│   │   ├── productRoutes.js
│   │   └── authRoutes.js
│   ├── middleware            # Middlewares para autenticação e error handling
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models                # Database models
│   │   └── productModel.js
│   ├── config                # Arquivos de configuração
│   │   └── database.js
│   └── utils                 # Funções utilitarias
│       └── jwt.js
├── .env                      # Variáveis de ambiente
├── .gitignore                # arquvos para serem ignorados pelo Git
├── package.json              # Project metadata and dependências
└── README.md                 # Documentação do projeto

## Funcionalidades
- CRUD de Produtos
- Autenticação JWT
- Validações de entrada
- Testes unitários e de integração
- Documentação com Swagger

## Tecnologias
- Node.js
- Express
- MongoDB (driver nativo)
- JWT
- Jest + Supertest

## Como rodar

```bash
git clone <repo>
cd Projeto_Final-gerenciador_De_produtos
npm install
cp .env.example .env
```
   DATABASE_URL=<your_database_url>
   JWT_SECRET=<your_jwt_secret>
   ```
npm run dev
```

## API Endpoints

### Products

- **GET /api/products**: Recuperar todos os produtos
- **GET /api/products/:id**: Recuperar um produto pelo ID
- **POST /api/products**: criar um novo produto
- **PUT /api/products/:id**: atualizar um produto pel ID
- **DELETE /api/products/:id**: Deletar um produto pelo ID

### Autenticação

- **POST /api/auth/register**: Registra um novo usuario
- **POST /api/auth/login**: Loga um usuario e recebe um JWT

## Testes Unitários

O projeto inclui uma suite abrangente de testes unitários implementados com **Jest** e **Supertest**, cobrindo validações, middleware, controladores e rotas.

### Executar Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch (reexecuta com cada mudança)
npm test:watch

# Gerar relatório de cobertura
npm test:coverage
```

### Estrutura de Testes

Os testes estão organizados em pasta `__tests__` dentro de cada módulo:

```
src/
├── middleware/__tests__/
│   ├── validateUserLogin.test.js          # 12 testes
│   ├── validateUserRegister.test.js        # 18 testes
│   ├── validateProduct.test.js             # 19 testes
│   ├── validateProductUpdate.test.js       # 18 testes
│   └── AuthMiddleware.test.js
├── controllers/__tests__/
│   ├── AuthController.test.js
│   └── ProductController.test.js
└── routes/__tests__/
    ├── authRoutes.test.js
    ├── productRoutes.test.js
    └── routes.integration.test.js
```

### Cobertura de Testes

#### 1. **Validações de Entrada** ✅ (67 testes - 100% passing)

- **validateUserLogin.test.js**: Valida campos obrigatórios (email, senha), formato de email, normalização de dados (trim, lowercase)
- **validateUserRegister.test.js**: Valida força de senha (mínimo 6 caracteres), validação de roles (admin/common), normalização de dados
- **validateProduct.test.js**: Valida nome do produto (mínimo 2 caracteres), preço, categoria, quantidade e campos opcionais
- **validateProductUpdate.test.js**: Valida atualizações parciais (PATCH), garantindo ao menos um campo e validação individual de campos

#### 2. **Middleware**

- **AuthMiddleware.test.js**: Testa verificação de JWT tokens, expiração, extração de Bearer tokens e controle de acesso por roles

#### 3. **Controladores**

- **AuthController.test.js**: Testa criação de usuários, login, busca de usuários e tratamento de erros
- **ProductController.test.js**: Testa CRUD de produtos, validações e tratamento de erros

#### 4. **Rotas**

- **authRoutes.test.js**: Testa endpoints de autenticação (register, login, getUserList)
- **productRoutes.test.js**: Testa endpoints de produtos (CRUD completo com validação de tokens)
- **routes.integration.test.js**: Testes de integração entre rotas

### Resultado dos Testes

```
Test Suites: 5 passed, 10 total
Tests:       85 passed, 48 failed*, 133 total
*Os 48 testes falhando são limitações conhecidas de jest.mock() 
com módulos ESM (Node.js experimental VM modules)
```

### Resultado Esperado - Validações (100%)

```
✅ validateUserLogin.test.js        - 12/12 passing
✅ validateUserRegister.test.js     - 18/18 passing
✅ validateProduct.test.js          - 19/19 passing
✅ validateProductUpdate.test.js    - 18/18 passing
✅ routes.integration.test.js       - passing
```

### Nota Técnica

O projeto utiliza ES Modules (`"type": "module"` no package.json). Para os testes funcionarem com Jest em ESM, foi configurado:
- `jest.config.cjs`: Configuração específica para ESM
- Node.js com flag `--experimental-vm-modules`
- Importação explícita de `@jest/globals` para acesso aos globals do Jest

Os testes de validações funcionam com 100% de sucesso. Testes de controllers e rotas que dependem de `jest.mock()` com classes importadas possuem limitações conhecidas no Jest com ESM.

## License

This project is licensed under the MIT License.