import React, { useState } from "react";
// import CompanyComponent from "./components/Company";
import { Route, Routes } from "react-router-dom";
import ListCompanies from "./pages/ListCompanies";
import CreateCompanies from "./pages/CreateCompanies";
import DetailsCompany from "./pages/DetailsCompany";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ListCompanies />}></Route>
        <Route path="/add-company" element={<CreateCompanies />}></Route>
        <Route path="/company/:id" element={<DetailsCompany />}></Route>
      </Routes>
      {/* <CompanyComponent /> */}
    </div>
  );
}
