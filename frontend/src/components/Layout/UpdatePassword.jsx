import { useState, useContext } from "react";
import axios from "axios";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Context } from '../../main.jsx';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../helper.js";
import './UpdatePassword.css';

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token } = useContext(Context);
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/user/update/password`,
        {
          oldPassword,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(response.data.message || "Password updated successfully.");
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-password-container">
  <div className="update-password-content">
    <h3>Update Password</h3>
    <label>Current Password</label>
    <div className="update-password-input-container">
      
      <input
        type={showOldPassword ? "text" : "password"}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="update-password-input"
      />
      {showOldPassword ? (
        <FaRegEyeSlash
          className="update-password-eye-icon"
          onClick={() => setShowOldPassword(!showOldPassword)}
        />
      ) : (
        <FaEye
          className="update-password-eye-icon"
          onClick={() => setShowOldPassword(!showOldPassword)}
        />
      )}
    </div>
    <label>New Password</label>
    <div className="update-password-input-container">
      
      <input
        type={showNewPassword ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="update-password-input"
      />
      {showNewPassword ? (
        <FaRegEyeSlash
          className="update-password-eye-icon"
          onClick={() => setShowNewPassword(!showNewPassword)}
        />
      ) : (
        <FaEye
          className="update-password-eye-icon"
          onClick={() => setShowNewPassword(!showNewPassword)}
        />
      )}
    </div>
    <label>Confirm Password</label>
    <div className="update-password-input-container">
      
      <input
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="update-password-input"
      />
      {showConfirmPassword ? (
        <FaRegEyeSlash
          className="update-password-eye-icon"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      ) : (
        <FaEye
          className="update-password-eye-icon"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      )}
    </div>
    <div className="update-password-button-wrapper">
      <button
        onClick={handleUpdatePassword}
        disabled={loading}
        className={`update-password-button ${loading ? 'update-password-button-disabled' : ''}`}
      >
        Update Password
      </button>
    </div>
  </div>
</div>
  );
};

export default UpdatePassword;
