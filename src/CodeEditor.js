import React, { useEffect, useState, useContext } from 'react';
import { IFrameContext } from './IFrameProvider';
import Editor from 'react-simple-code-editor';

import { ErrorComponent } from './ErrorComponent';
import { highlight, languages } from 'prismjs/components/prism-core';
import '../node_modules/prismjs/components/prism-clike';
import '../node_modules/prismjs/components/prism-javascript';
import '../node_modules/prismjs/components/prism-markup';
import '../node_modules/prismjs/components/prism-jsx';

function checkedToObject(checkedList) {
  let keys = Array.from(new Set(checkedList.map((v) => v.split('/')[0])));
  let obj = checkedList.map((v) => {
    let parse = v.split('/');
    return {
      module: parse[0],
      child: parse[1]
    }
  });
  return keys.map((v) => {
    return {
      module: v,
      child: obj.filter(o => o.module === v).map(m => m.child)
    }
  }).filter((v) => v.module !== 'NPM Module');
}

export function CodeEditor({ InitCode }) {
  const IframeData = useContext(IFrameContext);
  const [Code, SetCode] = useState(InitCode);

  function textarea_onChange(input_code) {
    SetCode(input_code);
  }

  useEffect(() => { // Step 1. Code To TransCode 
    // let _import = Code.split('\n').filter((line) => line.indexOf('import') !== -1).join('\n');
    // console.log(_import);
    IframeData.SetCode(Code);
    //IframeData.SetImport(_import);
  }, [Code]);

  useEffect(() => {
    let checkedObject = checkedToObject(IframeData.includes);
    console.log('inc', checkedObject);
    let const_str = '';
    checkedObject.forEach((v) => {
      const_str += `const {${v.child.reduce((a,b) => a + ',' + b)}} = ${v.module};\n`;
    });
    console.log(const_str);
    SetCode(const_str + Code);
  }, [IframeData.includes]);
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
