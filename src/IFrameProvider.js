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
  const [state, SetState] = useState({name: 'init',msg:''});
  useEffect(() => { // Step 2. TransCode in blobHTML 
    let load_func = document.getElementById('frame').contentWindow.jsx_reload;
    if (load_func) {
      try {
        load_func(code);
      }
      catch (e) {
      }
    }
  }, [code]);

  useEffect(() => {
      switch(state.name){
        case 'error':
          let load_func = document.getElementById('frame').contentWindow.jsx_reload;
          load_func(transform(ErrorComponent(state.msg)).code);
          break;
      }
  },[state]);

  useEffect(() => {
    window.onmessage = (e) => {
      if (typeof e.data === 'string')
      if(e.data.indexOf(':') !== -1)
        SetState({
          name: e.data.substr(0,e.data.indexOf(':')),
          msg:e.data.substr(e.data.indexOf(':') + 1)
        });
      else
      SetState({name: e.data,msg:''});
    };
  }, []);

  const provider = { code, SetCode, state };
  return (
    <IFrameContext.Provider value={provider}>
      {children}
    </IFrameContext.Provider>
  )
}