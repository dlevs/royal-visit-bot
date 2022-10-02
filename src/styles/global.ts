import { injectGlobal } from "@emotion/css";

injectGlobal`
  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 400;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #fff;
    max-width: 2000px;
    margin: 3rem auto;
  }

  img {
    display: block;
    max-width: 100%;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
`;
