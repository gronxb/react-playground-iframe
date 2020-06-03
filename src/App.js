import React, { useState, useContext, useMemo, useEffect } from 'react';
import { transform } from 'buble';
import { Row, Col, Input, Card } from 'antd';
import {MinusSquareOutlined} from '@ant-design/icons';

import "./style.css";

import { IFrameProvider, IFrameContext } from './IFrameProvider';
import { IFrame } from './IFrame';
import { CodeEditor } from './CodeEditor';
import { SearchTree } from './TreeView';



function NpmLoader() {
  const [Text,SetText] = useState('');
  const [Module,SetModule] = useState([]);
  function onEnter(e)
  {
    SetModule([...Module,Text]);
    SetText('');
  }

  function onChange(e)
  {
    SetText(e.target.value);
  }
  return (
    <div style={{marginTop:'20px',marginBottom:'20px',display:'flex',flexDirection:'column'}}>
      <Input style={{marginBottom:'10px'}} placeholder="Input NPM Module Name" onPressEnter={onEnter} onChange={onChange} value={Text}/>
      {Module.map((v) =>
          <span style={{marginLeft:'10px'}}><MinusSquareOutlined style={{marginRight:"10px"}}/>{v}</span>
      
      )}
    </div>

  )
}

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
      <Row style={{ height: '100vh' }}>
        <Col flex="264px" style={{ background: 'white', height: '100vh', overflowY: 'scroll' }}>
          <NpmLoader />
          <SearchTree />
        </Col>
        <Col flex="auto" style={{
          background: 'lightgray',
          height: '100vh',
          overflowY: 'scroll'
        }}>

          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <CodeEditor InitCode={InitCode} />
            </div>
            <IFrame code={transform(InitCode).code} lib={['antd', 'reactstrap', 'react-custom-scroll']} />
          </div>

        </Col>
      </Row>
    </IFrameProvider>
  )
}

export default App;
