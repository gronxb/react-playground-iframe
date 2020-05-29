import React, { useEffect, useState } from 'react';
import { transform } from 'buble';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import '../node_modules/prismjs/components/prism-clike';
import '../node_modules/prismjs/components/prism-javascript';
import '../node_modules/prismjs/components/prism-markup';
import '../node_modules/prismjs/components/prism-jsx';
import "./style.css";
function Frame({ code }) {
  function createBlobUrl(html) {
    let blob = new Blob([html], {
      type: 'text/html',
      endings: 'native'
    });
    return URL.createObjectURL(blob);
  }

  return (
    <iframe style={{ width: '50%', border: '1px solid black' }} src={createBlobUrl(`
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
          <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
          <script src="https://unpkg.com/antd@4.2.5/dist/antd.min.js" crossorigin></script>
          <link rel="stylesheet" href="https://unpkg.com/antd@4.2.5/dist/antd.css">
          <script>


         ${code}

          window.onload = () => {
            console.log(React.createElement)
            ReactDOM.render(React.createElement( App, null ), document.getElementById('root'));
          }
          </script>
        </head>
        <body>
          <div id="root"></div>

        </body>
    </html>
    `)} />
  )
}

function App() {
  const [transCode, SetTransCode] = useState('');
  const [Code, SetCode] = useState(`
  function App()
  {
    const [idx,SetIdx] = React.useState(0);
    return (
      <div>
        <antd.Button type="primary" onClick={()=> SetIdx(idx+1)}>{idx}</antd.Button>
      </div>
    )
  }
  `);
  const ErrorComponent = (ErrorMessage) => `
    function App()
    {
      return (
        <div>
          <antd.Alert
          message="Error"
          description="${ErrorMessage}"
          type="error"
          showIcon
        />
        </div>
      )
    }
  `
  function textarea_onChange(input_code) {
    SetCode(input_code);
  }

  useEffect(() => {
    try{
      
      SetTransCode(transform(Code).code);
    }
    catch(e)
    {
      console.log(e);
       SetTransCode(transform(ErrorComponent(e.message)).code)
    }
  },[Code]);
  useEffect(() => console.log(transCode),[transCode]);
  return (
    <div className="App" style={{ display: 'flex' }}>
 
      <Editor
        value={Code}
        onValueChange={textarea_onChange}
        highlight={code => highlight(code, languages.jsx)}
        padding={10}
        style={{ width: '50%', height: '768px' }}
      />
      <Frame code={transCode} />
    </div>
  );
}

export default App;
