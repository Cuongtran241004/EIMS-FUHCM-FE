import React from "react";
import Header_Manager from "../../components/Header/Header_Manager";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";

const Request = ({isLogin}) => {
  return (
    <div>
      <Header_Manager isLogin={isLogin} />
      <NavBar_Manager />
    </div>
  );
};

export default Request;
