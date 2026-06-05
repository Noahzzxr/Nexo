# Nexo - Colegio Inteligente

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

## Admin Inicial

```txt
Email: admin@progresso.edu
Senha: Admin@2026!
```

Depois do primeiro login, use o painel admin para cadastrar alunos e professores.

## Fluxo De Contas

Alunos e professores nao possuem cadastro publico. O admin cria as contas dentro do sistema.

Ao criar um aluno, o sistema gera uma matricula unica e usa essa matricula como senha inicial. Ao criar um professor, o sistema gera uma senha inicial que deve ser compartilhada pelo admin.

## Scripts Uteis

```bash
npm run dev
npm run lint
npm run build
```
