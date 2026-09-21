describe('randomUUID', () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock('expo-crypto');
  });

  it('falls back to a locally-generated id when the native module returns falsy (the real jest-expo condition today)', () => {
    // No mocking here: this exercises the actual environment gap this
    // fallback exists for — expo-crypto's native module isn't wired up
    // under jest-expo, so Crypto.randomUUID() resolves to undefined.
    const { randomUUID } = require('../uuid') as typeof import('../uuid');

    const id = randomUUID();

    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(10);
    // v4-shaped: 8-4-4-4-12 hex groups, version nibble 4, variant nibble 8-b.
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('produces different ids across calls', () => {
    const { randomUUID } = require('../uuid') as typeof import('../uuid');

    const ids = new Set(Array.from({ length: 20 }, () => randomUUID()));

    expect(ids.size).toBe(20);
  });

  it('uses the native value when expo-crypto actually returns one', () => {
    jest.resetModules();
    jest.doMock('expo-crypto', () => ({ randomUUID: () => 'native-uuid-value' }));

    const { randomUUID } = require('../uuid') as typeof import('../uuid');

    expect(randomUUID()).toBe('native-uuid-value');
  });
});
