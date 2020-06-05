import React, { useEffect, useState, useCallback, useRef, useContext, memo, useSelector, useMemo } from 'react';
import {  IFrameContext } from './IFrameProvider';
import Editor from 'react-simple-code-editor';
import { transform } from 'buble';

import { highlight, languages } from 'prismjs/components/prism-core';
import '../node_modules/prismjs/components/prism-clike';
import '../node_modules/prismjs/components/prism-javascript';
import '../node_modules/prismjs/components/prism-markup';
import '../node_modules/prismjs/components/prism-jsx';
export function CodeEditor({InitCode}) {
    const IframeData = useContext(IFrameContext);
    const [Code, SetCode] = useState(InitCode);
  
    function textarea_onChange(input_code) {
      SetCode(input_code);
    }
  
    const ErrorComponent = useCallback((ErrorMessage) => `
    function App()
    {
      const err_msg = \`${ErrorMessage.replace(/`/g,"'")}\`
      return (
        <div style={{margin:"10px 10px 10px 10px"}}>
          <antd.Alert
          message="Error"
          description={err_msg}
          type="error"
          showIcon
        />
        </div>
      )
    }
  `, []);
  
    useEffect(() => { // Step 1. Code To TransCode 
      try {
        let transcode = transform(Code).code;
        IframeData.SetCode(transcode);
      }
      catch (e) {
        IframeData.SetCode(transform(ErrorComponent(e.message)).code);
      }
    }, [Code]);
  
    useEffect(() => { // Step 2. TransCode in blobHTML 
      if (IframeData === undefined) return;
      try {
        let load_func = document.getElementById('frame').contentWindow.jsx_reload;
        if (load_func) {
  
          load_func(IframeData.code);
        }
      }
      catch (e) {
        console.log('err', e);
      }
    }, [IframeData]);
  
    return (
        <Editor
          placeholder="Input React Code."
          value={Code}
          onValueChange={textarea_onChange}
          highlight={code => highlight(code, languages.jsx)}
          padding={10}
  
          className="container__editor"
        />
    )
  }
  