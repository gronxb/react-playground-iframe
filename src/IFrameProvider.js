import React, { useState, createContext, useEffect } from 'react';
import produce from 'immer';
import { transform } from 'buble';
import {ErrorComponent} from './ErrorComponent';

export const IFrameContext = createContext();
/*
{
        name: 'root',
        toggled: true,
        children: [
          {
            name: 'parent',
            toggled: true,
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
      }
*/

export function IFrameProvider({ children }) {


  const [code, SetCode] = useState('');
  const [iframe_npm_load, SetLoad] = useState('init');

  useEffect(() => { // Step 2. TransCode in blobHTML 
    let load_func = document.getElementById('frame').contentWindow.jsx_reload;
    if (load_func) {
      try {
        load_func(code);
      }
      catch (e) {
        load_func(transform(ErrorComponent(e.message)).code);
      }
    }
  }, [code]);


  useEffect(() => {
    window.onmessage = (e) => {
      if (typeof e.data === 'string')
        SetLoad(e.data);
    };
  }, [children]);

  const provider = { code, SetCode, iframe_npm_load };
  return (
    <IFrameContext.Provider value={provider}>
      {children}
    </IFrameContext.Provider>
  )
}