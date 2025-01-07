import { useEffect, useState  } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";


 const Users = () => {
  const location = useLocation();
  const currentUser = location.state?.currentUser || "Guest";
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Current User:", currentUser);
      setLoading(true);
      setError(""); // Reset error on new request
      try {
        const response = await axios.get("http://localhost:3000/api/v1/user/allusers?filter=" + filter);
        if (response.data.users) {
          setUsers(response.data.users);
          console.log(response.data.users)
        } else {
          setUsers([]);
        }
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filter]);

  return (
    <div className="container mx-auto p-4">
      <div className="font-bold mt-6 text-lg text-center">
       Welcome {currentUser}
      </div>
      <div className="my-4">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full p-2 mb-4 border rounded bg-gray-800 text-white"
        />
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        {users.length === 0 ? (
          <div className="text-center col-span-full">No users found.</div>
        ) : (
          users.map(user => <User key={user._id} user={user} />)
        )}
      </div>
    </div>
  );
};

function User({ user }) {
 

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
        
        </div>
        <div className="flex flex-col justify-center h-full">
          <div>
            {user.username} 
          </div>
        </div>
      </div>


    </div>
  );
}

export default Users