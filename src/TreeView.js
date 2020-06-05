import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Tree, Input } from 'antd';

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

        return a.replace(/-/g, "") === v;
    })).map((v) => {
        return {
            name: v,
            module: document.getElementById('frame').contentWindow[v]
        }
    });
}
export function SearchTree() {
    const [expandedKeys, SetExpandedKeys] = useState([]);
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
        SetExpandedKeys(expandedKeys);
        SetAutoExpandParent(false);
    };
    useEffect(() => {
        dataList.splice(0, dataList.length);
        generateList(Data);
    }, [Data]);
    const onChange = e => {
        const { value } = e.target;

        console.log(value, dataList);

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
        console.log('onSelect', info);
        if (info.node.key === "NPM Module") {

            SetData([{
                title: 'NPM Module',
                key: 'NPM Module',
                children: getNpmData(['antd', 'reactstrap', 'react-custom-scroll']),
            }]);
        }
        SetSelectedKeys(selectedKeys);
    };

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
