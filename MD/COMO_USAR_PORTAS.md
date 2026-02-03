# 🔌 Como Usar Portas Diferentes para Teste

## 🚀 Portas Disponíveis

O projeto pode rodar em várias portas para facilitar testes.

## 📋 Scripts Disponíveis

### Porta Padrão (5173)
```bash
npm run dev
```
Acesse: `http://localhost:5173`

### Porta Alternativa 1 (5174)
```bash
npm run dev:5174
```
Acesse: `http://localhost:5174`

### Porta Alternativa 2 (5175)
```bash
npm run dev:5175
```
Acesse: `http://localhost:5175`

### Porta 3000
```bash
npm run dev:3000
```
Acesse: `http://localhost:3000`

## 🔧 Configurar Porta Personalizada

### Opção 1: Via Linha de Comando
```bash
npm run dev -- --port 8080
```
Ou:
```bash
vite --port 8080
```

### Opção 2: Via Variável de Ambiente
Crie ou edite o arquivo `.env` na raiz do projeto:
```env
VITE_PORT=8080
```

Depois execute:
```bash
npm run dev
```

## 📝 Exemplo de Uso

Para testar sem conflitos com outras aplicações:

1. **Rodar em porta 5174:**
   ```bash
   npm run dev:5174
   ```

2. **Acessar:** `http://localhost:5174`

3. **Rodar em outra porta em paralelo:**
   - Abra outro terminal
   - Execute: `npm run dev:5175`
   - Acesse: `http://localhost:5175`

## ⚠️ Observações

- Se a porta estiver ocupada, o Vite tentará usar a próxima disponível
- Cada instância usa seu próprio cache, ideal para testar diferentes cenários
- A porta será exibida no terminal quando o servidor iniciar

## 🔍 Verificar Porta em Uso

Se a porta estiver ocupada, você verá uma mensagem como:
```
Port 5173 is in use, trying another one...
```

O Vite automaticamente tentará a próxima porta disponível.
