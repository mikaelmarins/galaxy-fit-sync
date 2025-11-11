# Workout Tracker - Treino Pessoal 💪

Um aplicativo moderno de treino pessoal com sincronização offline, desenvolvido especialmente para uso no Galaxy S24 Ultra.

## ✨ Características

### 🏋️ Treinos Completos
- **6 dias de treino** (Segunda a Sábado)
- Push 1 & 2 (Peito, Ombros, Tríceps)
- Pull 1 & 2 (Costas, Bíceps)
- Legs 1 & 2 (Quadríceps, Posteriores, Panturrilha)
- Rotina de Core/Abdômen opcional

### 📱 Offline-First
- **100% funcional offline**
- Fila de sincronização automática
- Persistência local com localforage
- Indicador visual de status de sincronização

### ⏱️ Timer Inteligente
- Timer automático de descanso
- **Som de alerta ao fim do descanso**
- **Vibração do dispositivo**
- Opção de adicionar +15s
- Exibição visual com progresso circular

### 💾 Persistência Automática
- Salva estado do treino ativo
- Recupera treino se fechar o app
- Histórico completo de treinos
- Dados armazenados localmente e na nuvem

### 📊 Progresso Visual
- Gráficos de evolução de carga (Recharts)
- Acompanhamento de exercícios principais
- Estatísticas semanais
- Contador de treinos totais

### 🎨 Design Premium
- Interface moderna e fluida
- Otimizado para Galaxy S24 Ultra
- Animações suaves
- Dark mode ready
- Gradientes personalizados por treino

## 🚀 Começando

### 1. Configure o Firebase
Siga o guia completo em **[SETUP.md](./SETUP.md)** para configurar sua conta Firebase.

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure suas credenciais
Edite `src/lib/firebase.ts` com suas credenciais do Firebase.

### 4. Execute o projeto
```bash
npm run dev
```

## 📖 Como Usar

1. **Dashboard**: Veja o treino sugerido do dia e suas estatísticas
2. **Iniciar Treino**: Clique no card do treino para começar
3. **Durante o Treino**:
   - Preencha peso e repetições para cada série
   - Timer de descanso inicia automaticamente
   - Use "REPETIR 1ª SÉRIE" para copiar dados
   - Adicione core/abdômen no final (opcional)
4. **Finalizar**: Clique em "FINALIZAR TREINO" quando terminar
5. **Offline**: Treino é salvo localmente e sincronizado quando online

## 🛠️ Tecnologias

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (design system)
- Firebase (Firestore + Auth)
- localforage (offline storage)
- Recharts (gráficos)
- Web Audio API (som)
- Lucide React (ícones)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ActiveWorkout.tsx   # Tela de treino ativo
│   ├── Dashboard.tsx       # Dashboard principal
│   ├── ProgressView.tsx    # Gráficos de progresso
│   ├── HistoryView.tsx     # Histórico de treinos
│   ├── OfflineIndicator.tsx # Indicador offline
│   └── NavBar.tsx          # Barra de navegação
├── lib/
│   ├── firebase.ts         # Configuração Firebase
│   ├── offlineQueue.ts     # Fila de sincronização
│   ├── workoutData.ts      # Dados dos treinos
│   └── utils/              # Utilitários
├── hooks/
│   ├── useBeep.ts          # Hook de som/vibração
│   └── useWorkoutPersist.ts # Persistência do treino
└── pages/
    └── Index.tsx           # Página principal

```

## 🔧 Personalização

### Modificar Exercícios
Edite `src/lib/workoutData.ts`

### Alterar Cores
Edite `src/index.css` (variáveis CSS)

### Ajustar Timer
Modifique os valores de `rest` em cada exercício

## 📝 Roadmap Futuro

- [ ] Adicionar gráficos de volume total
- [ ] Sistema de PRs (Personal Records)
- [ ] Notas por treino
- [ ] Exportar dados para CSV
- [ ] Notificações de treino
- [ ] Modo escuro/claro manual

## 🐛 Problemas Conhecidos

Veja [SETUP.md](./SETUP.md) para troubleshooting.

## 📄 Licença

Projeto pessoal para uso próprio.

---

**Desenvolvido com ❤️ para treinos sérios** 🏋️‍♂️

