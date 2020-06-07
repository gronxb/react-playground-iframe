import React, { useState, createContext, useEffect } from 'react';
import { ErrorComponent } from './ErrorComponent';
import { transform } from 'buble';

export const IFrameContext = createContext();

export function IFrameProvider({ children }) {


  const [code, SetCode] = useState('');
  const [state, SetState] = useState({ name: 'init', msg: '' });
  const [_import,SetImport] = useState([]);

  useEffect(() => {
    console.log(_import);
  }, [_import]);

  useEffect(() => { // Code To TransCode 
    try {
      let transcode = transform(code,{transforms:{moduleImport: false,letConst:false,destructuring:false}}).code;
      console.log(transcode);
      let load_func = document.getElementById('frame').contentWindow.jsx_reload;
      if(load_func)
        load_func(transcode);
    }
    catch (e) {
      console.log('use',e.message);
      ErrorComponent(e.message);
    }
  }, [code]);


  useEffect(() => { // Catch Javascript Error
    switch (state.name) {

      case 'error':
        ErrorComponent(state.msg);
        break;
    }
  }, [state]);

  useEffect(() => { // IFrame <=> Parent Message 
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

  const provider = { code, SetCode, state,_import,SetImport};
  return (
    <IFrameContext.Provider value={provider}>
      {children}
    </IFrameContext.Provider>
  )
}