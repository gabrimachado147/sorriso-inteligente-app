
# Formato de Resposta do Webhook para Agendamentos

Para que o sistema detecte automaticamente os agendamentos criados via webhook, a resposta deve conter informações estruturadas. Aqui estão os formatos esperados:

## Formato Recomendado

A resposta do webhook deve incluir as palavras-chave e dados necessários para extração automática:

### Exemplo 1: Agendamento Confirmado
```
Agendamento confirmado! 
Nome: Maria Silva
Telefone: (11) 99999-9999
Serviço: Limpeza Dental
Clínica: Senhor Sorriso - Campo Belo
Data: 15/06/2024
Horário: 14:00
```

### Exemplo 2: Consulta Agendada
```
✅ Consulta agendada com sucesso!

📝 Paciente: João Santos
📞 Contato: (35) 98765-4321
🦷 Procedimento: Avaliação Gratuita
🏥 Local: Unidade Formiga
📅 Data: 20/06/2024
⏰ Hora: 09:30
```

### Exemplo 3: Formato Mais Simples
```
Perfeito! Sua consulta foi marcada para 25/06/2024 às 15:00 na clínica de Itararé. 
Serviço: Ortodontia
Até lá! 😊
```

## Palavras-chave para Detecção

O sistema detecta agendamentos quando a resposta contém estas palavras-chave:
- "agendamento confirmado"
- "consulta agendada"
- "horário marcado"
- "appointment confirmed"
- "scheduled for"
- "confirmado para"
- "agendado para"

## Padrões de Extração

### Nome do Paciente
- `nome: [nome]`
- `paciente: [nome]`
- `para: [nome]`

### Telefone
- `telefone: [número]`
- `contato: [número]`
- `fone: [número]`

### Serviço
- `serviço: [nome do serviço]`
- `consulta: [tipo]`
- `procedimento: [nome]`
- Palavras específicas: avaliação, limpeza, ortodontia

### Clínica/Local
- `clínica: [nome]`
- `unidade: [nome]`
- `local: [nome]`
- Nomes das cidades: Campo Belo, Formiga, Itararé, Capão Bonito, Itapeva

### Data
- `data: DD/MM/AAAA`
- `dia: DD/MM/AAAA`
- Formato DD/MM/AAAA em qualquer lugar do texto

### Horário
- `horário: HH:MM`
- `hora: HH:MM`
- `às HH:MM`
- Formato HH:MM em qualquer lugar do texto

## Configuração do Webhook

Para que o sistema funcione corretamente, certifique-se de que:

1. **O webhook responde com um campo `output`** contendo a mensagem formatada
2. **Inclui informações mínimas**: data e horário são obrigatórios
3. **Usa palavras-chave de detecção** para ativar o processamento automático
4. **Formata as datas** no padrão DD/MM/AAAA
5. **Formata os horários** no padrão HH:MM (24h)

## Exemplo de Resposta JSON do Webhook

```json
{
  "output": "Agendamento confirmado! Nome: Maria Silva, Telefone: (11) 99999-9999, Serviço: Limpeza Dental, Data: 15/06/2024, Horário: 14:00, Local: Campo Belo",
  "sessionId": "session_123456",
  "threadId": "thread_789",
  "timestamp": "2024-06-13T10:30:00Z"
}
```

## Testando a Integração

Para testar se o sistema está funcionando:

1. Envie uma mensagem via chat solicitando agendamento
2. Verifique se o webhook retorna uma resposta com as palavras-chave
3. Confirme se o agendamento aparece na página `/appointments`
4. Verifique os logs do console para debug

## Logs de Debug

O sistema gera logs úteis para debug:
- `Agendamento detectado mas sem data/hora completa` - faltam dados obrigatórios
- `Agendamento criado com sucesso` - sucesso na criação
- `Erro ao processar agendamento do webhook` - erro no processamento

## Fallbacks

Se alguns dados não forem detectados, o sistema usa valores padrão:
- **Nome**: "Cliente via WhatsApp"
- **Telefone**: "Não informado" (ou usa o telefone do contexto)
- **Serviço**: "Consulta"
- **Clínica**: "Senhor Sorriso"
- **Data**: Se inválida, usa data atual

---

**⚠️ Importante**: O sistema criará agendamentos automaticamente apenas quando detectar as palavras-chave e dados mínimos (data + horário). Certifique-se de que seu webhook está retornando as informações no formato correto.
