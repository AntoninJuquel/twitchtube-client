/// <reference types="vite/client" />

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
