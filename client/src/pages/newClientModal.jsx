import { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { ADD_CLIENT } from "../utils/mutations";
import uuid from "react-uuid";

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  color: black;
  padding: 20px;
  border-radius: 4px;
  width: 500px;
`;

const CloseButton = styled.span`
  float: right;
  font-size: 1.5em;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const NewClientModal = ({ isOpen, onClose, onRefetch }) => {
  const [addClient, { error }] = useMutation(ADD_CLIENT);

  const [clientData, setClientData] = useState({
    pk: "ORG::1",
    sk: "",
    budget: 0,
    email: "",
    eventDate: "",
    inquiry: "",
    name: "",
    notes: "",
    package: "",
    phone: "",
    plannerPK: "",
    projectPK: "",
    status: "",
    venuePK: ""
  });

  useEffect(() => {
    // Generate UUID only when the component mounts
    setClientData((currentData) => ({
      ...currentData,
      sk: "CLIENT::" + uuid(), //!This shouldent be on the client
    }));
  }, [isOpen]);
  
  const handleBackdropClick = (e) => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevents click inside the modal from closing it
  };

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Client Data:", clientData);
    try {
      const { data } = await addClient({ variables: { ...clientData } });
      console.log("New Client:", data);
      onClose();
      if (onRefetch) {
        onRefetch(); // Call the refetch function passed as a prop
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  if (error) {
    console.error(error);
  }

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={handleBackdropClick}>
      <ModalContent onClick={handleModalClick}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>New Client Form</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={clientData.name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={clientData.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone</Label>
            <Input
              type="text"
              name="phone"
              placeholder="Phone"
              value={clientData.phone}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Inquiry</Label>
            <Input
              type="date"
              name="inquiry"
              placeholder="Inquiry"
              value={clientData.inquiry}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Event Date</Label>
            <Input
              type="date"
              name="eventDate"
              placeholder="Event Date"
              value={clientData.eventDate}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Budget</Label>
            <Input
              type="number"
              name="budget"
              placeholder="Budget"
              value={clientData.budget}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Package</Label>
            <Input
              type="text"
              name="package"
              placeholder="Package"
              value={clientData.package}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <Input
              type="text"
              name="status"
              placeholder="Status"
              value={clientData.status}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Planner PK</Label>
            <Input
              type="text"
              name="plannerPK"
              placeholder="Planner PK"
              value={clientData.plannerPK}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Project PK</Label>
            <Input
              type="text"
              name="projectPK"
              placeholder="Project PK"
              value={clientData.projectPK}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Venue PK</Label>
            <Input
              type="text"
              name="venuePK"
              placeholder="Venue PK"
              value={clientData.venuePK}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Notes</Label>
            <TextArea
              name="notes"
              placeholder="Notes"
              value={clientData.notes}
              onChange={handleChange}
            />
          </FormGroup>
          <SubmitButton type="submit">Submit</SubmitButton>
        </Form>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default NewClientModal;
