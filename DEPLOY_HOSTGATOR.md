# Deploy SADA para HostGator cPanel

## 📋 Pré-requisitos

1. **Conta HostGator** com cPanel
2. **Banco MySQL** configurado no cPanel
3. **Domínio** configurado

## 🗄️ 1. Preparar o Banco de Dados

### No cPanel:
1. Acesse **MySQL Databases**
2. Crie o banco: `sada_db`
3. Crie usuário e senha
4. Dê permissões totais

### Importar Schema:
1. Acesse **phpMyAdmin**
2. Selecione o banco `sada_db`
3. Importe o arquivo `schema.sql`

## 📁 2. Upload dos Arquivos

### Estrutura no public_html:
```
public_html/
├── api/              ← Backend PHP
├── assets/           ← Frontend buildado
├── index.html        ← Frontend
└── config/           ← Configurações
```

### Upload:
1. **Frontend:** Faça `npm run build` e envie `dist/public/*` para `public_html/`
2. **Backend:** Envie pasta `api/`, `config/`, `models/` para `public_html/`

## ⚙️ 3. Configurar Banco

Edite `config/database.php`:
```php
private $host = 'localhost';
private $db_name = 'seu_usuario_sada_db';  // HostGator prefixo
private $username = 'seu_usuario_db';
private $password = 'sua_senha_db';
```

## 🔗 4. Atualizar Frontend

No seu código React, altere a URL da API:
```javascript
// De: const API_BASE = '/api'
// Para:
const API_BASE = 'https://seudominio.com.br/api'
```

## 🧪 5. Testar

### URLs para testar:
- Frontend: `https://seudominio.com.br`
- API: `https://seudominio.com.br/api/suppliers`
- Dashboard: `https://seudominio.com.br/api/dashboard/stats`

## 🔧 6. Solução de Problemas

### Erro 500:
- Verifique permissões dos arquivos (644)
- Verifique logs de erro no cPanel

### CORS Error:
- Certifique-se que `.htaccess` está funcionando
- Teste headers CORS

### Banco não conecta:
- Verifique credenciais em `config/database.php`
- Teste conexão via phpMyAdmin

## ✅ 7. Checklist Final

- [ ] Banco criado e schema importado
- [ ] Arquivos uploadados
- [ ] Configuração de banco atualizada
- [ ] URL da API atualizada no frontend
- [ ] .htaccess configurado
- [ ] Permissões dos arquivos corretas
- [ ] Teste de todas as APIs funcionando

## 🎯 Resultado

Seu projeto SADA estará rodando completamente na HostGator com:
- ✅ Frontend React otimizado
- ✅ Backend PHP nativo
- ✅ Banco MySQL
- ✅ Zero dependências Node.js