import React from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header_Manager from "../../components/Header/Header_Manager";

const Dashboard = ({isLogin}) => {
  return (
    <div>
      <Header_Manager isLogin={isLogin}/>
      <NavBar_Manager />
    </div>
  );
};
export default Dashboard;
