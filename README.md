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

## License

This project is licensed under the MIT License.