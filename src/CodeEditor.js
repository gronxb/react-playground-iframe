import React, { useEffect, useState, useCallback, useRef, useContext, memo, useSelector, useMemo } from 'react';
import {  IFrameContext } from './IFrameProvider';
import Editor from 'react-simple-code-editor';
import { transform } from 'buble';
import {ErrorComponent} from './ErrorComponent';
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
  
    useEffect(() => { // Step 1. Code To TransCode 
      try {
        let transcode = transform(Code).code;
        IframeData.SetCode(transcode);
      }
      catch (e) {
        let load_func = document.getElementById('frame').contentWindow.jsx_reload;
        load_func(transform(ErrorComponent(e.message)).code);
      //  IframeData.SetCode(transform(ErrorComponent(e.message)).code);
      }
    }, [Code]);
  
   
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
  