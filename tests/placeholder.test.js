// Testes básicos para verificar configuração
describe('App Setup', () => {
  test('environment setup is working', () => {
    expect(true).toBe(true);
  });

  test('jest configuration is correct', () => {
    const testData = { name: 'Sorriso Inteligente' };
    expect(testData.name).toBe('Sorriso Inteligente');
  });

  test('basic math operations', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
  });
});
