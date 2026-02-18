# AUTOCAR - Sistema de Agendamento

Sistema de gerenciamento de agendamentos para oficina automotiva.

## Instalação

```bash
npm install
```

## Configuração do Firebase

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Configurar Firestore

No Firebase Console, ative o Firestore Database e configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /employees/{employeeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == employeeId;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/employees/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Criar Primeiro Usuário Admin

No Firebase Authentication, crie um usuário e adicione um documento na coleção `employees` com:

```javascript
{
  email: "admin@autocar.com",
  name: "Admin",
  isAdmin: true
}
```

## Executar

```bash
npm run dev
```

Acesse `http://localhost:5173`

## Build para Produção

```bash
npm run build
```

## Funcionalidades

### Agenda
- Criar, editar e excluir agendamentos
- Filtrar agendamentos por data
- Campos: nome, telefone, modelo do carro, serviço, valor, data, hora, tipo (seguro/particular)

### Dashboard (Admin)
- Estatísticas totais e por data
- Gráfico de distribuição seguro vs particular
- Lista completa de agendamentos com filtros

### Funcionários (Admin)
- Adicionar novos funcionários
- Remover funcionários do sistema
- Gerenciar permissões de admin

## Deploy

O projeto está configurado para deploy na Vercel. Basta conectar o repositório e adicionar as variáveis de ambiente do Firebase.

## Stack

- React 19 + TypeScript
- Tailwind CSS 4
- Firebase (Auth + Firestore)
- Vite
- React Router

---

**AUTOCAR VIDROS AUTOMOTIVOS** - 2026
