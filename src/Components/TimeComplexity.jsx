// import React ,{useState}from 'react';
// import AceEditor from 'react-ace'
// import 'ace-builds/src-noconflict/theme-textmate';
// import {useNavigate} from 'react-router-dom';
// import axios from 'axios';
// const TimeComplexity =()=>{
//   const [code,setCode]=useState('');
//   const [output,setOutput]=useState('');
//   const navigate=useNavigate();
//   const clickHandler=async()=>{
//     const response=await axios({url:'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBu2K_ZHnwa2w4QeSYXSEbAAQ2o_MLQX08',
//       method:'post',
//       data:{
//         contents:[{"parts":[{"text":`${code} Analyze the time and space complexity of the given code for integer data in JSON format. Provide the time complexity expression and its computed integer value for n=20.include a brief explanation not exceeding 50 words.`}]}]
//       }
//     });
//     const data=response.data.candidates[0].content.parts[0].text;
//     console.log(data);
//     setOutput(data);
    
//   }
//   return (
//     <div>
//       <button onClick={clickHandler}>
//         Chart
//       </button>
//       <AceEditor
//         mode='text'
//         theme="textmate"
//         onLoad={(editor) => console.log(editor)}
//         onChange={setCode}
//         fontSize={16}
//         value={code}
//         setOptions={{ 
//           enableBasicAutocompletion: false,
//           enableLiveAutocompletion: false,
//           tabSize:2,

//         }}
//         style={{ width: '100vw',overflowX:'auto' }}
//       />
//       <div style={{
//       margin:'20px',
//       padding:'5px',
//       boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
//       backgroundColor: 'white',
//       color: 'black',
//       borderRadius: '5px',
//       }}>
//         {output}
//       </div>
//     </div>
//   );

// }
// export default TimeComplexity; 
import React, { useState,useRef,useEffect} from 'react';
import './TimeComplexity.css';
import axios from 'axios';
import ComplexityGraph from './ChartPage';
import './modal.css'
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
const LanguageDetectEditor = () => {
  
  const [mode, setMode] = useState('text');
  const [code, setCode] = useState('');
  const [output,setOutput]=useState('');
  const [isresonse,setIsresonse]=useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectTimeComplexity, setSelectTimeComplexity] = useState('');
  const [complexityData, setComplexityData]=useState([]);
  const editorRef = useRef(null);
  const mySecret = import.meta.env['ChandanGeminiApi']
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      editor.getSession().setUseWrapMode(true); // Enable word wrapping
      
    }
  }, []);
  const detectLanguage = (text) => {
    setCode(text);
    if (text.includes('vector')||text.includes('#include') || text.includes('int main(') || text.includes('std::') || text.includes('using namespace')) {
      setMode('c_cpp');
    } else if (text.includes('def ') || text.includes('print(')) {
      setMode('python')
    } else if (text.includes('function') || text.includes('console.log(')) {
      setMode('javascript')
    } else if (text.includes('public class') || text.includes('System.out.println(')) {
      setMode('java');
    }
    // Add more patterns for other languages as needed
    return 'text';
  };
  function extractJSON(data) {
      const jsonStartIndex = data.indexOf('{');
      const jsonEndIndex = data.lastIndexOf('}') + 1; // Include the last closing brace
      const jsonText = data.slice(jsonStartIndex-1, jsonEndIndex+1);
      return jsonText;
  }
  const handleComplexity=async()=>{
    
    try{
      setIsresonse(false);
      const response=await axios({url:`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBu2K_ZHnwa2w4QeSYXSEbAAQ2o_MLQX08`,
        method:'post',
        data:{
          contents:[{"parts":[{"text":`${code} Analyze the time and space complexity of the provided algorithm, which processes integer data in JSON format. Using time complexity expression compute integer values for each n from 0 to 20 to store in Array Compute accurate same like y=expression. with explanation within the 75 words not more than 50 words. Provide a JSON output with the following structure:
      {
      "time_complexity_expression": "<expression>",
      "space_complexity": "<expression>",
      "computed_values": [<list of values for n=0 to 20>],
      "explanation":"",
      }`}]}]
        }
      });
      setIsresonse(true);
      console.log(response)
      if(response.status==200){
        const data=response.data.candidates[0].content.parts[0].text;
        const jsonData=extractJSON(data);
        const complexityData=JSON.parse(jsonData);
        setComplexityData(complexityData['computed_values']);
      setSelectTimeComplexity(complexityData['time_complexity_expression']);
        console.log(jsonData);
        setOutput(jsonData);
      }else{
        setOutput('Something went wrong');
      }
      
    }catch(err){
      console.log("Error ",String(err));
    }
    
  }
  
  return (
    <div className="Container">
      <h2>Time Complexity And Space Complexity Analysis</h2>
      <div className='TimeComplexityContainer'>
        <button className='AnalyzeBtn' onClick={handleOpenModal}>Graph</button>
        <AceEditor
          mode={mode}
          placeholder='Enter The code for analysing the time and space complexity'
          value={code}
          fontSize={16}
          theme="monokai"
          ref={editorRef}
          name="language-detect-editor"
          onChange= {(value)=>detectLanguage(value)}
          editorProps={{ $blockScrolling: true }}
          style={{
            width:'60vw',
            wordBreak:'break-word',
            whiteSpace:'pre-wrap',
            overflowX:'hidden',
          }}
        ></AceEditor>
        <button className="AnalyzeBtn" onClick={handleComplexity}>Analyze</button>
        {
          isresonse? <div className="responseOutput">
            {output}
          </div>
          :null
        }
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <h2>Time Complexity</h2>
            <h3 style={{marginTop:'5px'}}>{selectTimeComplexity}</h3>
            <ComplexityGraph timeComplexity={selectTimeComplexity} value={complexityData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDetectEditor;