import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const InfoSection = () => {
  return (
    <div className="howitworks">
      <div className="container">
        <h3>How JobZee Works</h3>
        <div className="banner">
          <div className="card">
            <FaUserPlus />
            <p>Create Account</p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero
              molestiae in inventore, commodi quo, tempore nam cumque totam velit
              ipsa excepturi, omnis eum officia. Laudantium numquam alias aliquam
              illum quod.
            </p>
          </div>
          <div className="card">
            <MdFindInPage />
            <p>Find a Job/Post a Job</p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero
              molestiae in inventore, commodi quo, tempore nam cumque totam velit
              ipsa excepturi, omnis eum officia. Laudantium numquam alias aliquam
              illum quod.
            </p>
          </div>
          <div className="card">
            <IoMdSend />
            <p>Apply For Job/Recruit Suitable Candidates</p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero
              molestiae in inventore, commodi quo, tempore nam cumque totam velit
              ipsa excepturi, omnis eum officia. Laudantium numquam alias aliquam
              illum quod.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
