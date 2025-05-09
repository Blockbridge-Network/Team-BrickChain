import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    values: jest.fn(),
    keys: jest.fn(),
    toString: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'dummy-anon-key';

// Mock ThirdWeb SDK
jest.mock('thirdweb/react', () => ({
  useWallet: jest.fn(),
  useSDK: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
  useAddress: jest.fn(),
}));

// Mock Headers, Request, and Response if not available in test environment
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any;
}

if (typeof global.Headers !== 'function') {
  global.Headers = class Headers {
    constructor(init?: any) {}
    append(name: string, value: string): void {}
    delete(name: string): void {}
    get(name: string): string | null { return null; }
    has(name: string): boolean { return false; }
    set(name: string, value: string): void {}
    forEach(callback: Function): void {}
  } as any;
}

if (typeof global.Request !== 'function') {
  global.Request = class Request {
    constructor(input: RequestInfo, init?: RequestInit) {}
  } as any;
}

if (typeof global.Response !== 'function') {
  global.Response = class Response {
    constructor(body?: BodyInit | null, init?: ResponseInit) {}
  } as any;
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
