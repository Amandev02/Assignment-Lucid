import { useState, createContext } from "react";


export const UserContext = createContext()
const [logindata,setLoginData] = useState("");



useEffect(() => {
  setTimeout(()=>{
    // DashboardValid();
  },2000)

}, [])

const Context = ({children}) => {

 

return (
  <>
  <LoginContext.Provider value={{logindata,setLoginData}}>
      {children}
  </LoginContext.Provider>
  </>
)
}

export default Context