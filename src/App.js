import React, { useState, useContext, useMemo, useEffect } from 'react';
import { transform } from 'buble';
import {  Row, Col } from 'antd';

import "./style.css";

import { IFrameProvider, IFrameContext } from './IFrameProvider';
import { IFrame } from './IFrame';
import { CodeEditor } from './CodeEditor';
import {SearchTree} from './TreeView';

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
        <Col flex="264px" style={{ background: 'white', height: '100vh',overflowY:'scroll' }}>
          <SearchTree/>
        </Col>
        <Col flex="auto" style={{
          background: 'lightgray',
          height: '100vh',
          overflowY:'scroll'
        }}>
          
            <div style={{ display: 'flex' }}>
              <div style={{ width: '50%' }}>
                <CodeEditor InitCode={InitCode} />
              </div>
              <IFrame code={transform(InitCode).code} lib={['antd', 'reactstrap', 'react-custom-scroll']} />
            </div>
            <input type="text" id="text" />
        </Col>
      </Row>
    </IFrameProvider>
  )
}

export default App;
