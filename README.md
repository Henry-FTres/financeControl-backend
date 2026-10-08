# financeControl - API

API REST para controle de finanças pessoais, desenvolvida na disciplina de Programação Web e Mobile (UPF). É a versão web do projeto [financeControl em C++](https://github.com/Henry-FTres/financeControl).

Permite cadastrar usuários (pessoa física ou jurídica), contas bancárias, movimentações de entrada e saída com atualização automática do saldo, categorias e metas financeiras.

## Tecnologias

- **NestJS 11** (Node.js 24)
- **Prisma 7** com **SQLite**
- **JWT** para autenticação e **bcrypt** para senhas
- **class-validator** para validação dos dados

## Como rodar

```bash
# 1. instalar as dependências
npm install

# 2. criar o arquivo de variáveis de ambiente a partir do exemplo
copy .env.example .env
```

No `.env`, troque o `JWT_SECRET` por uma frase aleatória. Para gerar uma:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# 3. criar o banco e as tabelas (já inclui as categorias padrão)
npx prisma migrate dev
npx prisma generate

# 4. iniciar a API em modo de desenvolvimento
npm run start:dev
```

A API fica disponível em `http://localhost:3000/api`.

## Autenticação

As rotas de **login** e **cadastro** são públicas. Todas as outras exigem o token recebido no login, enviado no cabeçalho:

```
Authorization: Bearer <token>
```

Cada usuário só acessa os próprios dados: o dono de cada registro é identificado pelo token, nunca por um campo enviado na requisição.

## Rotas

| Recurso | Método | Rota | Descrição |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | Cadastro (PF ou PJ) |
| Auth | POST | `/api/auth/login` | Login, retorna o token |
| Usuário | GET | `/api/users/me` | Meus dados |
| Usuário | PUT | `/api/users/me` | Atualizar meus dados |
| Usuário | PUT | `/api/users/me/password` | Trocar senha |
| Usuário | DELETE | `/api/users/me` | Apagar minha conta |
| Contas | POST | `/api/accounts` | Criar conta |
| Contas | GET | `/api/accounts` | Listar minhas contas |
| Contas | GET | `/api/accounts/:id` | Buscar uma conta |
| Contas | PATCH | `/api/accounts/:id` | Editar conta (o saldo não é editável) |
| Contas | DELETE | `/api/accounts/:id` | Apagar conta |
| Transações | POST | `/api/transactions` | Criar movimentação e atualizar o saldo |
| Transações | GET | `/api/transactions?accountId=` | Listar (filtro por conta opcional) |
| Transações | GET | `/api/transactions/:id` | Buscar uma movimentação |
| Transações | PATCH | `/api/transactions/:id` | Editar e corrigir o saldo |
| Transações | DELETE | `/api/transactions/:id` | Apagar e desfazer o efeito no saldo |
| Categorias | GET | `/api/categories` | Listar categorias padrão e minhas |
| Categorias | POST | `/api/categories` | Criar categoria |
| Categorias | PUT | `/api/categories/:id` | Editar categoria própria |
| Categorias | DELETE | `/api/categories/:id` | Apagar categoria própria |
| Metas | GET | `/api/goals` | Listar metas (com indicação de atingida) |
| Metas | POST | `/api/goals` | Criar meta |
| Metas | PUT | `/api/goals/:id` | Editar meta |
| Metas | DELETE | `/api/goals/:id` | Apagar meta |

## Regras de negócio

- O usuário é **pessoa física** (exige CPF e data de nascimento) ou **jurídica** (exige CNPJ e razão social).
- O **saldo** da conta só é alterado pelas movimentações. Criar, editar ou apagar uma movimentação atualiza o saldo na mesma transação de banco: ou as duas operações acontecem, ou nenhuma.
- O valor das movimentações é sempre positivo; o tipo (`ENTRADA` ou `SAIDA`) define se soma ou subtrai.
- Não pode haver duas contas com o mesmo número na mesma instituição.
- Categorias padrão são compartilhadas e não podem ser alteradas; as criadas pelo usuário são só dele.
- Metas não podem ter prazo no passado.

## Testes

A pasta `http/` tem arquivos com todas as requisições e os resultados esperados, para usar com a extensão **REST Client** do VS Code.

## Autores

- Manuela Larissa Stivanin
- Henry