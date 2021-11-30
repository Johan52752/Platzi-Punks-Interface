import { Routes, Route } from "react-router-dom";
import { Home } from "./screens/home/index";
import { useEffect,useState } from "react";
import Punk from "./screens/punk/index"
import Web3 from "web3";
import MainLayout  from "./layouts/main/index";
import Punks from "./screens/punks/index"
function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/punks" exact element={<Punks />} />
        <Route path="/punk/:tokenId" exact element={<Punk />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
