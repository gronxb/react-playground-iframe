import React, { useEffect, useState, useCallback } from 'react';
import { transform } from 'buble';
import axios from 'axios';
import { Treebeard } from 'react-treebeard';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import '../node_modules/prismjs/components/prism-clike';
import '../node_modules/prismjs/components/prism-javascript';
import '../node_modules/prismjs/components/prism-markup';
import '../node_modules/prismjs/components/prism-jsx';
import "./style.css";


function Frame({ code, lib }) {
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
         
          ${lib.map((v) => `<script src="https://unpkg.com/${v}" crossorigin></script>`).reduce((a, b) => a + '\n' + b)}
          
          <link rel="stylesheet" href="https://unpkg.com/antd@4.2.5/dist/antd.css">


          <script>

          function IncludeLibTree(lib) {
            let all = Object.keys(window);
            return all.filter((v) => lib.some((a) => {
              return a === v.toLowerCase();
            })).map((v) => window[v]);
            
          }
          
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

const TreeExample = () => {
  const [data, setData] = useState({
    name: 'root',
    toggled: true,
    children: [
      {
        name: 'parent',
        children: [
          { name: 'child1' },
          { name: 'child2' }
        ]
      },
      {
        name: 'loading parent',
        loading: true,
        children: []
      },
      {
        name: 'parent',
        children: [
          {
            name: 'nested parent',
            children: [
              { name: 'nested child 1' },
              { name: 'nested child 2' }
            ]
          }
        ]
      }
    ]
  });
  const [cursor, setCursor] = useState(false);

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setData(Object.assign({}, data))
  }

  return (
    <Treebeard data={data} onToggle={onToggle} />
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

  const ErrorComponent = useCallback((ErrorMessage) => `
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
`, []);

  function textarea_onChange(input_code) {
    SetCode(input_code);
  }

 

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex'}}>
      <div style={{width:'50%'}}>
        <Editor
          placeholder="Input React Code."
          value={Code}
          onValueChange={textarea_onChange}
          highlight={code => highlight(code, languages.jsx)}
          padding={10}
          
          className="container__editor"
        />
        </div>
        <Frame code={transCode} lib={['antd', 'reactstrap', 'react-treebeard']} />
      </div>
      <input type="text" id="text" />
      <div style={{ display: 'flex' }}>
        <button onClick={() => {
          let text = document.getElementById('text').value;
          axios.get(`http://unpkg.com/${text}`).then((v) => console.log(v));
        }}>Test</button>
        <TreeExample />
      </div>
    </div>
  );
}

export default App;
