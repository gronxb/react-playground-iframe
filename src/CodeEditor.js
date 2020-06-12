import React, { useEffect, useState, useContext } from 'react';
import { IFrameContext } from './IFrameProvider';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism.css';
import './CodeEditor.css';

export function CodeEditor({ InitCode }) {
  const IframeData = useContext(IFrameContext);
  const [Code, SetCode] = useState(InitCode);

  function textarea_onChange(input_code) {
    SetCode(input_code);
  }

  useEffect(() => { // Step 1. Code To TransCode 
    IframeData.SetCode(Code);
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
