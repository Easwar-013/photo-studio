import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const amount = location.state?.amount || 0;
  const jobId = location.state?.jobId;

  const handlePayment = async () => {
    try {
      // Create Razorpay Order
      const orderRes = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            jobId,
          }),
        },
      );

      const order = await orderRes.json();

      const options = {
        key: "rzp_test_T6xno7sWceruNW", // Replace later

        amount: order.amount,

        currency: order.currency,

        name: "Muhurtham Studio",

        description: "Photo Editing Payment",

        order_id: order.id,

        handler: async function () {
          // Update MongoDB after payment success

          const response = await fetch(
            `http://localhost:5000/api/payment/pay/${jobId}`,
            {
              method: "POST",
            },
          );

          const data = await response.json();

          if (data.success) {
            toast.success("Payment Successful");

            setTimeout(() => {
              navigate("/customer");
            }, 1200);
          } else {
            toast.error("Payment Update Failed");
          }
        },

        theme: {
          color: "#d4af4f",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error("Unable to start payment");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>Secure Payment</h1>

        <div className="amount-box">
          <h3>Amount to Pay</h3>
          <p>₹{amount}</p>
        </div>

        <div
          style={{
            marginTop: "30px",
            marginBottom: "30px",
            textAlign: "center",
            color: "#aaa",
            lineHeight: "1.8",
          }}
        >
          <p>Click the button below to pay securely using</p>

          <h3
            style={{
              color: "#d4af4f",
              marginTop: "15px",
            }}
          >
            UPI • Google Pay • PhonePe • Paytm
            <br />
            Debit Card • Credit Card • Net Banking
          </h3>
        </div>

        <button className="payment-btn" onClick={handlePayment}>
          💳 Pay ₹{amount}
        </button>
      </div>
    </div>
  );
};

export default Payment;
