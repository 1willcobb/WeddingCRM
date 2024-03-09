import { CLIENTS } from "../utils/queries.jsx";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import NewClientModal from "./newClientModal.jsx";
import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableHeader = styled.th`
  border: 1px solid white;
`;

const TableCell = styled.td`
  border: 1px solid white;
  padding: 10px;
`;

const Home = () => {
  const { loading, data, refetch } = useQuery(CLIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedField, setSelectedField] = useState({
    field: null,
    index: null,
  });

  const selectField = (fieldName, index) => {
    setSelectedField({ field: fieldName, index: index });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const refetchData = () => {
    refetch();
  };

  const handleKeyPress = (e, clientId, value) => {
    if (e.key === "Enter") {
      console.log(clientId, value);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Heyo</h1>
      <button onClick={openModal}>+</button>
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
          {data.clients.map((client, index) => (
            <tr key={client.SK}>
              <TableCell onClick={() => selectField("name", index)}>
                {selectedField.field === "name" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Name"
                    defaultValue={client.name}
                    onFocus={() => selectField("name", index)}
                    onKeyDown={(e) => handleKeyPress(e, client.SK, e.target.value)}
                  />
                ) : (
                  client.name
                )}
              </TableCell>
              <TableCell onClick={() => selectField("email", index)}>
                {selectedField.field === "email" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Email"
                    value={client.email}
                    onFocus={() => selectField("email", index)}
                  />
                ) : (
                  client.email
                )}
              </TableCell>
              <TableCell onClick={() => selectField("phone", index)}>
                {selectedField.field === "phone" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Phone"
                    value={client.phone}
                    onFocus={() => selectField("phone", index)}
                  />
                ) : (
                  client.phone
                )}
              </TableCell>
              <TableCell onClick={() => selectField("inquiry", index)}>
                {selectedField.field === "inquiry" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Inquiry"
                    value={client.inquiry}
                    onFocus={() => selectField("inquiry", index)}
                  />
                ) : (
                  client.inquiry
                )}
              </TableCell>
              <TableCell onClick={() => selectField("budget", index)}>
                {selectedField.field === "budget" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Budget"
                    value={client.budget}
                    onFocus={() => selectField("budget", index)}
                  />
                ) : (
                  client.budget
                )}
              </TableCell>
              <TableCell onClick={() => selectField("eventDate", index)}>
                {selectedField.field === "eventDate" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Event Date"
                    value={client.eventDate}
                    onFocus={() => selectField("eventDate", index)}
                  />
                ) : (
                  client.eventDate
                )}
              </TableCell>
              <TableCell onClick={() => selectField("notes", index)}>
                {selectedField.field === "notes" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Notes"
                    value={client.notes}
                    onFocus={() => selectField("notes", index)}
                  />
                ) : (
                  client.notes
                )}
              </TableCell>
              <TableCell onClick={() => selectField("package", index)}>
                {selectedField.field === "package" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Package"
                    value={client.package}
                    onFocus={() => selectField("package", index)}
                  />
                ) : (
                  client.package
                )}
              </TableCell>
              <TableCell onClick={() => selectField("plannerPK", index)}>
                {selectedField.field === "plannerPK" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Planner PK"
                    value={client.plannerPK}
                    onFocus={() => selectField("plannerPK", index)}
                  />
                ) : (
                  client.plannerPK
                )}
              </TableCell>
              <TableCell onClick={() => selectField("projectPK", index)}>
                {selectedField.field === "projectPK" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Project PK"
                    value={client.projectPK}
                    onFocus={() => selectField("projectPK", index)}
                  />
                ) : (
                  client.projectPK
                )}
              </TableCell>
              <TableCell onClick={() => selectField("status", index)}>
                {selectedField.field === "status" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Status"
                    value={client.status}
                    onFocus={() => selectField("status", index)}
                  />
                ) : (
                  client.status
                )}
              </TableCell>
              <TableCell onClick={() => selectField("venuePK", index)}>
                {selectedField.field === "venuePK" &&
                selectedField.index === index ? (
                  <input
                    type="text"
                    placeholder="Venue PK"
                    value={client.venuePK}
                    onFocus={() => selectField("venuePK", index)}
                  />
                ) : (
                  client.venuePK
                )}
              </TableCell>
            </tr>
          ))}
        </tbody>
        <tbody>
          <NewClientModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onRefetch={refetchData}
          />
          <tr>
            <TableCell>
              <input type="text" placeholder="Name" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Email" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Phone" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Inquiry" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Budget" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Event Date" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Notes" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Package" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Planner PK" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Project PK" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Status" value="" />
            </TableCell>
            <TableCell>
              <input type="text" placeholder="Venue PK" value="" />
            </TableCell>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
