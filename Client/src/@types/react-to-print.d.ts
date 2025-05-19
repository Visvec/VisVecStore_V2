declare module 'react-to-print' {
  import * as React from 'react';

  export function useReactToPrint(options: {
    content: () => React.ReactInstance | null;
    documentTitle?: string;
    onBeforePrint?: () => void;
    onAfterPrint?: () => void;
    removeAfterPrint?: boolean;
    copyStyles?: boolean;
  }): () => void;
}
