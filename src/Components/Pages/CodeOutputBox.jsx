// src/Components/Output.jsx

import React, { useEffect, useState,useRef } from 'react';
import io from 'socket.io-client';
import AceEditor from 'react-ace'
import './CodeOutput.css';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools'; 
const socket = io("https://code-compiler-1.onrender.com/", { transports: ["websocket"] });
const Output = ({ value,inputFunction,ids}) => {
  const [text, setText] = useState(''); // Initially set to an empty string
  const [inputs,setInput]=useState(``);
  const [isDisabled, setIsDisabled] = useState(true);
  const textAreaRef = useRef(null);
  useEffect(() => {
    setText(value) // Set the state whenever the `value` prop changes
    if(value.length!==0){
      setIsDisabled(false);
    }
    if(value.includes('Existed code With 0')){
      setIsDisabled(true);
    }
  }, [value]); // Dependency array includes `value` to track changes
  useEffect(()=>{
    if(!isDisabled && textAreaRef.current){
      textAreaRef.current.focus();
    }
  },[isDisabled]);
  const pressHandler =(event) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      console.log("Pressedd")
      if(inputs.length!==0){
        console.log("not zero")
        // setText(prev=>prev+inputs);
        inputFunction(inputs);
        setInput('');
      }
    }
  };
  const changeHandle=(e)=>{
    setInput(e.target.value);
  }
  return (
    <div style={styles.container}>
      <div>
        <pre style={styles.output}>{ids}</pre>
        <br/>
         <pre style={styles.output}>{text}</pre>
      </div>
      {/* <div>
        <AceEditor
          value={text}
          readOnly={true}
          highlightActiveLine={false}
          showGutter={false}
          fontSize={16}
          ></AceEditor>
      </div> */}
      <textarea
        ref={textAreaRef}
        autoFocus
        disabled={isDisabled}
        style={styles.Input} // Controlled component value
        onChange={changeHandle} // Update the state on change
        value={inputs}
        onKeyDown={pressHandler}  // Handle key down events
        spellCheck={'false'}
      />
    </div>
  );
};

export default Output;

const styles = {
  container: {
    margin: 0,
    padding: 0,
    paddingLeft:'5px',
    boxSizing: 'border-box',
    borderLeft:'3px solid #ccc',
    display:'flex',
    flexDirection:'column',
    justifyContent:'spaceBetween',
    height: '100vh',
    width: '45.5vw',
  },
  Input:{
    outline:'none',
    border:'none',
    resize:'none',
    caretWidth:'5px',
    backgroundColor:'white',
    overflow:'hidden',
    boxSizing: 'border-box',
    fontStyle: 'normal',
    fontWeight:'300',
    fontFamily: 'Arial, sans-serif',
    height:'300px',
    fontSize: '16px',
  },
  output:{
    fontFamily: 'monospace',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '300',
    overflow:'auto',
    whiteSpace:'pre-wrap',
    wordWrap:'break-word',

    backgroundColor:'white',
    color:'black',
    border:'none',
    resize:'none',
    boxSizing: 'border-box',
  }
  // output: {
  //   width: '100%', // Take full width of the container // Take full height of the container
  //   resize: 'none',
  //   overflow: 'auto',
  //   borderTop: 'none', // Default border
  //   borderRight: 'none', // Default border
  //   borderBottom: 'none', // Default border
  //   borderLeft: '3px solid #ccc', // Always visible border on the left
  //   fontFamily: 'monospace',
  //   fontSize: '20px',
  //   fontWeight: '600',
  //   outline:'none',
  //   whiteSpace: 'pre-wrap', // Corrected property name
  //   padding: '0', // Ensure no padding inside the textarea
  //   margin: '0', // Ensure no margin
  //   boxSizing: 'border-box', // Include border and padding in the element's total width and height
  // }
};
