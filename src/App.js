import React,{useState, useEffect} from 'react';
import './App.css';
import List from './components/ExpenseList';
import Form from './components/ExpenseForm';
import Alert from './components/Alert';
import uuid from 'uuid/v4';

// const initialExpense = [
//   {id: uuid(), charge: 'rent', amount: 1600},
//   {id: uuid(), charge: 'car payment', amount: 600},
//   {id: uuid(), charge: 'credit card bill', amount: 1200},
// ];

const  initialExpense = localStorage.getItem("expenses")? JSON.parse(localStorage.getItem("expenses")) : [];

function App() {
  //************ state values ********* */
 //all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpense);
 //singel expense 
  const [charge, setCharge] = useState('');
 //singel amount
 const [amount, setAmount] = useState('');
 //alert
 const [alert, setAlert] = useState({show:false});
 //************** functionality *********** */
//edit
const [edit, setEdit] = useState(false);
//edite item
const [id, setId] = useState(0);
//
//************* useEffect ********** */
useEffect(()=>{

  localStorage.setItem('expenses', JSON.stringify(expenses));
}, [expenses]);
//******* ******   ******** */
 const handleCharge = e => {
  setCharge(e.target.value);
};
const handleAmount = e => {
  setAmount(e.target.value);
};
//handlesubmit
//handle Alert
const handleAlert = ({type, text}) =>{
  setAlert({show: true, type, text});
  setTimeout(()=>{
    setAlert({show:false})
  }, 3000);
}
//handlesubmit
const handleSubmit = e => {
  e.preventDefault();

  if(charge !== "" && amount > 0){
    if(edit){
      let tempExpenses = expenses.map((item) =>{
        return item.id === id? {...item,charge,amount} : item
      });
      setExpenses(tempExpenses);
      setEdit(false);
      handleAlert({type: "success", text: "item edited"});
    }
    else{
    const singleExpense = {id: uuid(), charge, amount};
    setExpenses([...expenses,singleExpense]);
    handleAlert({type: "success", text: "item added"});
    }
    setCharge("");
    setAmount("");
  }else{
    handleAlert({
      type: "danger",
      text: `charge can't empty value and value has to be bigger than zero`
    });
  }
};
//clear all items
const clearItems = () => {
  setExpenses([]);
  handleAlert({ type: "danger", text: "All Item deleted"});
}

//handle delete
const handleDelete = id =>{
  let tempExpenses = expenses.filter(item => item.id !== id);
  setExpenses(tempExpenses);
  handleAlert({ type: "danger", text: "Item deleted"});
}
//handle edit
const handleEdit = id =>{
  let expense = expenses.find(item => item.id === id);
  let {charge, amount} = expense;
  setCharge(charge);
  setAmount(amount);
  setEdit(true);
  setId(id);
}
  return (
    <>
    {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>Budget calculator</h1>
      <main className="App">
        <Form 
          charge={charge} 
          amount={amount} 
          handleAmount={handleAmount} 
          handleCharge={handleCharge} 
          handleSubmit={handleSubmit}
          edit={edit} 
        />
        <List 
          expenses={expenses} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
          clearItems={clearItems} 
        />
      </main>
      <h1>
        total spending: <span className="total">
          $ {expenses.reduce((acc, curr)=>{
              return (acc += parseInt(curr.amount));
          },0)}
        </span>
      </h1>
    </>
  );
}

export default App;
