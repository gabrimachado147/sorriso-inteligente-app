
// Base de conhecimento completa para o Chat IA da Senhor Sorriso
export interface KnowledgeEntry {
  question: string;
  answer: string;
  category: string;
}

export class ChatKnowledgeBase {
  private static readonly knowledgeData: KnowledgeEntry[] = [
    // Informações gerais sobre a empresa
    {
      question: "O que é a Senhor Sorriso e quais serviços ela oferece?",
      answer: "A Senhor Sorriso é uma rede de clínicas odontológicas completas que oferece avaliação gratuita, limpeza, restauração, ortodontia, implantodontia, estética dental, próteses fixas, endodontia, odontopediatria, periodontia e atendimento de urgência.",
      category: "geral"
    },
    {
      question: "A avaliação inicial tem algum custo?",
      answer: "Não, a avaliação é totalmente gratuita. Servirá para analisar sua saúde bucal e sugerir o melhor plano de tratamento.",
      category: "servicos"
    },
    {
      question: "Quais especialidades odontológicas estão disponíveis?",
      answer: "Clínica geral, ortodontia, implantodontia, prótese, endodontia, periodontia, odontopediatria, cirurgia bucomaxilofacial e estética dental (clareamento, facetas).",
      category: "servicos"
    },

    // Serviços específicos
    {
      question: "Vocês fazem implantes dentários?",
      answer: "Sim, realizamos implantes com planejamento digital, materiais de alta qualidade e pós-operatório monitorado de perto pela equipe.",
      category: "implantes"
    },
    {
      question: "Oferecem lentes de contato dental (facetas)?",
      answer: "Sim, trabalhamos com facetas em cerâmica de alta resistência para estética avançada. Orçamento personalizado após avaliação.",
      category: "estetica"
    },
    {
      question: "Vocês fazem harmonização orofacial?",
      answer: "Realizamos procedimentos como botox terapêutico, preenchimento labial e enzimas faciais, sempre avaliando caso a caso.",
      category: "estetica"
    },
    {
      question: "Atendem casos de urgência dental?",
      answer: "Sim, temos pronto atendimento para dor aguda, fratura dentária e traumas, com encaixes prioritários.",
      category: "urgencia"
    },
    {
      question: "Vocês fazem cirurgia de extração do siso?",
      answer: "Sim, extraímos terceiros molares simples e inclusos, com radiografia panorâmica prévia e sedação quando necessário.",
      category: "cirurgia"
    },
    {
      question: "Qual a idade mínima para atendimento infantil?",
      answer: "Atendemos crianças a partir de 3 anos; nossa odontopediatria usa técnicas lúdicas para conforto dos pequenos.",
      category: "pediatria"
    },
    {
      question: "Vocês tratam bruxismo?",
      answer: "Oferecemos placas de bruxismo personalizadas, terapias de botox terapêutico e acompanhamento clínico.",
      category: "tratamentos"
    },

    // Localização e estrutura
    {
      question: "Onde ficam as clínicas da Senhor Sorriso?",
      answer: "Campo Belo–MG (Rua das Flores, 123), Formiga–MG (Av. Brasil, 456), Itararé–SP (Rua São Pedro, 789), Capão Bonito–SP (Praça da Matriz, 101) e Itapeva–SP (Av. Mário Covas, 321).",
      category: "localizacao"
    },
    {
      question: "A unidade de Campo Belo tem estacionamento?",
      answer: "Sim, estacionamento próprio gratuito para pacientes ao lado da clínica.",
      category: "estrutura"
    },
    {
      question: "As unidades são acessíveis para cadeirantes?",
      answer: "Todas as nossas clínicas possuem rampas, portas largas e banheiros adaptados.",
      category: "acessibilidade"
    },
    {
      question: "Vocês atendem pacientes de cidades vizinhas?",
      answer: "Sim, recebemos pacientes de toda a região. Basta escolher a unidade mais conveniente.",
      category: "atendimento"
    },

    // Agendamento
    {
      question: "Como faço para agendar uma avaliação?",
      answer: "Informe sua cidade, dia e horário preferidos. Confirmaremos imediatamente seu horário.",
      category: "agendamento"
    },
    {
      question: "Quais são os horários de atendimento?",
      answer: "Segunda a sexta: 08h–19h; Sábado: 08h–13h. Avaliações gratuitas dentro desses horários.",
      category: "horarios"
    },
    {
      question: "Posso agendar para hoje mesmo?",
      answer: "Caso haja vaga, sim. Consulte disponibilidades e encaixaremos seu horário.",
      category: "agendamento"
    },
    {
      question: "Posso remarcar meu horário?",
      answer: "Claro! Avise com 24h de antecedência para que possamos liberar o horário e reagendar.",
      category: "agendamento"
    },
    {
      question: "O que acontece se eu me atrasar?",
      answer: "Esperamos até 10 minutos. Após isso, sugerimos novo horário para manter a pontualidade.",
      category: "politicas"
    },
    {
      question: "Como confirmo meu horário?",
      answer: "Enviamos lembrete pelo WhatsApp 24h antes. Responda 'Confirmo' para garantir seu slot.",
      category: "confirmacao"
    },
    {
      question: "Preciso chegar com antecedência?",
      answer: "Chegue 10 minutos antes para preenchimento de ficha e triagem inicial.",
      category: "orientacoes"
    },

    // Pagamento e valores
    {
      question: "Quais formas de pagamento vocês aceitam?",
      answer: "Cartão de débito, crédito, Pix, boleto e parcelamento em até 12x sem juros em tratamentos selecionados.",
      category: "pagamento"
    },
    {
      question: "A clínica aceita convênios odontológicos?",
      answer: "Atendemos convênios selecionados e planos particulares. Verificamos sua cobertura na hora.",
      category: "convenios"
    },
    {
      question: "Vocês oferecem financiamento para implantes?",
      answer: "Sim, temos parcerias com financeiras que possibilitam parcelamento em até 24x.",
      category: "financiamento"
    },
    {
      question: "O orçamento é gratuito?",
      answer: "Sim, você recebe o orçamento completo sem compromisso após avaliação.",
      category: "orcamento"
    },

    // Tratamentos específicos e garantias
    {
      question: "Clareamento dental tem garantia?",
      answer: "Garantimos acompanhamento de 1 ano, desde que siga as orientações de manutenção.",
      category: "garantias"
    },
    {
      question: "Quanto tempo leva um tratamento ortodôntico?",
      answer: "Em média 18–24 meses, variando conforme complexidade.",
      category: "ortodontia"
    },
    {
      question: "Quanto custa um clareamento dental?",
      answer: "Depende da técnica (caseira ou consultório) e do estado dos seus dentes. O valor exato é informado após avaliação.",
      category: "valores"
    },
    {
      question: "Posso fazer limpeza e clareamento no mesmo dia?",
      answer: "Na maioria dos casos, sim. Avaliamos gengivas antes de iniciar o clareamento.",
      category: "procedimentos"
    },
    {
      question: "Quando posso voltar a trabalhar após implante?",
      answer: "Na maioria dos casos, no dia seguinte, seguindo orientações de repouso relativo.",
      category: "pos-operatorio"
    },
    {
      question: "Tratamento de canal dói?",
      answer: "Utilizamos anestesia eficaz. O procedimento é indolor e rápido com nossa tecnologia rotatória.",
      category: "endodontia"
    },

    // Exames e diagnóstico
    {
      question: "Vocês fazem radiografia na clínica?",
      answer: "Sim, radiografias periapicais e panorâmicas são feitas no local, agilizando diagnóstico.",
      category: "exames"
    },
    {
      question: "Quanto tempo dura a avaliação inicial?",
      answer: "Cerca de 30 minutos incluindo exame clínico e plano de tratamento.",
      category: "consultas"
    },

    // Garantias e pós-tratamento
    {
      question: "Como funciona a garantia dos implantes?",
      answer: "Implantes possuem garantia de 5 anos, com revisões semestrais incluídas.",
      category: "garantias"
    },
    {
      question: "E se eu tiver problemas após o tratamento?",
      answer: "Entre em contato; marcamos revisão prioritária sem custo adicional dentro do período de garantia.",
      category: "suporte"
    },

    // Biossegurança
    {
      question: "Vocês seguem protocolos de biossegurança contra COVID-19?",
      answer: "Mantemos esterilização rigorosa, EPI completo e higienização entre pacientes.",
      category: "seguranca"
    },
    {
      question: "Preciso usar máscara na clínica?",
      answer: "Recomendamos máscara nas áreas comuns; pode retirá-la nas salas clínicas sob orientação.",
      category: "protocolos"
    },

    // Diferenciais e tecnologia
    {
      question: "Qual o diferencial da Senhor Sorriso?",
      answer: "Equipe especializada, tecnologia moderna, atendimento humanizado e múltiplas unidades para sua conveniência.",
      category: "diferenciais"
    },
    {
      question: "Vocês utilizam scanner intraoral?",
      answer: "Sim, digitalizamos arcada em 3D para maior conforto e precisão.",
      category: "tecnologia"
    },
    {
      question: "Oferecem alinhadores invisíveis?",
      answer: "Sim, trabalhamos com sistema de alinhadores transparentes personalizados.",
      category: "ortodontia"
    },
    {
      question: "Existem planos de manutenção preventiva?",
      answer: "Temos pacote anual de duas limpezas, avaliação e radiografia com preço fixo.",
      category: "preventivo"
    },
    {
      question: "Vocês realizam sedação consciente?",
      answer: "Disponibilizamos óxido nitroso e sedação oral para pacientes ansiosos.",
      category: "sedacao"
    },

    // Comodidades
    {
      question: "A clínica possui Wi‑Fi para pacientes?",
      answer: "Sim, Wi‑Fi gratuito em todas as unidades.",
      category: "comodidades"
    },
    {
      question: "Posso pagar parte do tratamento com Pix e parte no cartão?",
      answer: "Sim, combinamos formas de pagamento conforme sua necessidade.",
      category: "pagamento"
    },

    // Casos especiais
    {
      question: "Vocês atendem pacientes gestantes?",
      answer: "Atendemos gestantes com autorização do obstetra, priorizando procedimentos seguros.",
      category: "gestantes"
    },

    // Cuidados pós-tratamento
    {
      question: "Quais cuidados pós‑clareamento devo ter?",
      answer: "Evite alimentos com corante por 48h, mantenha higiene rigorosa e use canudo para bebidas escuras.",
      category: "pos-tratamento"
    },
    {
      question: "Quanto tempo devo esperar para comer após limpeza?",
      answer: "Você pode comer normalmente após 30 minutos; prefira alimentos macios e evite corantes fortes no mesmo dia.",
      category: "pos-tratamento"
    },

    // Procedimentos avançados
    {
      question: "Vocês fazem prótese protocolo sobre implante?",
      answer: "Sim, oferecemos protocolo tipo All‑on‑Four e All‑on‑Six com carga imediata.",
      category: "proteses"
    },
    {
      question: "Posso fazer avaliação e iniciar tratamento no mesmo dia?",
      answer: "Dependendo do procedimento e disponibilidade, sim. Implantes e ortodontia exigem planejamento prévio.",
      category: "agendamento"
    },
    {
      question: "Vocês trabalham com laserterapia?",
      answer: "Sim, utilizamos laser para alívio de dor, cicatrização pós‑cirúrgica e tratamento de aftas.",
      category: "tecnologia"
    },
    {
      question: "Realizam bichectomia?",
      answer: "Sim, avaliamos indicação estética e funcional antes da cirurgia.",
      category: "cirurgia"
    },

    // Políticas e condições
    {
      question: "Tem desconto para pagamento à vista?",
      answer: "Oferecemos 7% de desconto para pagamentos à vista via Pix ou dinheiro.",
      category: "descontos"
    },
    {
      question: "Vocês atendem emergência fora do horário?",
      answer: "Temos plantão telefônico para orientação e encaixe prioritário no primeiro horário disponível.",
      category: "emergencia"
    },
    {
      question: "Qual a política de cancelamento?",
      answer: "Cancelamentos com menos de 12h podem gerar taxa simbólica de compromisso.",
      category: "politicas"
    },
    {
      question: "O clareamento deixa dentes sensíveis?",
      answer: "Pode ocorrer sensibilidade leve e temporária; indicamos dessensibilizantes se necessário.",
      category: "efeitos"
    },
    {
      question: "Como agendar retorno de revisão?",
      answer: "Basta informar sua disponibilidade; recomendamos revisões semestrais.",
      category: "retornos"
    }
  ];

