import axios from "axios";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";
import { BASE_URL } from "../../../helper.js";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const { isAuthorized, user ,token} = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Redirect if not authorized or user is an employer
    if (!isAuthorized || (user && user.role === "EMPLOYER")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  // Function to handle file input changes
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Ensure file type restriction
      const fileType = file.type.split("/")[1];
      if (fileType !== "pdf" && fileType !== "jpeg" && fileType !== "png") {
        toast.error("Invalid file format. Please upload a PDF, JPEG, or PNG file.");
        event.target.value = null;
      } else {
        setResume(file);
      }
    }
  };

  const handleApplication = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name || !email || !phone || !address || !coverLetter || !resume) {
      toast.error("Please fill in all fields and upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(`${BASE_URL}/api/v1/application/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      toast.success(data.message);
      // Reset form fields after successful submission
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      navigateTo("/job/getAll");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
          <div>
            <label style={{ textAlign: "start", display: "block", fontSize: "20px" }}>Select Resume:</label>
            <input
              type="file"
              accept=".pdf, .jpeg, .png"
              onChange={handleFileChange}
              style={{ width: "100%" }}
              required
            />
          </div>
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>
  );
};

export default Application;
