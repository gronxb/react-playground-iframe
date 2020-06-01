import React, { useEffect, useState, useCallback, useRef, useContext, memo, useSelector, useMemo } from 'react';
import { transform } from 'buble';
import axios from 'axios';
import 'antd/dist/antd.css';
import { Tree } from 'antd';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import '../node_modules/prismjs/components/prism-clike';
import '../node_modules/prismjs/components/prism-javascript';
import '../node_modules/prismjs/components/prism-markup';
import '../node_modules/prismjs/components/prism-jsx';
import "./style.css";

import { IFrameProvider, IFrameContext } from './IFrameProvider';

const { TreeNode } = Tree;

const Frame = memo(function Frame({ code, lib }) {
  const [npmData, SetNPM] = useState([]);

  const ref = useRef();

  const createBlobUrl = useCallback((html) => {
    let blob = new Blob([html], {
      type: 'text/html',
      endings: 'native'
    });
    return URL.createObjectURL(blob);
  }, []);


  const IframeData = useContext(IFrameContext);

  const onLoad = useCallback(() => { // ImportNPM to Tree Data
    let npm_infos = ImportNPM(lib);

    let treeData = npm_infos.map((v) => {

      return {
        title: v.name,
        key: v.name,
        children: Object.keys(v.module).map(m => {
          return {
            title: m,
            key: v.name + '-' + m,
          }
        })
      }
    });
    IframeData.SetData(treeData, 'PUSH');
    console.log('treeData', treeData);
  }, []);

  const ImportNPM = useCallback((lib_names) => { // Import NPM Module imported within <iframe>
    let all = Object.keys(ref.current.contentWindow);
    return all.filter((v) => lib_names.some((a) => {
      return a === v.toLowerCase();
    })).map((v) => {
      return {
        name: v,
        module: ref.current.contentWindow[v]
      }
    });
  }, []);

  console.log('렌더링');
  function onLoad2() {
      ref.current.contentWindow.npm_reload(lib);
  }
  return useMemo(() => {
    return (<iframe id='frame' ref={ref} onLoad={onLoad2} style={{ width: '50%', border: '1px solid black' }} src={createBlobUrl(`
    <!DOCTYPE html>
      <html lang="en">
        <head>
        <link rel="stylesheet" href="https://unpkg.com/antd@4.2.5/dist/antd.css">
        <script type="module">
          // React Load for Default
          
        </script>
        <script type="text/javascript">
        function Load(flag)
        {
          //<div class="loader"></div>
          let loaderTag = document.createElement('div');
          loaderTag.setAttribute('id','loader');
          let body = document.getElementsByTagName('body')[0];
          if(flag === true)
            body.appendChild(loaderTag)
          else
            body.removeChild(document.getElementById('loader'))
        }
        function npm_reload(npm_libs)
        {
          let npm_string = npm_libs.map((v) => \`const {default: \${v}} = await import('https://dev.jspm.io/\${v}');window.\${v} = \${v};\`).join('\\n');

          let scriptTag = document.createElement('script');
          scriptTag.setAttribute('id','module');
          scriptTag.setAttribute('type','module');
          scriptTag.textContent = \`(async () => {
            Load(true);
            console.log('로딩 중');
                if(window.React === undefined)
                {
                  const {default: React} = await import('https://dev.jspm.io/react');
                  window.React = React;
                }
                if(window.ReactDOM === undefined)
                {
                  const {default: ReactDOM} = await import('https://dev.jspm.io/react-dom');
                  window.ReactDOM = ReactDOM;
                }
                \${npm_string}
                //ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
                console.log('로딩 끝');
                Load(false);
                })();\`;

            let module = document.getElementById('module');
            let head = document.getElementsByTagName('head')[0];
            module && head.removeChild(document.getElementById('module'));

            head.appendChild(scriptTag);
        }

        function jsx_reload(code)
        {
            let scriptTag = document.createElement('script');
            scriptTag.setAttribute('id','jsx');
            scriptTag.textContent  = code;
            
            let jsx = document.getElementById('jsx');
            let head = document.getElementsByTagName('head')[0];
            jsx && head.removeChild(document.getElementById('jsx'));
            head.appendChild(scriptTag);

            if(ReactDOM)
              ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
        }
        </script>
        <style>
        #loader,
#loader:after {
  border-radius: 50%;
  width: 5em;
  height: 5em;
}
#loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.5em solid rgba(255, 0, 0, 0.2);
  border-right: 0.5em solid rgba(0, 255, 255, 0.2);
  border-bottom: 0.5em solid rgba(0, 0, 255, 0.2);
  border-left: 0.5em solid white;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
        </style>
        </head>
        <body>
          <div id="root"></div>
          
        </body>
    </html>
    `)} />
    )
  }, [code, lib])
});


const TreeView = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const get_data = useContext(IFrameContext).data;

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys);
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeys);
  };

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={get_data}
    />
  );
};

function CodeEditor() {
  
  const IframeData = useContext(IFrameContext);

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

  function textarea_onChange(input_code) {
    SetCode(input_code);
   
  }

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

  useEffect(()=>{
    try{
      let transcode = transform(Code).code;
      IframeData.SetCode(transcode);
    }
    catch(e)
    {
      IframeData.SetCode(transform(ErrorComponent(e.message)).code);
    }
  },[Code]);

  useEffect(() => {
    if(IframeData === undefined) return;
    try {
      let load_func = document.getElementById('frame').contentWindow.jsx_reload;
      if (load_func) {
        load_func(IframeData.code);
      }
    }
    catch (e) {
      console.log('err',e);
    }
  }, [IframeData]);

  return (
    <IFrameProvider>
    <Editor
      placeholder="Input React Code."
      value={Code}
      onValueChange={textarea_onChange}
      highlight={code => highlight(code, languages.jsx)}
      padding={10}

      className="container__editor"
    />
    </IFrameProvider>
  )
}

function App() {
  const [transCode, SetTransCode] = useState('');

  const IframeData = useContext(IFrameContext);



  return useMemo(() => {
    return (
      <IFrameProvider>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <CodeEditor />
            </div>
            <Frame code={''} lib={['antd', 'reactstrap']} />
          </div>
          <input type="text" id="text" />
          <div style={{ display: 'flex' }}>
            <button onClick={() => {
              let text = document.getElementById('text').value;
              axios.get(`http://unpkg.com/${text}`).then((v) => console.log(v));
            }}>Test</button>

            <TreeView />
          </div>
        </div>
      </IFrameProvider>
    );
  },[]);
}

export default App;
