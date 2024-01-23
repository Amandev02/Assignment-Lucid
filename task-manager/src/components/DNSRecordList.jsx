import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Col,
  Pagination,
} from "react-bootstrap";
import "./DNSRecordList.css";
import { read, utils, writeFile } from "xlsx";
import axios from "axios";
import Papa from "papaparse";
import { ToastContainer, toast } from 'react-toastify';

function DNSRecordList() {
  const [dnsRecords, setDNSRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = dnsRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const recordTypeOptions = [
    "A (Address) Record",
    "AAAA (IPv6 Address) Record",
    "CNAME (Canonical Name) Record",
    "MX (Mail Exchange) Record",
    "NS (Name Server) Record",
    "PTR (Pointer) Record",
    "SOA (Start of Authority) Record",
    "SRV (Service) Record",
    "TXT (Text) Record",
    "DNSSEC",
  ];

  // Function to recursively remove '\r' from keys and values
  const removeCarriageReturn = (obj) => {
    if (typeof obj === "object") {
      for (const key in obj) {
        const cleanedKey = key.replace(/\r/g, "").trim();
        obj[cleanedKey] = removeCarriageReturn(obj[key]);
        if (key !== cleanedKey) {
          delete obj[key];
        }
      }
    } else if (typeof obj === "string") {
      return obj.replace(/\r/g, "").trim();
    }
    return obj;
  };

  const handleSearch = () => {
    const filteredRecords = dnsRecords.filter(
      (record) =>
        record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDNSRecords(filteredRecords);
    // setCurrentPage(1);
  };

  // Function to parse CSV data (you can replace it with your parsing logic)

  // // Function to parse CSV data
  // const parseNonEmptyCSV = (csvData) => {
  //   // Use Papaparse library for parsing CSV data
  //   const parsedData = Papa.parse(csvData, { header: true }).data;

  //   // Filter out rows with empty values
  //   const nonEmptyRows = parsedData.filter(row => Object.values(row).some(value => value.trim() !== ''));

  //   return nonEmptyRows;
  // };
  const parseCSV = (csvData) => {
    const rows = csvData.split("\n").map((row) => row.split(","));
    const header = rows[0];
    const parsedData = rows.slice(1).map((row) => {
      if (row.length === 3) {
        const rowData = {};
        header.forEach((key, index) => {
          rowData[key] = row[index];
        });
        console.log(rowData.type);

        return rowData;
      }
    });
    return parsedData;
  };

  const handleImport = ($event) => {
    const files = $event.target.files;

    if (files) {
      const file = files[0];
      const reader = new FileReader();
      console.log(file);
      reader.onload = async (event) => {
        try {
          const csvData = event.target.result;
          const parsedData = parseCSV(csvData);
          //  const nonEmptyCSV = parseNonEmptyCSV(parsedData);
          console.log(parsedData);

          // Clean up keys and values before saving to the database
          const cleanedData = removeCarriageReturn(parsedData);
          // Assuming you want to send the rows to the server
          await axios.post(`https://assignment-lucid2.vercel.app/api/dns-records/csvupload`, {
            data: cleanedData,
          });
          console.log(parsedData);
          // Fetch DNS records after successful upload

          fetchDNSRecords();
        } catch (error) {
          console.error("Error updating DNS record:", error);
        }
      };

      reader.readAsText(file);
    } else {
      console.log(files);
      console.log("No Files Selected");
    }
  };

  const handleExport = () => {
    const headings = [
      ["Id", "Type", "Name", "Value", "CreatedAt", "UpdatedAt"],
    ];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, dnsRecords, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Records");
    writeFile(wb, "Records.xlsx");
  };

  const handleEditRecord = (recordId) => {
    const selectedRecord = dnsRecords.find((record) => record.id === recordId);
    console.log(formData);
    setFormData(selectedRecord);
    console.log(selectedRecord);
    setSelectedRecordId(recordId);

    handleShowModal();
  };

  const handleCancelSearch = () => {
    setSearchQuery("");
    fetchDNSRecords();
  };

  const handleUpdateRecord = async () => {
    try {
      await axios.put(
        `https://assignment-lucid2.vercel.app/api/dns-records/${selectedRecordId}`,
        formData
      ); // Adjust API endpoint
      handleCloseModal();
      fetchDNSRecords();
    } catch (error) {
      console.error("Error updating DNS record:", error);
    }
  };

  useEffect(() => {
    // Fetch DNS records on component mount
    fetchDNSRecords();
  }, [currentPage]);

  const fetchDNSRecords = async () => {
    try {
      const response = await axios.get(
        `https://assignment-lucid2.vercel.app/api/dns-records?page=${currentPage}`
      ); // Adjust API endpoint

      setDNSRecords(response.data.response.content.data);
      setTotalPages(response.data.totalPages);
      // console.log(response.data.response.content.data);
    } catch (error) {
      console.error("Error fetching DNS records:", error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
    setSelectedRecordId("");
  };

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async () => {
    console.log(formData);
    try {
      await axios.post("https://assignment-lucid2.vercel.app/api/dns-records", formData); // Adjust API endpoint
      handleCloseModal();
      toast.success("DNS Record added successfully", {
        position: "top-center"
    });
      fetchDNSRecords();
    } catch (error) {
      toast.error("Error adding DNS Record", {
        position: "top-center"
    });
      console.error("Error adding DNS record:", error);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    // console.log(`https://assignment-lucid2.vercel.app/api/dns-records/${recordId}`);
    try {
      await axios.delete(`https://assignment-lucid2.vercel.app/api/dns-records/${recordId}`); // Adjust API endpoint
      toast.success("DNS Record deleted ", {
        position: "top-center"
    });
      fetchDNSRecords();
    } catch (error) {
      console.error("Error deleting DNS record:", error);
    }
  };

  return (
    <div className="Record">
      <div className="Buttons_nav">
        <div className="left">
          <Button className="btn circular mx-4" variant="primary" onClick={handleShowModal}>
            Add DNS Record
          </Button>
        </div>

        <div className="right">
          <label className="btn circular mx-4" id="inputGroupFile">
            Import CSV File
            <input
              type="file"
              name="file"
              id="inputGroupFile"
              onChange={handleImport}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </label>
        </div>
      </div>

      <Form.Group controlId="formSearch">
        <InputGroup className="mb-4 me-2">
          <FormControl
            className="mx-5"
            placeholder="Enter Record Type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Button  className="mx-5"variant="outline-secondary" onClick={handleSearch}>
            Search
          </Button>
          {searchQuery ? (
            <Button variant="outline-danger" onClick={handleCancelSearch}>
              Cancel
            </Button>
          ) : (
            ""
          )}
        </InputGroup>
      </Form.Group>

      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            activeLabel=""
            active={index + 1 === currentPage}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Record Type</th>
            <th>Domain Name</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dnsRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.type}</td>
              <td>{record.name}</td>
              <td>{record.value}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteRecord(record.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleEditRecord(record.id)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>
            {selectedRecordId ? "Edit" : "Add"} DNS Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Dropdown for Record Type */}
            <Form.Group className="mb-3" controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" onChange={handleFormDataChange}>
                <option value={`${formData.type ? formData.type : ""}`}>
                  Select record type
                </option>
                {recordTypeOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={`${
                  formData.name ? formData.name : "Enter record name"
                }`}
                name="name"
                onChange={handleFormDataChange}
                maxLength={50}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formValue">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="text"
                placeholder={` ${
                  formData.value ? formData.value : "Enter Record value"
                }`}
                name="value"
                onChange={handleFormDataChange}
                maxLength={50}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {selectedRecordId && (
            <Button variant="primary" onClick={handleUpdateRecord}>
              Update Record
            </Button>
          )}
          {!selectedRecordId && (
            <Button variant="primary" onClick={handleAddRecord}>
              Add Record
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default DNSRecordList;
