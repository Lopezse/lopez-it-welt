// =====================================================
// TYPE STUBS FÜR NICHT-INSTALLIERTE MODULE
// LEG-TS-01 - TypeScript Legacy Cleanup
// =====================================================

declare module 'ioredis' {
  class Redis {
    constructor(options?: any);
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<string>;
    del(key: string): Promise<number>;
    ping(): Promise<string>;
    quit(): Promise<string>;
  }
  export default Redis;
  export { Redis };
}

declare module 'bullmq' {
  export class Queue {
    constructor(name: string, options?: any);
    add(name: string, data: any, options?: any): Promise<any>;
    close(): Promise<void>;
  }
  export class Worker {
    constructor(name: string, processor: any, options?: any);
    on(event: string, callback: any): void;
    close(): Promise<void>;
  }
}

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
}

declare module '@react-pdf/renderer' {
  export const Document: any;
  export const Page: any;
  export const Text: any;
  export const View: any;
  export const StyleSheet: any;
  export const pdf: any;
  export const Font: any;
}

declare module '@storybook/react' {
  export const Meta: any;
  export const StoryObj: any;
}

declare module '@chroma-core/default-embed' {
  export const DefaultEmbeddingFunction: any;
}

