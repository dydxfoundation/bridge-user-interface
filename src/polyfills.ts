import { Buffer } from 'buffer';

// @ts-ignore
globalThis.process ??= { env: {} }; // Minimal process polyfill
globalThis.global ??= globalThis;
globalThis.Buffer ??= Buffer;
