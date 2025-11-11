# Workout Tracker - Setup Guide

Este é um aplicativo de treino pessoal offline-first desenvolvido com React, TypeScript, Firebase e Tailwind CSS.

## 🚀 Funcionalidades

- ✅ **Treinos Completos**: 6 dias de treino (Push/Pull/Legs) com exercícios, séries e descansos
- ✅ **Offline-First**: Funciona completamente offline com sincronização automática
- ✅ **Timer com Som**: Alerta sonoro e vibração ao fim do descanso
- ✅ **Persistência Local**: Salva o treino ativo mesmo se fechar o app
- ✅ **Histórico**: Registra todos os treinos completados
- ✅ **Gráficos de Progresso**: Visualize sua evolução com Recharts
- ✅ **Design Moderno**: Interface premium otimizada para Galaxy S24 Ultra
- ✅ **PWA Ready**: Pode ser instalado como app no celular

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase (gratuita)

## 🔧 Configuração do Firebase

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto (ex: "workout-tracker")
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Modo de produção" (vamos configurar as regras depois)
4. Escolha a localização mais próxima
5. Clique em "Ativar"

### 3. Configurar Regras de Segurança

No Firestore, vá em "Regras" e cole o seguinte:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

Clique em "Publicar".

### 4. Habilitar Autenticação Anônima

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Na aba "Método de login", clique em "Anônimo"
4. Ative o toggle e clique em "Salvar"

### 5. Obter Credenciais do Firebase

1. No menu lateral, clique no ícone de engrenagem ⚙️ > "Configurações do projeto"
2. Role para baixo até "Seus aplicativos"
3. Clique no ícone da web `</>`
4. Dê um nome ao app (ex: "workout-web")
5. Copie o objeto `firebaseConfig`

### 6. Configurar o App

Abra o arquivo `src/lib/firebase.ts` e substitua as credenciais:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
\`\`\`

## 🏃 Executar o Projeto

\`\`\`bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
\`\`\`

## 📱 Como Usar

### Dashboard
- Visualize o treino sugerido do dia
- Veja suas estatísticas semanais
- Acesse qualquer treino da rotina

### Durante o Treino
- Preencha o peso e repetições de cada série
- Timer automático de descanso com som e vibração
- Use "REPETIR 1ª SÉRIE" para copiar peso/reps
- Adicione treino de abdômen (Core) no final
- Estado do treino é salvo automaticamente

### Offline
- App funciona 100% offline
- Treinos são salvos localmente
- Sincronização automática ao voltar online
- Indicador mostra quantos treinos estão pendentes

### Histórico
- Veja todos os treinos completados
- Data, duração e exercícios realizados

### Progresso
- Gráficos de evolução de carga
- Acompanhe principais exercícios
- Visualize tendências de progresso

## 🎨 Personalização

### Cores dos Treinos
Edite `src/index.css` nas variáveis CSS:

\`\`\`css
--workout-push1-from: 258 78% 52%;
--workout-push1-to: 251 65% 70%;
\`\`\`

### Adicionar/Modificar Exercícios
Edite `src/lib/workoutData.ts`:

\`\`\`typescript
{ 
  id: 'novo_exercicio', 
  name: 'Nome do Exercício', 
  sets: 4, 
  reps: '8-12', 
  rest: 90, 
  notes: 'Notas técnicas' 
}
\`\`\`

## 🔒 Segurança

- Autenticação anônima (sem login necessário)
- Dados isolados por usuário no Firestore
- Regras de segurança configuradas
- Dados persistem no dispositivo offline

## 📦 Tecnologias Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápida
- **Tailwind CSS** - Estilização
- **Firebase** - Backend e autenticação
- **Firestore** - Banco de dados
- **localforage** - Storage offline
- **Recharts** - Gráficos de progresso
- **Web Audio API** - Som do timer
- **Lucide React** - Ícones

## 🐛 Troubleshooting

### App não sincroniza
- Verifique se as regras do Firestore estão corretas
- Confirme que a autenticação anônima está ativa
- Verifique o console do navegador para erros

### Som não toca
- Alguns navegadores bloqueiam áudio automático
- O usuário precisa interagir com a página primeiro
- Teste em modo standalone (PWA instalado)

### Dados não salvam offline
- Verifique se o IndexedDB está habilitado no navegador
- Limpe o cache e tente novamente

## 📝 License

Este é um projeto pessoal para uso próprio.
