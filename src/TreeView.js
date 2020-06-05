import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Tree, Input,message } from 'antd';
import {IFrameContext } from './IFrameProvider';
const { Search } = Input;

const dataList = [];
const generateList = data => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key } = node;
        dataList.push({ key, title: key });
        if (node.children) {
            generateList(node.children);
        }
    }
};
const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};

function getNpmData(modules)// ImportNPM to Tree Data
{
    let npm_infos = ImportNPM(modules);

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
    console.log('treeData', treeData);
    return treeData;
}

function ImportNPM(modules) { // Import NPM Module imported within <iframe>
    let all = Object.keys(document.getElementById('frame').contentWindow);

    return all.filter((v) => modules.some((a) => {

        return a.replace(/-/g, "") === v;
    })).map((v) => {
        return {
            name: v,
            module: document.getElementById('frame').contentWindow[v]
        }
    });
}
export function SearchTree({modules}) {
    const IframeData = useContext(IFrameContext);
    const [expandedKeys, SetExpandedKeys] = useState(['NPM Module']);
    const [searchValue, SetSearchValue] = useState('');
    const [checkedKeys, SetCheckedKeys] = useState([]);
    const [autoExpandParent, SetAutoExpandParent] = useState(true);
    const [selectedKeys, SetSelectedKeys] = useState([]);
    const [Data, SetData] = useState([{
        title: 'NPM Module',
        key: 'NPM Module',
        children: [],
    }]);
    const onExpand = expandedKeys => {
        console.log(expandedKeys);
        SetExpandedKeys(expandedKeys);
        SetAutoExpandParent(false);
    };
    useEffect(() => {
        dataList.splice(0, dataList.length);
        generateList(Data);
    }, [Data]);

    const onChange = e => {
        const { value } = e.target;
        const expandedKeys = dataList
            .map(item => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, Data);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        SetExpandedKeys(expandedKeys);
        SetSearchValue(value);
        SetAutoExpandParent(true);
    };

    const loop = data =>
        data.map(item => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span className="site-tree-search-value">{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                        <span>{item.title}</span>
                    );
            if (item.children) {
                return { title, key: item.key, children: loop(item.children) };
            }

            return {
                title,
                key: item.key,
            };
        });

    const onSelect = (selectedKeys, info) => {
        SetSelectedKeys(selectedKeys);
    };

    useEffect(()=>{
        if(IframeData.iframe_npm_load === 'load_end')
        {
            message.success('Success NPM Module Load!')
            SetData([{
                title: 'NPM Module',
                key: 'NPM Module',
                children: getNpmData(modules),
            }]);
        }
    },[IframeData.iframe_npm_load]);

    const onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        SetCheckedKeys(checkedKeys);
    };

    return (
        <div>
            <Search style={{ marginBottom: 8 }} placeholder="Imported NPM module Finder" onChange={onChange} />
            <Tree
                checkable
                
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={loop(Data)}
                selectedKeys={selectedKeys}
                onSelect={onSelect}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
            />
        </div>
    )
}
