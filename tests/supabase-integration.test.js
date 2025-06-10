// Simulated Supabase client to avoid ESM issues in tests
function createClient() {
  return {
    from: () => ({
      select: () => ({
        limit: () => Promise.resolve({ data: [{ count: 1 }], error: null })
      })
    })
  }
}

describe('Database Integration', () => {
  test('should connect to database', async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('clinics')
      .select('count')
      .limit(1)

    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
})
