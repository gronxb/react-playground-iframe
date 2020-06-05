import React, { useState, useContext, useMemo, useEffect } from 'react';
import { transform } from 'buble';
import { Row, Col, Input, Card } from 'antd';
import { MinusSquareOutlined } from '@ant-design/icons';

import "./style.css";

import { IFrameProvider, IFrameContext } from './IFrameProvider';
import { IFrame } from './IFrame';
import { CodeEditor } from './CodeEditor';
import { SearchTree } from './TreeView';

import styled from "styled-components"
import { Scrollbars } from 'react-custom-scrollbars';

const Item = styled.span`
  margin-left: 10px;

  &:hover{
    cursor: pointer;
    color: Crimson;
  }
`;

const ItemIcon = styled(MinusSquareOutlined)`
  padding-right:5px;
`;

function Loader({ placeholder,callback,item,onItemClick }) {
  const [Text, SetText] = useState('');
  function onEnter(e) {
    if (Text === "") return;
    SetText('');
    callback(Text);
  }

  function onChange(e) {
    SetText(e.target.value);
  }
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
      <Input style={{ marginBottom: '10px' }} placeholder={placeholder} onPressEnter={onEnter} onChange={onChange} value={Text} />
      {item.map((v) =>
        <Item onClick={()=>onItemClick(v)}><ItemIcon />{v}</Item>
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
  const [modules,SetModule] = useState(['antd']);
  const [css,SetCSS] = useState(['https://unpkg.com/antd@4.2.5/dist/antd.css']);
  return (
    <IFrameProvider>
      <Row style={{ height: '100vh' }}>
        <Col flex="264px" style={{ background: 'white', height: '100vh', borderRight: '1px solid lightgray' }}>
          <Scrollbars style={{ height: '100%' }} autoHide>
            <div style={{ paddingLeft: '10px', paddingRight: '20px' }}>
              <Loader placeholder="Input NPM Module Name" 
              callback={(Text)=>SetModule([...modules,Text])}
              item={modules}
              onItemClick={(item)=> SetModule(modules.filter(m => m !== item))}
              />
              <Loader placeholder="Input CSS link"
              callback={(Text)=>SetCSS([...css,Text])}
              item={css}
              onItemClick={(item)=> SetCSS(css.filter(m => m !== item))}
              />
              <SearchTree />
            </div>
          </Scrollbars>
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
            <IFrame code={transform(InitCode).code} lib={modules} css={css} />
          </div>

        </Col>
      </Row>
    </IFrameProvider>
  )
}

export default App;
