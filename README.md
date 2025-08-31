# 🚀 Make API — Front-end (Next.js) + API (NestJS)  

<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:10px 0 20px"> <img src="https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs&logoColor=white"> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61dafb"> <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/shadcn/ui-111827?style=for-the-badge"> <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"> <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"> <img src="https://img.shields.io/badge/Vercel-000?style=for-the-badge&logo=vercel&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> </div>

Make API é um CMS simples e direto para criar endpoints REST e gerenciar conteúdo de sites e apps.  
Este repositório descreve o front-end em Next.js que consome a API em NestJS.

---

## 💡 Ideia
Um **CMS leve para APIs**: você define coleções (ex.: `posts`, `produtos`, `faq`), cadastra itens e já tem **endpoints REST prontos** para usar em qualquer site/app. Sem dores de infra, com foco em velocidade.

## 🔎 O que ele é
- **Painel (Next.js):** interface para criar coleções e gerenciar itens.  
- **API (NestJS):** expõe os dados em **rotas REST**, com autenticação via **cookie httpOnly**.  
- Filosofia **plug-and-play**: do zero ao endpoint em poucos cliques.

## 🧭 Como usar
1. **Acesse o painel** e faça **login** (ou crie conta).  
2. **Crie uma coleção** (ex.: `posts`) definindo os campos que você precisa.  
3. **Cadastre itens** na coleção.  
4. **Consuma os dados** pela API:

**Exemplo leitura pública:**s
```bash
GET https://sua-api.com/posts
```

**Exemplo no front:**
```ts
const res = await fetch("https://sua-api.com/posts")
const posts = await res.json()
```

**Se for protegido:**
1) faça login (o cookie é salvo automaticamente):
```ts
await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email: "admin@makeapi.com", password: "admin123" }),
})
```
2) depois consuma normalmente (o navegador envia o cookie):
```ts
const res = await fetch("/api/me", { credentials: "include" })
const me = await res.json()
```