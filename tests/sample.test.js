// Testes de funcionalidades básicas
describe("Utilities Tests", () => {
  describe("String Operations", () => {
    it("should handle string concatenation", () => {
      const result = "Hello" + " " + "World";
      expect(result).toBe("Hello World");
    });

    it("should handle string methods", () => {
      const text = "Sorriso Inteligente";
      expect(text.toLowerCase()).toBe("sorriso inteligente");
      expect(text.length).toBe(19); // Corrigido: "Sorriso Inteligente" tem 19 caracteres
    });
  });

  describe("Array Operations", () => {
    it("should handle array operations", () => {
      const services = ['Avaliação', 'Limpeza', 'Ortodontia'];
      expect(services.length).toBe(3);
      expect(services.includes('Limpeza')).toBe(true);
    });

    it("should handle array mapping", () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });
  });

  describe("Object Operations", () => {
    it("should handle object creation", () => {
      const clinic = {
        name: 'Teste Clínica',
        city: 'São Paulo',
        available: true
      };
      
      expect(clinic.name).toBe('Teste Clínica');
      expect(clinic.available).toBe(true);
    });
  });
});
