import React, { useState, createContext, useEffect } from 'react';
import produce from 'immer';

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
    const [data, _SetData] = useState([{
        title: 'NPM Module',
        key: 'NPM Module',
        children: [],
    }]);

    const [code, SetCode] = useState('');
    const [iframe_npm_load,SetLoad] = useState('init');
    const SetData = (value,action) => _SetData(produce(data, draft => {
        switch (action) {
            case 'PUSH':
                draft[0].children.push(...value);
                break;
        }
    }));

    
    useEffect(()=>{
      window.onmessage = (e)=>{
        if(e.data === 'load_end')
          SetLoad('load_end');
        if(e.data === 'load_start')
          SetLoad('load_start');
      };
    },[children]);

    const provider = { data, SetData,code,SetCode,iframe_npm_load };
    return (
        <IFrameContext.Provider value={provider}>
            {children}
        </IFrameContext.Provider>
    )
}