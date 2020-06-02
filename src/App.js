import React, { useState, useContext, useMemo, useEffect } from 'react';
import { transform } from 'buble';
import axios from 'axios';
import 'antd/dist/antd.css';
import { Tree } from 'antd';

import "./style.css";

import { IFrameProvider, IFrameContext } from './IFrameProvider';
import { IFrame } from './IFrame';
import { CodeEditor } from './CodeEditor';
const { TreeNode } = Tree;

function getNpmData(lib)// ImportNPM to Tree Data
{
    let main = document.getElementById('frame').contentWindow;
    let npm_infos = ImportNPM(lib);

    let treeData = npm_infos.map((v) => {
  
      return {
        title: v.name,
        key: v.name,
        children: Object.keys(v.module).map(m => {
          return {
            title: m,
            key: v.name + '-' + m,
          }
        })
      }
    });
  //  IframeData.SetData(treeData, 'PUSH');
    console.log('treeData', treeData);
    return treeData;
}

function ImportNPM(lib_names) { // Import NPM Module imported within <iframe>
  let all = Object.keys(document.getElementById('frame').contentWindow);
  return all.filter((v) => lib_names.some((a) => {

    return a.replace(/-/g,"") === v;
  })).map((v) => {
    return {
      name: v,
      module: document.getElementById('frame').contentWindow[v]
    }
  });
}

const TreeView = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const get_data = useContext(IFrameContext).data;
  const [data,setData] = useState([{
    title: 'NPM Module',
    key: 'NPM Module',
    children: [],
}]);
  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys);
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    if(info.node.title === "NPM Module")
    {
      
      setData([{
        title: 'NPM Module',
        key: 'NPM Module',
        children: getNpmData(['antd', 'reactstrap','react-custom-scroll']),
    }]);
    }
    setSelectedKeys(selectedKeys);
  };
useEffect(()=>{
console.log('dt',data);
},[data])
  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={data}
    />
  );
};

function App() {

  const InitCode = `
  function App()
  {
    const [idx,SetIdx] = React.useState(0);
    return (
      <div>
        <antd.Button type="primary" onClick={()=> SetIdx(idx+1)}>{idx}</antd.Button>

      </div>
    )
  }
  `

    return (
      <IFrameProvider>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <CodeEditor InitCode={InitCode} />
            </div>
            <IFrame code={transform(InitCode).code} lib={['antd', 'reactstrap','react-custom-scroll']} />
          </div>
          <input type="text" id="text" />
          <div style={{ display: 'flex' }}>
            <button onClick={() => {
              let text = document.getElementById('text').value;
              axios.get(`http://unpkg.com/${text}`).then((v) => console.log(v));
            }}>Test</button>

            <TreeView />
          </div>
        </div>
      </IFrameProvider>
    )
}

export default App;
