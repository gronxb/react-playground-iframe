import React, { useState, useContext, useEffect } from 'react';
import { MinusSquareOutlined, GithubOutlined } from '@ant-design/icons';
import { SearchTree } from './TreeView';
import { Input, message } from 'antd';

import styled from "styled-components"
import { IFrameContext } from './IFrameProvider';
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
    const [EnterBlock, SetBlock] = useState(false);

    function onEnter(e) {
        if (Text === "") return;
        if (EnterBlock === true) {
            message.warning('Module cannot be added while loading.');
            return;
        }
        SetText('');
        callback(Text);
    }

    useEffect(() => {
        if (IframeData.iframe_npm_load === 'load_start') {
            SetBlock(true);
        }
        else {
            SetBlock(false);
        }
    }, [IframeData.iframe_npm_load]);

    function onChange(e) {
        SetText(e.target.value);
    }
    return (
        <div style={{ marginTop: '20px', marginBottom: '10px', paddingBottom: '10px', display: 'flex', flexDirection: 'column', borderBottom: '1px solid lightgrey' }}>
            <Input style={{ marginBottom: '10px' }} placeholder={placeholder} onPressEnter={onEnter} onChange={onChange} value={Text} />
            {item.map((v, i) =>
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
export function Sidebar({ modules, SetModule, css, SetCSS }) {
    const IframeData = useContext(IFrameContext);
    useEffect(() => {

        if (IframeData.iframe_npm_load === 'error') {
            message.error('Failed to load NPM module.')
            SetModule(modules.splice(0, modules.length - 1));
        }

    }, [IframeData.iframe_npm_load]);


    return (
        <div style={{ paddingLeft: '10px', paddingRight: '20px' }}>
            <Logo>
                <a style={{ color: 'black' }} href="https://github.com/gron1gh1/react-iframe-for-playground" target="_blank"><GithubOutlined /> react-iframe-for-playground</a>
            </Logo>
            <Loader placeholder="Input NPM Module Name"
                callback={(Text) => {
                    SetModule([...modules, Text]);
                    console.log('Text',IframeData.code);
                    document.getElementById('frame').contentWindow.jsx_reload(IframeData.code);
                }}
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