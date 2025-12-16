// import React, { useEffect, useState } from "react";
// import { fetchCustomOrders } from "../../api";
// // import { Bar, Pie } from "react-chartjs-2";
// import "../../pages/Orders/styles/CustomOrders.css";

// const CustomOrderReport: React.FC = () => {
//   const [orders, setOrders] = useState<any[]>([]);

//   useEffect(() => {
//     fetchCustomOrders().then(setOrders);
//   }, []);

// //   CHARTS TO BE IMPLEMENTED LATER
// //   const pendingCount = orders.filter(o => o.status === "pending").length;
// //   const completedCount = orders.filter(o => o.status === "completed").length;

// //   const barData = {
// //     labels: ["Pending", "Completed"],
// //     datasets: [{
// //       label: "Orders",
// //       data: [pendingCount, completedCount],
// //       backgroundColor: ["#FFD700", "#4CAF50"],
// //     }],
// //   };

// //   const pieData = {
// //     labels: ["Pending", "Completed"],
// //     datasets: [{
// //       data: [pendingCount, completedCount],
// //       backgroundColor: ["#FFD700", "#4CAF50"],
// //     }],
// //   };

//   return (
//     <div className="report-container">
//       <h2>Custom Orders Report</h2>
//       {/* <div className="charts">
//         <div className="chart"><Bar data={barData} /></div>
//         <div className="chart"><Pie data={pieData} /></div>
//       </div> */}

//       <table className="custom-orders-table">
//         <thead>
//           <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Description</th><th>Image</th></tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr key={order.id}>
//               <td>{order.id}</td>
//               <td>{order.name}</td>
//               <td>{order.email}</td>
//               <td>{order.phone}</td>
//               <td>{order.description}</td>
//               <td><img src={order.image} width="50" /></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CustomOrderReport;


import React, { useEffect, useState } from "react";
import { fetchCustomOrders } from "../../api";
import "../../pages/Orders/styles/CustomOrders.css";

const ITEMS_PER_PAGE = 10;

const CustomOrderReport: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCustomOrders();
      const sorted = data.sort((a: any, b: any) => a.id - b.id);
      setOrders(sorted);
    };
    load();
  }, []);

  /* --------------------- FILTER + SEARCH --------------------- */
    const filteredOrders = orders.filter((o) => {
      const matchesSearch =
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.toLowerCase().includes(search.toLowerCase()) ||
        o.description.toLowerCase().includes(search.toLowerCase()) ||
        o.status.toLowerCase().includes(search.toLowerCase()) ||
        String(o.id).includes(search);
  
      return matchesSearch 
    });
  
    /* ------------------------ PAGINATION ------------------------ */
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  

  return (
    <div className="report-container">
      <h2>Custom Orders Report</h2>
      <div className="orders-header">
        <input
          className="search-input"
          placeholder="Search orders…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="custom-orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Description</th>
            <th>Image</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>{order.phone}</td>
              <td>{order.description}</td>
              {/* Click image → modal */}
              <td>
                <img
                  src={order.image}
                  alt="wear"
                  width="50"
                  style={{ cursor: "pointer" }}
                  onClick={() => setModalImage(order.image)}
                />
              </td>
              <td>
                <span className={`status ${order.status}`}>{order.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* -------------- PAGINATION BUTTONS -------------- */}
      <div className="pagination-controls">

        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              className={page === pageNum ? "active-page" : ""}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>

      </div>
      {/* ---------------- IMAGE MODAL ---------------- */}
      {modalImage && (
        <div className="modal-overlayy">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModalImage(null)}>
              ✕
            </button>
            <img src={modalImage} alt="Full size" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrderReport;

