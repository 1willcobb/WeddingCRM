import { QueryByOrg } from "../utils/queries.jsx";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import NewClientModal from "./newClientModal.jsx";
import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid white;
`;

const TableCell = styled.td`
  border: 1px solid white;
`;

const Home = () => {
  const { loading, data, refetch } = useQuery(QueryByOrg);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const refetchData = () => {
    refetch();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Heyo</h1>
      <button onClick={openModal}>+</button>
      <NewClientModal isOpen={isModalOpen} onClose={closeModal} onRefetch={refetchData}/>
      <Table>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Phone</TableHeader>
            <TableHeader>Inquiry</TableHeader>
            <TableHeader>Budget</TableHeader>
            <TableHeader>Event Date</TableHeader>
            <TableHeader>Notes</TableHeader>
            <TableHeader>Package</TableHeader>
            <TableHeader>Planner PK</TableHeader>
            <TableHeader>Project PK</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Venue PK</TableHeader>
          </tr>
        </thead>
        <tbody>
          {data.queryByOrg.map((client) => (
            <tr key={client.SK}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.inquiry}</TableCell>
              <TableCell>{client.budget}</TableCell>
              <TableCell>{client.eventDate}</TableCell>
              <TableCell>{client.notes}</TableCell>
              <TableCell>{client.package}</TableCell>
              <TableCell>{client.plannerPK}</TableCell>
              <TableCell>{client.projectPK}</TableCell>
              <TableCell>{client.status}</TableCell>
              <TableCell>{client.venuePK}</TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
