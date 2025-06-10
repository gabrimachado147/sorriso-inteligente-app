
# Staging Environment Setup

## Overview

O ambiente de staging é uma réplica do ambiente de produção usado para testes finais antes do deploy. Este documento descreve como configurar e usar o ambiente de staging.

## Branch Strategy

### Branches Principais
- **main**: Produção estável
- **staging**: Ambiente de homologação  
- **develop**: Desenvolvimento ativo
- **feature/***: Features em desenvolvimento

### Fluxo de Deploy
1. Development → Pull Request para `develop`
2. `develop` → Pull Request para `staging` 
3. `staging` → Pull Request para `main` (produção)

## Environment Variables

### Staging (.env.staging)
```bash
# API Configuration
VITE_API_BASE_URL=https://staging-api.enigmabot.store
VITE_N8N_WEBHOOK_URL=https://n8nwebhook.enigmabot.store/webhook/631694e6-5e32-49a7-b4df-a58423be231f
VITE_EVOLUTION_API_URL=https://evo.enigmabot.store/message/sendText/ELARA

# Supabase Configuration  
VITE_SUPABASE_URL=https://porzszsbobsvwezdbipc.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key_here

# Environment
VITE_ENVIRONMENT=staging

# Debug Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug

# Feature Flags
VITE_ENABLE_MOCK_API=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
```

## GitHub Secrets

Configure os seguintes secrets no GitHub:

### Staging Secrets
- `STAGING_API_BASE_URL`
- `STAGING_N8N_WEBHOOK_URL`  
- `STAGING_EVOLUTION_API_URL`
- `STAGING_SUPABASE_URL`
- `STAGING_SUPABASE_ANON_KEY`

### Deployment Secrets
- `STAGING_HOST`: IP/hostname do servidor
- `STAGING_USERNAME`: Usuário SSH
- `STAGING_SSH_KEY`: Chave privada SSH

### Optional Secrets
- `SLACK_WEBHOOK`: Para notificações
- `LHCI_GITHUB_APP_TOKEN`: Para Lighthouse CI

## CI/CD Pipeline

### Trigger Events
- **Push to staging**: Deploy automático
- **Pull Request to staging**: Executa testes

### Pipeline Steps
1. **Test**: Type check + unit tests
2. **Build**: Build otimizado para staging
3. **Deploy**: Deploy via SSH para servidor
4. **Lighthouse**: Audit de performance
5. **Notify**: Notificação no Slack

### Build Commands
```bash
# Local staging build
npm run build:staging

# Preview staging build
npm run preview:staging

# Run lighthouse audit
npm run lighthouse
```

## Testing in Staging

### Manual Testing Checklist
- [ ] Login/logout functionality
- [ ] Appointment booking flow
- [ ] Clinic search and filters
- [ ] Chat bot interactions
- [ ] Mobile responsiveness
- [ ] Performance metrics

### Automated Testing
- Unit tests with Vitest
- Performance audit with Lighthouse
- Type checking with TypeScript

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify all dependencies are installed
   - Check TypeScript errors

2. **Deploy Failures**  
   - Verify SSH credentials
   - Check server disk space
   - Verify nginx configuration

3. **Performance Issues**
   - Run Lighthouse audit
   - Check bundle size
   - Verify image optimization

### Debug Commands
```bash
# Check build output
npm run build:staging && ls -la dist-staging/

# Test environment variables
echo $VITE_ENVIRONMENT

# Verify SSH connection
ssh -T git@github.com
```

## Performance Monitoring

### Lighthouse Metrics
- **Performance**: > 90
- **Accessibility**: > 95  
- **Best Practices**: > 90
- **SEO**: > 90

### Bundle Analysis
```bash
# Analyze bundle size
npm run build:staging -- --analyze

# Check dependencies
npm ls --depth=0
```

## Security Considerations

1. **Environment Variables**: Nunca commitar secrets
2. **SSH Keys**: Usar chaves dedicadas para staging
3. **API Access**: Usar tokens limitados para staging
4. **Database**: Dados de teste, não produção

## Rollback Strategy

### Emergency Rollback
```bash
# Rollback to previous version
git checkout staging
git reset --hard HEAD~1
git push --force-with-lease origin staging
```

### Planned Rollback
1. Identificar commit estável
2. Criar Pull Request de rollback
3. Seguir processo normal de deploy

## Monitoring

### Health Checks
- **Application**: https://staging.sorrisointeligente.com/health
- **API**: https://staging-api.enigmabot.store/health
- **Database**: Monitor via Supabase dashboard

### Logs
- **Application logs**: Via browser console
- **Server logs**: `/var/log/nginx/` no servidor
- **Deploy logs**: GitHub Actions logs
