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

- Email: `admin@nexo.edu`
- Senha: `Admin@2026!`

Use essa conta para convidar alunos e professores pelo painel admin. Alunos recebem uma matricula automaticamente, e alunos/professores recebem o convite no e-mail cadastrado.

## Convite por e-mail

O painel admin usa a Edge Function `invite-school-user` para enviar convite direto ao e-mail do aluno/professor.

Configure as secrets antes do deploy:

```bash
supabase secrets set SITE_URL=http://localhost:5173
```

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` sao secrets reservadas que o Supabase injeta automaticamente nas Edge Functions hospedadas.

Publique a function:

```bash
supabase functions deploy invite-school-user
```

A secret key deve ficar apenas no Supabase, nunca no frontend.

Em `Authentication > URL Configuration`, mantenha esta Redirect URL liberada:

```txt
http://localhost:5173/definir-senha
```
