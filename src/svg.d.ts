// SVG를 React 컴포넌트로 import할 수 있도록 타입 선언 추가
declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}