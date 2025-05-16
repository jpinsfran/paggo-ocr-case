## Iniciando

Você pode rodar o site diretamente do link: https://paggo-ocr-case-tau.vercel.app/
Utilizei Vercel para hospedar o Frontend e Railway para hospedar o Backend

# Paggo OCR Case

Projeto fullstack para upload de documentos, extração de texto com OCR, explicação automatizada via IA (OpenAI) e chat interativo. O sistema conta com autenticação de usuários, dashboard pessoal e download de resultados processados.

## Requisitos

Antes de iniciar, é necessário ter instalado e configurado:

- Node.js (versão 18 ou superior)
- PostgreSQL rodando localmente (porta 5432)
- Conta e chave de API da OpenAI
- Git
- npm (ou yarn)

## Clonando o projeto

```bash
git clone https://github.com/seu-usuario/paggo-ocr-case.git
cd paggo-ocr-case
```

Configure as variáveis de ambiente criando o arquivo backend/.env(Ele já estará com a minha key) com o conteúdo:
```bash
DATABASE_URL=postgresql://username:senha@localhost:5432/paggo_ocr
JWT_SECRET=sua-chave-secreta
OPENAI_API_KEY=sua-chave-da-openai
```
Substitua username do db,senha, JWT_SECRET e OPENAI_API_KEY pelos seus próprios valores.
OBS IMPORTANTE: a versão da OpenIa usado no programa é a gpt-4o-mini se a sua for diferente edite o arquivo backend/src/documents/llm.services.ts na linha 12 para o modelo do seu chatGPT
ou crie a sua propria(recomendado) em https://platform.openai.com/api-keys


Crie também o arquivo frontend/.env.local como no exemplo a seguir com:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

OBS: Abra dois terminais uma para o back e um para o front e execute o Backend antes
## BACKEND

Para executar o projeto localmente, no backend execute:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```
O backend ficará disponível em http://localhost:3000.

## Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse o frontend em http://localhost:3001 (ou na porta exibida no terminal)

Edições das paginas são feitas em  `pages/index.tsx` e `pages/dashboard.tsx`.

## Desenvolvido por @jpinsfran