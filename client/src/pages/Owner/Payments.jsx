import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./OwnerDashboard.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobcards`);

      const data = await res.json();

      const waitingPayments = data.filter(
        (job) => job.paymentStatus === "Waiting",
      );

      setPayments(waitingPayments);
    } catch (error) {
      console.log(error);
    }
  };

  const approvePayment = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/approve/${id}`,
        {
          method: "POST",
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Payment Approved");
        fetchPayments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rejectPayment = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/reject/${id}`,
        {
          method: "POST",
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Payment Rejected");
        fetchPayments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="owner-page">
      <h1>Payment Verification</h1>

      <div className="owner-card">
        <h2>Pending Payment Requests</h2>

        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Job ID</th>
              <th>Amount</th>
              <th>Requested</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="5">No Pending Payment Requests</td>
              </tr>
            ) : (
              payments.map((job) => (
                <tr key={job._id}>
                  <td>{job.customerName}</td>

                  <td>{job.jobId}</td>

                  <td>₹{job.pendingAmount}</td>

                  <td>
                    {job.paymentRequestedAt
                      ? new Date(job.paymentRequestedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      className="accept-btn"
                      onClick={() => approvePayment(job._id)}
                    >
                      Approve
                    </button>

                    <button
                      className="delete-btn"
                      style={{
                        marginLeft: "10px",
                      }}
                      onClick={() => rejectPayment(job._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
