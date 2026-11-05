/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_INVITATION_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}
