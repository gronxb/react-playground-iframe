import React, { useState,useEffect, useRef, memo, useMemo } from 'react';

const SandBox_Html = `
<!DOCTYPE html>
  <html lang="en">
    <head>

    <script type="text/javascript">
    function onSpinner(flag,msg)
    {
      let body = document.getElementsByTagName('body')[0];
      let root = document.getElementById('root');
      if(flag === true)
      {
        if(document.getElementById('loader')) return;
        root.setAttribute('style','display:none');

        body.setAttribute('style','overflow:hidden');
        let loaderTag = document.createElement('div');
        loaderTag.setAttribute('id','loader');
        body.appendChild(loaderTag);
        
        window.parent.postMessage(msg, "*");
      }
      else
      {
        root.setAttribute('style','display:block');

        body.setAttribute('style','');
        body.removeChild(document.getElementById('loader'));
        window.parent.postMessage(msg, "*");
      }
    }
    
    function npm_reload(npm_libs)
    {
      if(window.prev_libs !== undefined) // Make Delete List
      {
        let del_list = window.prev_libs.filter((p) => !npm_libs.some((v) => p === v));
        del_list.forEach((v) => {
          delete window[v];
        })
      }

      window.prev_libs = npm_libs;
      let npm_string = npm_libs.map((v) => \`const {default: \${v.replace(/-/g,"")}} = await import('https://dev.jspm.io/\${v}');window.\${v.replace(/-/g,"")} = \${v.replace(/-/g,"")};\`).join('\\n');
      
      let scriptTag = document.createElement('script');
      scriptTag.setAttribute('id','module');
      scriptTag.setAttribute('type','module');
      scriptTag.textContent = \`(async () => {

        onSpinner(true,"load_start");
        try{

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

        //-- Added Module --
        \${npm_string}
        //---------------
         onSpinner(false,"load_end");
        }
        catch(e)
        {
          onSpinner(false,"error");
        }
        finally {
          if(window.App !== undefined)
          ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
          let head = document.getElementsByTagName('head')[0];
          head.removeChild(document.getElementById('module'));
        }
        
      })();\`;
      
        let head = document.getElementsByTagName('head')[0];
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
    

    function css_reload(urls)
    {
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
        });

        link_arr.forEach((link) =>{
          let del_check = urls.every((url) => link.href !== url);
          if(del_check === true)
          {
            head.removeChild(link);
          }
        });

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

export  const IFrame = memo(function IFrame({ code, lib,css }) {
    const [load,SetLoad] = useState(false);

    const ref = useRef();
    console.log('렌더링');

    function onLoad() {
      ref.current.contentWindow.npm_reload(lib);
      ref.current.contentWindow.jsx_reload(code);
      ref.current.contentWindow.css_reload(css);
      SetLoad(true);
    }

    useEffect(()=>{ // When lib is added

      if(load)
        ref.current.contentWindow.npm_reload(lib);
    },[lib]);

    useEffect(()=>{ // When lib is added
      if(load)
        ref.current.contentWindow.css_reload(css);
    },[css]);

    return useMemo(() => {
      return (<iframe id='frame' ref={ref} onLoad={onLoad} style={{ width: '50%', border: '1px solid lightgray',background:'white' }} src={createBlobUrl(SandBox_Html)} />
      )
    }, []) // First rendered, prevent re-rendering
  });
  
  