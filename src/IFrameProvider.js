import React, { useState, createContext, useEffect } from 'react';
import { ErrorComponent } from './ErrorComponent';
export const IFrameContext = createContext();

export function IFrameProvider({ children }) {


  const [code, SetCode] = useState('');
  const [state, SetState] = useState({ name: 'init', msg: '' });
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
    switch (state.name) {
      case 'error':
        ErrorComponent(state.msg);
        break;
    }
  }, [state]);

  useEffect(() => {
    window.onmessage = (e) => {
      if (typeof e.data === 'string')
        if (e.data.indexOf(':') !== -1)
          SetState({
            name: e.data.substr(0, e.data.indexOf(':')),
            msg: e.data.substr(e.data.indexOf(':') + 1)
          });
        else
          SetState({ name: e.data, msg: '' });
    };
  }, []);

  const provider = { code, SetCode, state };
  return (
    <IFrameContext.Provider value={provider}>
      {children}
    </IFrameContext.Provider>
  )
}