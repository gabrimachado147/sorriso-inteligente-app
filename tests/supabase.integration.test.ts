import { supabase } from '../src/integrations/supabase/client.test';

describe('Supabase Integration', () => {
  it('deve conectar e buscar dados da tabela de agendamentos', async () => {
    const { data, error } = await supabase.from('appointments').select('*').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('deve não retornar erro ao buscar usuários', async () => {
    const { data, error } = await supabase.from('user_profiles').select('*').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
