import React, { useState, useContext, useMemo, useEffect } from 'react';
import { transform } from 'buble';
import { Row, Col, Input, message } from 'antd';
import { MinusSquareOutlined ,GithubOutlined} from '@ant-design/icons';

import "./style.css";

import { IFrameProvider, IFrameContext } from './IFrameProvider';
import { IFrame } from './IFrame';
import { CodeEditor } from './CodeEditor';
import { SearchTree } from './TreeView';

import styled from "styled-components"
import { Scrollbars } from 'react-custom-scrollbars';

const Item = styled.span`
  margin-left: 10px;
  overflow:hidden;
  white-space:nowrap; 
  text-overflow: ellipsis;
  &:hover{
    cursor: pointer;
    color: Crimson;
  }
`;

const ItemIcon = styled(MinusSquareOutlined)`
  padding-right:5px;
`;

function Loader({ placeholder, callback, item, onItemClick }) {
  const IframeData = useContext(IFrameContext);

  const [Text, SetText] = useState('');
  const [EnterBlock,SetBlock] = useState(false);
  function onEnter(e) {
    if (Text === "") return;
    if(EnterBlock === true) {
      message.warning('Module cannot be added while loading.');
      return;
    }
    SetText('');
    callback(Text);
  }

  useEffect(()=>{
    if(IframeData.iframe_npm_load === 'load_start')
    {
      SetBlock(true);
    }
    else{
      SetBlock(false);
    }
  },[IframeData.iframe_npm_load]);

  function onChange(e) {
    SetText(e.target.value);
  }
  return (
    <div style={{ marginTop: '20px', marginBottom: '10px',paddingBottom:'10px', display: 'flex', flexDirection: 'column',borderBottom: '1px solid lightgrey' }}>
      <Input style={{ marginBottom: '10px' }} placeholder={placeholder} onPressEnter={onEnter} onChange={onChange} value={Text} />
      {item.map((v,i) =>
        <Item onClick={() => onItemClick(v)} key={i}><ItemIcon />{v}</Item>
      )}
    </div>

  )
}

const Logo = styled.div`
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid grey;
`;
function Sidebar({modules,SetModule,css,SetCSS}) {
  return (
    <div style={{ paddingLeft: '10px', paddingRight: '20px' }}>
      <Logo >
       <a style={{color:'black'}} href="https://github.com/gron1gh1/react-iframe-for-playground" target="_blank"><p><GithubOutlined /> react-iframe-for-playground</p></a>
      </Logo>
      <Loader placeholder="Input NPM Module Name"
        callback={(Text) => SetModule([...modules, Text])}
        item={modules}
        onItemClick={(item) => SetModule(modules.filter(m => m !== item))}
      />
      <Loader placeholder="Input CSS link"
        callback={(Text) => SetCSS([...css, Text])}
        item={css}
        onItemClick={(item) => SetCSS(css.filter(m => m !== item))}
      />
      <SearchTree modules={modules} />
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
  const [modules, SetModule] = useState(['antd']);
  const [css, SetCSS] = useState(['https://unpkg.com/antd@4.2.5/dist/antd.css']);

  return (
    <IFrameProvider>
      <Row style={{ height: '100vh' }}>
        <Col flex="264px" style={{ background: 'white', height: '100vh', borderRight: '1px solid lightgray' }}>
          <Scrollbars style={{ height: '100%'}} autoHide>
            <Sidebar modules={modules} SetModule={SetModule} css={css} SetCSS={SetCSS} />
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
