import "./App.css";
import { SUP } from "./utils/queries.jsx";
import { useQuery } from "@apollo/client";

function App() {
  // Query for getting single capsule data by passing in the id
  const { loading, data } = useQuery(SUP);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Heyo</h1>
      {data && Object.values(data).map((key) => (
        <p key={key}>{key}</p>
      ))}
    </>
  );
}

export default App;
