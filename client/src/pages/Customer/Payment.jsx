import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const amount = location.state?.amount || 0;
  const jobId = location.state?.jobId;

  const [seconds, setSeconds] = useState(180);
  const [expired, setExpired] = useState(false);
  const [waiting, setWaiting] = useState(false);

  // Redirect if page opened directly
  useEffect(() => {
    if (!jobId) {
      navigate("/login");
    }
  }, [jobId, navigate]);

  // Countdown Timer
  useEffect(() => {
    if (expired || waiting) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expired, waiting]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  const upiId = "pondyeashwar@oksbi";
  const studioName = "Muhurtham Studio";

  const upiLink =
    `upi://pay?` +
    `pa=${upiId}` +
    `&pn=${encodeURIComponent(studioName)}` +
    `&am=${amount}` +
    `&cu=INR` +
    `&tn=Job-${jobId}`;

  const paymentDone = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/request/${jobId}`,
        {
          method: "POST",
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Payment request sent to studio.");
        setWaiting(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to send payment request.");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>Muhurtham Studio</h1>

        <div className="amount-box">
          <h3>Amount to Pay</h3>
          <p>₹{amount}</p>
        </div>

        {!waiting ? (
          <>
            <div className="qr-container">
              <QRCode value={upiLink} size={220} />
            </div>

            <h3
              style={{
                color: "#d8b354",
                marginTop: "20px",
              }}
            >
              Scan using
            </h3>

            <p
              style={{
                color: "#fff",
                lineHeight: "1.8",
              }}
            >
              Google Pay
              <br />
              PhonePe
              <br />
              Paytm
              <br />
              BHIM UPI
            </p>

            {!expired ? (
              <>
                <h2
                  style={{
                    color: "#00ff90",
                    marginTop: "20px",
                  }}
                >
                  QR Expires In
                </h2>

                <h1
                  style={{
                    color: "#fff",
                  }}
                >
                  {minutes}:{secs}
                </h1>

                <button className="payment-btn" onClick={paymentDone}>
                  I Have Paid
                </button>
              </>
            ) : (
              <>
                <h2
                  style={{
                    color: "red",
                    marginTop: "20px",
                  }}
                >
                  QR Code Expired
                </h2>

                <button
                  className="payment-btn"
                  onClick={() => {
                    setSeconds(180);
                    setExpired(false);
                  }}
                >
                  Generate New QR
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h2
              style={{
                color: "#00ff90",
                marginTop: "30px",
              }}
            >
              Payment Request Sent
            </h2>

            <p
              style={{
                color: "#fff",
                marginTop: "20px",
                lineHeight: "1.8",
              }}
            >
              Thank you.
              <br />
              The studio owner will verify your payment.
              <br />
              Once approved, your payment summary will be updated.
            </p>

            <button
              className="payment-btn"
              style={{
                marginTop: "30px",
              }}
              onClick={() => navigate("/customer")}
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
