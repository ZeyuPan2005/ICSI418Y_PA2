import Signup from './Signup.jsx'
import Login from './Login.jsx'
import './App.css'

// Separate components keep each form's state and submission code together and independent.
// App composes the page by placing Signup and Login under a shared heading.
function App() {
  return (
    <main>
      <h1>Programming Assignment 2</h1>
      <p>Create an account or log in. All fields are required.</p>
      <div className="forms">
        <Signup />
        <Login />
      </div>
    </main>
  )
}

export default App
