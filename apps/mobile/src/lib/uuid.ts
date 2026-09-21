import * as Crypto from 'expo-crypto';

// Falls back to a Math.random()-based v4-shaped id when the native module
// doesn't produce one (observed under jest-expo, where the ExpoCrypto native
// module isn't wired up and Crypto.randomUUID() resolves to undefined — see
// migrate.test.ts). These ids are device-local only (client_*_id columns),
// never sent to the server as security material, so this fallback's weaker
// entropy is an acceptable tradeoff for "never throws, always unique enough".
function fallbackUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function randomUUID(): string {
  return Crypto.randomUUID() || fallbackUUID();
}
