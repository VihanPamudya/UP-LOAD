import React, { useEffect, createContext, useReducer, useContext } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import CreatePost from "./components/CreatePost/CreatePost";
import { reducer, initialState } from "./reducers/userReducer"
import UserProfile from './components/UserProfile/UserProfile'
import SubUserPost from './components/SubUserPost/SubUserPost'
import Reset from "./components/Reducer/Reducer";
import Newpassword from './components/Newpassword/Newpassword'
import SearchUser from "./components/Search/Search";
import "./App.css"

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })

    } else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push('/login')
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubUserPost />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <Newpassword />
      </Route>
      <Route path="/search/users">
        <SearchUser />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
