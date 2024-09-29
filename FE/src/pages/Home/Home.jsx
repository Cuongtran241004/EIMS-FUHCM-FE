import axios from "axios";
import "./Home.css";
import { useState, useEffect } from "react";
function Home() {
  const [user, setUser] = useState(null);
  const [getInfo, setGetInfo] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/eims-fuhcm-be/users/userInfo", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/eims-fuhcm-be/users", { withCredentials: true })
      .then((response) => {
        setGetInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

console.log(getInfo);
  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Roles: {user.role}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

    </div>
  );
}

export default Home;
