import React, { useState, createContext } from 'react';
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

    const SetData = (value,action) => _SetData(produce(data, draft => {
        switch (action) {
            case 'PUSH':
                draft[0].children.push(...value);
                break;
        }
    }));


    const provider = { data, SetData,code,SetCode };
    return (
        <IFrameContext.Provider value={provider}>
            {children}
        </IFrameContext.Provider>
    )
}