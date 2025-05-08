// Polyfills for Node environment
import { TextDecoder, TextEncoder } from "util";
import fetch from "node-fetch";

global.TextDecoder = TextDecoder as any;
global.TextEncoder = TextEncoder as any;
globalThis.fetch = fetch as any;
