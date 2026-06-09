# Nexo

Sistema escolar web para centralizar rotina academica, dashboards, boletim, materiais, mensagens, calendario e gestao de usuarios.

O projeto usa React + Vite no frontend e Supabase para autenticacao, banco de dados, storage e regras de acesso.

## Principais Recursos

- Login por e-mail e senha com identificacao de perfil.
- Dashboards diferentes para admin, professor e aluno.
- Criacao de alunos e professores apenas pelo painel admin.
- Matricula automatica para alunos, usada como senha inicial.
- Senha inicial automatica para professores.
- Dados carregados do Supabase, sem mock data como conteudo real.
- Foto de perfil editavel e salva no banco.

## Como Rodar

```bash
cd my-app
npm install
npm run dev
```

Depois abra o endereco mostrado pelo Vite, normalmente:

```txt
http://localhost:5173
```

## Configuracao Do Supabase

As variaveis publicas do Supabase ficam em:

```txt
my-app/.env
```

Antes de testar login e dashboards, execute o schema atualizado no SQL Editor do Supabase:

```txt
my-app/supabase/school_schema.sql
```

Esse arquivo cria as tabelas, politicas RLS, funcoes RPC, bucket de anexos e a conta admin inicial.

## Convites Por E-mail

O painel admin cria alunos e professores por convite de e-mail usando a Edge Function:

```txt
my-app/supabase/functions/invite-school-user
```

Antes de usar o convite, configure as secrets no Supabase:

```bash
cd my-app
supabase secrets set SITE_URL=http://localhost:5173
```

Depois publique a function:

```bash
supabase functions deploy invite-school-user
```

A `SUPABASE_SERVICE_ROLE_KEY` nunca deve ir no React, no `.env` publico ou no GitHub.
Nas Edge Functions hospedadas, o Supabase ja injeta `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`; por isso esses nomes nao precisam ser definidos manualmente pela CLI.

Em `Authentication > URL Configuration`, adicione tambem:

```txt
http://localhost:5173/definir-senha
```

## Admin Inicial

```txt
Email: admin@nexo.edu
Senha: Admin@2026!
```

Depois do primeiro login, use o painel admin para cadastrar alunos e professores.

## Fluxo De Contas

Alunos e professores nao possuem cadastro publico. O admin cria as contas dentro do sistema.

Ao criar um aluno, o sistema gera uma matricula unica e envia o convite para o e-mail cadastrado. Professores tambem recebem o convite diretamente por e-mail.

## Scripts Uteis

```bash
npm run dev
npm run lint
npm run build
```
