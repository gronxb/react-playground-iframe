import React, { useState, useCallback, useRef, memo, useMemo } from 'react';

const SandBox_Html = `
<!DOCTYPE html>
  <html lang="en">
    <head>
    <link rel="stylesheet" href="https://unpkg.com/antd@4.2.5/dist/antd.css">

    <script type="text/javascript">
    function onSpinner(flag)
    {
      console.log("flag",flag);
      let body = document.getElementsByTagName('body')[0];
     
      if(flag === true)
      {
        body.setAttribute('style','overflow:hidden');
        let loaderTag = document.createElement('div');
        loaderTag.setAttribute('id','loader');
        body.appendChild(loaderTag);
        
     //   body.setAttribute('style','');
      }
      else
      {
        body.setAttribute('style','');
        body.removeChild(document.getElementById('loader'));
      }
    }
    function npm_reload(npm_libs)
    {
      let npm_string = npm_libs.map((v) => \`const {default: \${v.replace(/-/g,"")}} = await import('https://dev.jspm.io/\${v}');window.\${v.replace(/-/g,"")} = \${v.replace(/-/g,"")};\`).join('\\n');

      let scriptTag = document.createElement('script');
      scriptTag.setAttribute('id','module');
      scriptTag.setAttribute('type','module');
      scriptTag.textContent = \`(async () => {
      onSpinner(true);
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
          if(window.App !== undefined)
            ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
          onSpinner(false);
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

        if(window.ReactDOM !== undefined)
          ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
    }
    
    // head에 url 이미 존재할 때
    // head에 있었는데 새로 들어오는 url에 없는 거 일때 (삭제)

    function css_reload(urls)
    {
        let linkTag = document.createElement('link');
        linkTag.setAttribute('rel','stylesheet');
        linkTag.setAttribute('href','http://');

        let link_arr = Array.from(document.getElementsByTagName('link'));

        let head = document.getElementsByTagName('head')[0];
        urls.forEach((url) => {
          
          let dupl_check = link_arr.some((link) => link.href === url);

          if(dupl_check === false)
          {
            let linkTag = document.createElement('link');
            linkTag.setAttribute('rel','stylesheet');
            linkTag.setAttribute('href',url);
            head.appendChild(linkTag);
          }
        })

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
`;

function createBlobUrl(html){
    let blob = new Blob([html], {
      type: 'text/html',
      endings: 'native'
    });
    return URL.createObjectURL(blob);
};

export  const IFrame = memo(function IFrame({ code, lib }) {
    const ref = useRef();
    console.log('렌더링');

    function onLoad() {
      ref.current.contentWindow.npm_reload(lib);
      ref.current.contentWindow.jsx_reload(code);
    }

    return useMemo(() => {
      return (<iframe id='frame' ref={ref} onLoad={onLoad} style={{ width: '50%', border: '1px solid lightgray' }} src={createBlobUrl(SandBox_Html)} />
      )
    }, []) // First rendered, prevent re-rendering
  });
  
  