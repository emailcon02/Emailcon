import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../../apiconfig/apiConfig";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

function AllUserPaymenthistory() {
  const [paymenthistory, setPaymenthistory] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${apiConfig.baseURL}/api/stud/all-payment-history`
        );
     const sortedHistory = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filteredhistory = sortedHistory.filter(payment => {
        const roles = payment.paymentStatus?.toLowerCase() || "";
        const exclude = roles.includes("employee-trail");
        return !exclude;
      });
        setPaymenthistory(filteredhistory);
            } catch (error) {
        console.error("Error fetching payment history", error);
      }
    };
    fetchPayments();
  }, []);

  const handleSortByDate = () => {
    const sorted = [...filteredPayments].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateA - dateB : dateB - dateA;
    });
  
    setFilteredPayments(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  
  

  useEffect(() => {
    filterPayments();
  }, [searchTerm, fromDate, toDate, paymenthistory]);

const filterPayments = () => {
  let filtered = [...paymenthistory];

  // Search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((payment) =>
      payment.userId?.username?.toLowerCase().includes(term) ||
      payment.paymentStatus?.toLowerCase().includes(term) ||
      payment.duration?.toLowerCase().includes(term) ||
      payment.razorpayPaymentId?.toLowerCase().includes(term)
    );
  }

  // Date filter
  if (fromDate || toDate) {
    filtered = filtered.filter((payment) => {
      const paymentDate = new Date(payment.createdAt);
      const start = fromDate ? new Date(fromDate) : null;
      const end = toDate
        ? new Date(new Date(toDate).setHours(23, 59, 59, 999))
        : null;

      const afterFrom = !start || paymentDate >= start;
      const beforeTo = !end || paymentDate <= end;

      return afterFrom && beforeTo;
    });
  }

  setFilteredPayments(filtered);
  setCurrentPage(1);
};

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredPayments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);

  const resetFilter = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
  };

  const handleCSVExport = () => {
    const table = document.getElementById("userTable");
    const rows = Array.from(table.rows);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows
        .map((row) =>
          Array.from(row.cells)
            .map((cell) => cell.innerText)
            .join(",")
        )
        .join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payment_history.csv");
    document.body.appendChild(link);
    link.click();
  };
  
  const handleExcelExport = () => {
    const table = document.getElementById("userTable");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, "payment_history.xlsx");
  };
  
// Then in the PDF export function:
const handlePDFExport = () => {
  const doc = new jsPDF();

  const tableColumn = [
    "S.No",
    "Payment Date",
    "Username",
    "Amount (Rs)",
    "Plan Details (Days)",
    "Expiry Date",
    "Payment Status",
    "Payment Id",
  ];

  const tableRows = filteredPayments.map((payment, index) => [
    index + 1,
    new Date(payment.createdAt).toLocaleDateString("en-IN"),
    payment.userId?.username || "N/A",
    payment.amount,
    payment.duration,
    new Date(payment.expiryDate).toLocaleDateString("en-IN"),
    payment.paymentStatus,
    payment.razorpayPaymentId || "N/A",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    styles: {
      font: "helvetica", // basic font
    },
  });

  doc.save("payment_history.pdf");
};


  return (
    <>
      <Header />
      <AdminSidebar />
      <div className="admin-dashboard-page admin-main-content">
        <div className="search-bar-search">
          <div className="search-container-table">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="admin-dashboard-table-header">
          <div className="rows-dropdown-left">
            <label htmlFor="rowsPerPage">Rows per page:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => {
                const value =
                  e.target.value === "all"
                    ? filteredPayments.length
                    : parseInt(e.target.value);
                setRowsPerPage(value);
                setCurrentPage(1);
              }}
            >
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="date-filter">
            <label>From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <label>To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

            <button onClick={resetFilter}>Reset</button>
          </div>
        </div>

{/* Export table data */}
<div className="export-button-group">
  {/* Export to CSV */}
  <button className="export-btn csv-btn" onClick={handleCSVExport}>
    Export to CSV
  </button>

  {/* Export to Excel */}
  <button className="export-btn excel-btn" onClick={handleExcelExport}>
    Export to Excel
  </button>

  {/* Export to PDF */}
  <button className="export-btn pdf-btn" onClick={handlePDFExport}>
    Export to PDF
  </button>
</div>



        <div className="cam-scroll" style={{ overflowX: "auto" }}>
          <table className="admin-dashboard-table" id="userTable">
            <thead>
              <tr>
                <th>S.No</th>
                <th onClick={handleSortByDate} style={{ cursor: "pointer" }}>
        Payment Date {sortOrder === "asc" ? "▲" : "▼"}
      </th>      
      <th>UserName</th>
                <th>Amount</th>
                <th>Plan Details (Days)</th>
                <th>Expiry Date</th>
                <th>Payment Status</th>
                <th>Payment Id</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers && currentUsers.length > 0 ? (
                currentUsers.map((payment, index) => (
                  <tr key={payment._id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>
                      {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td>{payment.userId?.username || "N/A"}</td>
                    <td>₹{payment.amount}</td>
                    <td>{payment.duration}</td>
                    <td>
                      {new Date(payment.expiryDate).toLocaleDateString("en-IN")}
                    </td>
                    <td>{payment.paymentStatus}</td>
                    <td>{payment.razorpayPaymentId || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        <ToastContainer
          className="custom-toast"
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={true}
          closeOnClick={false}
          closeButton={false}
          pauseOnHover={true}
          draggable={true}
          theme="light"
        />
      </div>
    </>
  );
}

export default AllUserPaymenthistory;
