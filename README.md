react-playground-iframe
=========================
[![npm](https://img.shields.io/badge/npm-react--playground--iframe-brightgreen.svg?style=flat-square)](https://www.npmjs.com/package/react-playground-iframe)
[![npm](https://img.shields.io/npm/v/react-playground-iframe.svg?style=flat-square)](https://www.npmjs.com/package/react-playground-iframe)
<br>Rendering the react component to the &lt;iframe/&gt;
## [Demo (Yet Develop)](https://gron1gh1.github.io/react-playground-iframe/)
![Alt Text](https://github.com/gron1gh1/react-playground-iframe/blob/master/preview.gif)

## Installation
```bash
npm install react-playground-iframe --save
```

## Quick Start

```javascript
import React,{useState} from 'react';
import {CodeEditor,IFrameProvider,IFrame} from 'react-playground-iframe';

function App() {
  const InitCode = `const {Button} = antd;
    function App()
    {
      const [idx,SetIdx] = React.useState(0);
      return (
        <div>
          <Button type="primary" onClick={()=> SetIdx(idx+1)}>{idx}</Button>
        </div>
      )
    }`;
  return (
    <div>
      <IFrameProvider>
        <CodeEditor InitCode={InitCode}  />
        <IFrame InitCode={InitCode} LoadModule={['antd']} LoadCSS={['https://unpkg.com/antd@4.2.5/dist/antd.css']} />
        </IFrameProvider>
    </div>
  );
}
```


## API
### &lt;IFrame /&gt; Props
|Name|Type|Description|
|---|---|---|
|InitCode|string|First Render React Code in the playground.
|LoadModule|string[]|Import the `NPM Module` used in the playground.
|LoadCSS|string[]|Import the `href` used in the playground. &lt;= `<link rel="stylesheet" href="     ">`
### &lt;CodeEditor /&gt; Props
|Name|Type|Description|
|---|---|---|
|InitCode|string|First Render React Code in the `<textarea />`
