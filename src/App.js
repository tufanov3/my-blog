import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import { Header } from "./components";
import { TagsPosts } from './components/tagsPosts'
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)

  useEffect(() => {
    dispatch(fetchAuthMe())
  }, [])
  return (
    <>
      <Header />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tags/:tag" element={<TagsPosts />} />
            <Route path="/posts/:id" element={<FullPost />} />
            <Route path="/posts/:id/edit" element={<AddPost />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
          </Routes>
        </Container>
    </>
  );
}

export default App;


// FullPost
// AddPost
//Login
//Registration
//
