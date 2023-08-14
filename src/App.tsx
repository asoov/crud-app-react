import { Route, BrowserRouter, Routes } from "react-router-dom";
import { DefaultPageWrapper } from "@/wrappers/DefaultPageWrapper";
import { Home } from "@/views/Home";
import { Customers } from "@/views/Customers";

function App() {
  return (
    <BrowserRouter>
      <DefaultPageWrapper>
        <Routes>
          <Route path="customers" element={<Customers />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </DefaultPageWrapper>
    </BrowserRouter>
  );
}

export default App;
