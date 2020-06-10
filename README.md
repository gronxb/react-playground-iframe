react-playground-iframe
=========================
[![npm](https://img.shields.io/badge/npm-react--playground--iframe-brightgreen.svg?style=flat-square)]()
Rendering the react component to the <iframe>
## Demo (Yet Develop)
[https://gron1gh1.github.com/react-playground-iframe](https://gron1gh1.github.com/react-playground-iframe)
## Installation
```bash
npm install react-playground-iframe --save
```

## Quick Start

```javascript
import React,{useState} from 'react';
import {CodeEditor,IFrameProvider,IFrame} from 'react-playground-iframe';

function App() {
  const [modules, SetModule] = useState(['antd']);
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
    <div className="App">
      <IFrameProvider>
        <CodeEditor InitCode={InitCode}  />
        <IFrame InitCode={InitCode} LoadModule={['antd']} LoadCSS={['https://unpkg.com/antd@4.2.5/dist/antd.css']} />
        </IFrameProvider>
    </div>
  );
}
```