  /**
   * Busca respostas na base de conhecimento
   */
  static searchKnowledge(query: string): KnowledgeEntry[] {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    return this.knowledgeData.filter(entry => {
      const questionText = entry.question.toLowerCase();
      const answerText = entry.answer.toLowerCase();
      
      return searchTerms.some(term => 
        questionText.includes(term) || answerText.includes(term)
      );
    });
  }

  /**
   * Obtém entradas por categoria
   */
  static getByCategory(category: string): KnowledgeEntry[] {
    return this.knowledgeData.filter(entry => entry.category === category);
  }

  /**
   * Obtém todas as categorias disponíveis
   */
  static getCategories(): string[] {
    const categories = new Set(this.knowledgeData.map(entry => entry.category));
    return Array.from(categories).sort();
  }

  /**
   * Obtém informações contextuais para o chat
   */
  static getChatContext(): {
    totalEntries: number;
    categories: string[];
    businessHours: string;
    locations: string[];
  } {
    return {
      totalEntries: this.knowledgeData.length,
      categories: this.getCategories(),
      businessHours: "Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h | Domingo: Fechado",
      locations: [
        "Campo Belo - MG",
        "Formiga - MG", 
        "Itararé - SP",
        "Capão Bonito - SP",
        "Itapeva - SP"
      ]
    };
  }

  /**
   * Obtém resposta mais relevante para uma pergunta
   */
  static getBestMatch(query: string): KnowledgeEntry | null {
    const results = this.searchKnowledge(query);
    if (results.length === 0) return null;

    // Prioriza matches exatos na pergunta
    const exactMatch = results.find(entry => 
      entry.question.toLowerCase().includes(query.toLowerCase())
    );

    return exactMatch || results[0];
  }

  /**
   * Obtém todas as entradas da base de conhecimento
   */
  static getAllEntries(): KnowledgeEntry[] {
    return this.knowledgeData;
  }
}

export default ChatKnowledgeBase;
