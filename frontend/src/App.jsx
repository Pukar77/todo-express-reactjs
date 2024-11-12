import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [data, setData] = useState({
    task: ''
  });

  const getdata = async () => {
    try {
      let response = await fetch("http://localhost:8000/api/todos");
      if (!response.ok) throw new Error("Failed to fetch data");

      let data1 = await response.json();
      console.log("Fetched data:", data1.data);
      setTodos(data1.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

let insertintofile= async()=>{
let response = await fetch("http://localhost:8000/api/inserttodo",{
  method:"post",
  headers:{
    "Content-Type" : "application/json"
  },
  body:JSON.stringify({
   message:data.task
  })



});
let data2 = await response.json();
if(response.ok){

  getdata();
}
console.log(data2);
}

  function gofile(e) {
    e.preventDefault();
    console.log("Form submitted with data:", data);
    insertintofile();
    setData({task:''})
  }

  

  function handelinput(e) {
    let name = e.target.name;
    let value = e.target.value;

    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  }




  const deletefromfile =async (id)=>{
let response = await fetch(`http://localhost:8000/api/deletetodo/${id}`,{
  method:"delete",
  headers:{
    "Content-Type" : "application/json"
  },


});
if(response.ok){
  getdata();
}







  }

  const modifytodo = async (id) => {
    let editedtodo = prompt("Enter new todo");
  
    // Check if editedtodo is not empty or null
    if (!editedtodo) {
      alert("Please enter a valid todo.");
      return;
    }
  
    try {
      let response = await fetch(`http://localhost:8000/api/modifytodo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newtask: editedtodo,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      } else {
        // Optionally, refresh data after successful modification
        getdata();
        alert("Todo modified successfully");
      }
    } catch (error) {
      console.error("Error modifying todo:", error);
      alert("Failed to modify todo.");
    }
  };
  

  return (
    <>

    
<div className="container">
  <form onSubmit={gofile}>
    <input
      type="text"
      name="task"
      placeholder="Enter your task"
      value={data.task}
      onChange={handelinput}
    />
    <button type="submit">Add task</button>
  </form>
  <div className="task-list">
    {todos && todos.length > 0
      ? todos.map((item, index) => (
          <div className="task-item" key={index}>
            {item.message}
            <div className="button-group">
            <button onClick={()=>{deletefromfile(item.id)}} className="delete-button">Delete</button>

            <button onClick={()=>{modifytodo(item.id)}} className="modify-button">Modify</button>
          </div>
          </div>
        ))
      : "Loading data..."}
  </div>
</div>



    </>
  );
}

export default App;
