import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  withCredentials: true, // allows sending cookies (for auth)
});
