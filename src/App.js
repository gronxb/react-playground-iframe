import React,{useEffect,useState} from 'react';
import ReactDOMServer from 'react-dom/server';


function Button()
{
  const [idx,SetIdx] = useState(0);
  return (
    <div>
      <Button type="primary" onClick={()=> SetIdx(idx+1)}>{idx}</Button>
    </div>
  )
}

function Frame()
{
  const [Src,SetSrc] = useState();

  function createBlobUrl(html)
  {
    let blob = new Blob([html], {
        type: 'text/html',
        endings: 'native'
    });
    return URL.createObjectURL(blob);
  }

  useEffect(()=>{
    SetSrc(createBlobUrl(`
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
          <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
          <script src="https://unpkg.com/antd@4.2.5/dist/antd.min.js" crossorigin></script>
          <link rel="stylesheet" href="https://unpkg.com/antd@4.2.5/dist/antd.css">
          <script>


          function App()
          {
            var ref = React.useState(0);
            var idx = ref[0];
            var SetIdx = ref[1];
            return (
              React.createElement( 'div', null,
                React.createElement( antd.Button, { type: "primary", onClick: function (){ return SetIdx(idx+1); } }, idx)
              )
            )
          }

          window.onload = () => {
            console.log(React.createElement)
            ReactDOM.render(React.createElement( App, null ), document.getElementById('root'));
          }
          </script>
        </head>
        <body>
          <div id="root"></div>
          
        </body>
    </html>
    `));
  },[])

  return (
    <iframe style={{width:'1024px', height:'768px' ,border: '1px solid black'}} src={Src}>

    </iframe>
  )
}

function App() {

  return (
    <div className="App">
      <Frame />
    </div>
  );
}

export default App;
