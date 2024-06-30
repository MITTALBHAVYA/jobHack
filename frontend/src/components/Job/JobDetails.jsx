import {useContext,useEffect,useState} from 'react';
import axios from 'axios';
import {Link,useParams,useNavigate} from 'react-router-dom';
import {Context} from '../../main';

const JobDetails = () => {
  const {jobId}=useParams();
  const [job,setJob]=useState({});
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const navigateTo=useNavigate();
  const {isAuthorized,user}=useContext(Context);

  useEffect(()=>{
    if(!isAuthorized){
      navigateTo("/login");
    }
    const fetchJobDetails = async ()=>{
      try{
        const {data}=await axios.get(`http://localhost:3000/api/v1/job/${jobId}`,{withCredentials:true});
        setJob(data.job);
      }
      catch(err){
        setError(err.response?.data?.message || err.message);
        navigateTo("/notfound");
      }
      finally{
        setLoading(false);
      }
    };
    fetchJobDetails();
  },[jobId,isAuthorized,navigateTo]);

  if(loading){
    return <div>Loading...</div>;
  }

  if(error){
    return <div>{error}</div>;
  }

  return (
    <section className="jobDetails page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>Title: <span>{job.title}</span></p>
          <p>Category: <span>{job.category}</span> </p>
          <p>Country: <span>{job.country}</span></p>
          <p>Location: <span>{job.location}</span></p>
          <p>Description: <span>{job.description}</span></p>
          <p>Job Posted On: <span>{job.jobPostedOn}</span></p>
          <p>Salary: {job.fixedSalary?<span>{job.fixedSalary}</span> : <span>{job.salaryFrom} - {job.salaryTo}</span>}</p>
          {user && user.role !== "Employer" && (<Link to={`/application/${job._id}`}>Apply Now</Link>)}
        </div>
      </div>
    </section>
  )
}

export default JobDetails;
