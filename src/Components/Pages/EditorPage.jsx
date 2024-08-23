import React, { useState, useEffect,useRef} from 'react';
import AceEditor from 'react-ace';
import io from 'socket.io-client';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools'; 
import { ColorRing } from 'react-loader-spinner'
import Output from './CodeOutputBox';
import TimeComplexity from '../TimeComplexity';
const socket = io("https://code-compiler-1.onrender.com/", { transports: ["websocket"] });
import {useNavigate} from 'react-router-dom';
const CodeEditor = ({ language, languageName,basicCode,path}) => {
  const [code, setCode] = useState(basicCode);
  const [output, setOutput] = useState(``);
  const [id,setId]=useState(``);
  const [nextUrl, setNextUrl]=useState(null);
  const [switchLan,setSwitchLan]=useState(path);
  const editorRef = useRef(null);
  const usenavigate=useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      editor.getSession().setUseWrapMode(true); // Enable word wrapping

    }
  }, []);
  useEffect(() => {
    const handleOutput = (data) => {
      setOutput((prev) => prev+data);
      setId(socket.id);
      setIsLoading(false);
    };

    socket.on("output", handleOutput);
    return () => {
      socket.off("output", handleOutput);
    };
  }, []);
  const handleRun = () => {
    console.log("Code",code)
    setIsLoading(true);
    setOutput('');
    console.log(languageName);
    socket.emit("runCode", { code, sendLanguage:languageName });
  };
  const navigateHandle=(e)=>{
    const name=e.currentTarget.getAttribute('name');
    const location=window.location.href.split(switchLan)[0];
    setNextUrl(location)
    console.log(languageName);
    setSwitchLan(name);
  }
  const inputHandler=(input)=>{
    console.log("from output side input");
    console.log(input);
    socket.emit('inputValue',input);
    setOutput(prev=>prev+input+'\n');
  }
  const AnalyzeCode=()=>{
    usenavigate('/analysis');
  }
  return (
    <div style={styles.container}>
      <h2 style={{color:'black',textAlign:'center',marginTop:'5px'}}>Online {language==="c_cpp"? languageName==="c" ? "C" :"CPP":language} Code Editor</h2>
        <div style={styles.containerBox}>
          <div style={styles.LanguageIcon}>
            <div style={styles.LanIcons}><a href={`${nextUrl}python-programming`} onClick={navigateHandle} name="python-programming" title='Py'><img src='python.png' alt='py' style={{height:'30px',width:'30px',objectFit:'fill'}}/></a></div>
            <div style={styles.LanIcons}><a href={`${nextUrl}c-programming`} onClick={navigateHandle} name="c-programming" title='C'><img src='letter-c.png' style={{height:'30px',width:'30px' ,objectFit:'fill'}}/></a></div>
            <div style={styles.LanIcons}><a href={`${nextUrl}cpp-programming`} onClick={navigateHandle} name="cpp-programming" title='Cpp'><img src='c-.png' alt='CPP' style={{height:'30px',width:'30px',objectFit:'fill'}}/></a></div>
            <div style={styles.LanIcons}><a href={`${nextUrl}java-programming`} onClick={navigateHandle} name="java-programming" title='Java'><img src='java.png' style={{height:'30px',width:'30px',objectFit:'fill'}}/></a></div>
            <div style={styles.LanIcons}><a href={`${nextUrl}javascript-programming`} onClick={navigateHandle} name="javascript-programming" title='Js'><img src='java-script.png' style={{height:'30px',width:'30px',objectFit:'fill'}}/></a></div>
          </div>
         <div>
           <div style={styles.btnSection}>
             <button onClick={AnalyzeCode} style={styles.runButton}>
                {'Analyse'}
              </button>
             <button onClick={handleRun} disabled={isLoading} style={styles.runButton}>
                {isLoading ?<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}> <ColorRing
                  visible={true}
                  height={'40'}
                  width={'40'}
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                  /></div>: 'RUN'}
              </button>
           </div>
           <div style={styles.editorBox}>
           <AceEditor
             mode={language}
             theme="textmate"
             onLoad={(editor) => console.log(editor)}
             onChange={(e)=>setCode(e)}
             fontSize={16}
             value={code}
             setOptions={{ 
               enableBasicAutocompletion: true,
               enableLiveAutocompletion: true,
               tabSize:2,

             }}
             ref={editorRef}
             style={{ width: '50vw',height:'92vh',overflowX:'auto' }}
           />
           <Output value={output} ids={isLoading ? "":id} inputFunction={inputHandler}></Output>
           </div>
         </div>
        </div>
    </div>
  );
};

const styles = {
    editorBox:{
      borderTop: '3px solid #ccc',
        display:'flex',
        flexDirection:'row'
    },
  container: {
    paddingLeft:'10px',
    position: 'fixed',
    fontFamily: 'Arial, sans-serif',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  containerBox:{
    display:'flex',
    flexDirection:'row',
  },
  btnSection:{
    display:'flex',
    flexDirection:'row',
    alignItems:'end',
    justifyContent:'end',
  },
  runButton: {
    // padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    marginRight:'10px',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    height:'40px',
    width:'100px',
    transition: 'background-color 0.3s ease',
  },
  LanguageIcon:{
    display:'flex',
    flexDirection:'column',
    width:'50px',
    height:'50px'
  },
  LanIcons:{
    backgroundColor: 'white',
    paddingLeft:'4px',
    paddingRight:'2px',
    paddingTop:'4px',
    borderRadius:'5px',
    marginTop:'10px',
    boxShadow:'0px 0px 5px grey',
    marginRight:'10px',
  }
};

export default CodeEditor;
