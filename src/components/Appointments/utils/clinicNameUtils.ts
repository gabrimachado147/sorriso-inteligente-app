
// Função para simplificar o nome da clínica
export const simplifyClinicName = (clinicName: string) => {
  // Remove "Senhor Sorriso" e outros prefixos/sufixos
  const cleanName = clinicName
    .replace(/senhor sorriso/gi, '')
    .replace(/dr\./gi, '')
    .replace(/dra\./gi, '')
    .replace(/unidade/gi, '')
    .replace(/filial/gi, '')
    .replace(/\s*-\s*/g, ' ')
    .trim();
  
  // Mapear nomes específicos se necessário
  const cityMappings: { [key: string]: string } = {
    'capao bonito': 'Capão Bonito',
    'capão bonito': 'Capão Bonito',
    'itarare': 'Itararé',
    'itararé': 'Itararé',
    'itapeva': 'Itapeva',
    'formiga': 'Formiga',
    'campo belo': 'Campo Belo',
    'campobelo': 'Campo Belo'
  };

  const lowerName = cleanName.toLowerCase();
  return cityMappings[lowerName] || cleanName || clinicName;
};
