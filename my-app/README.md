# Nexo App

Frontend React/Vite do sistema escolar Nexo, usando Supabase como banco e autenticação.

## Rodar localmente

```bash
npm install
npm run dev
```

As variaveis publicas do Supabase ficam em `.env` para que o projeto funcione para todo o grupo ao clonar o repositorio.

## Banco de dados

Aplique `supabase/school_schema.sql` no SQL Editor do Supabase antes de testar os fluxos. O arquivo cria:

- tabelas escolares;
- politicas RLS;
- funcao admin para criar contas;
- conta admin inicial.

## Login admin inicial

- Email: `admin@progresso.edu`
- Senha: `Admin@2026!`

Use essa conta para criar alunos e professores pelo painel admin. Alunos recebem matricula/senha inicial automaticamente, e professores recebem senha inicial gerada automaticamente.
