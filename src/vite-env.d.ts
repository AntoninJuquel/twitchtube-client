/// <reference types="vite/client" />

import { Clip } from './remotion/Clip';

declare module 'gl-transitions' {
  interface GLTransition {
    name: string;
    author: string;
    license: string;
    glsl: string;
    defaultParams: { [key: string]: mixed };
    paramsTypes: { [key: string]: string };
    createdAt: string;
    updatedAt: string;
  }
  const GLTransitions: GLTransition[];
  export default GLTransitions;
}

interface CustomEventMap {
  'video:clip:added': CustomEvent<Clip>;
  'video:clip:removed': CustomEvent<Clip>;
}
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }
}
