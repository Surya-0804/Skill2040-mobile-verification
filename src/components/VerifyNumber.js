import React, { useState, useRef } from 'react';
import "./VerifyNumber.css"
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase"; // Update the import path for your firebase.js
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const VerifyNumber = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const recaptchaContainerRef = useRef(null);

  function onRecaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onRecaptchaVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <div className="verify-container">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
        {user ? (
          <h2 className="success-message">
            👍 Login Success
          </h2>
        ) : (
          <div className="verify-form">
            <h1 className="welcome-title">
              Skill 2040 <br /> 
            </h1>
            {showOTP ? (
              <>
                <div className="icon-container">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="form-label"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="otp-input"
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="verify-button"
                >
                  {loading && (
                    <CgSpinner size={20} className="spinner" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="icon-container">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="form-label"
                >
                  Verify your phone number
                </label>
                <PhoneInput country={"in"} value={ph} onChange={setPh}  />
                <button
                  onClick={onSignup}
                  className="verify-button"
                >
                  {loading && (
                    <CgSpinner size={20} className="spinner" />
                  )}
                  <span style={{margin:"1rem"}}>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyNumber;
