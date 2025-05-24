import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";  // <-- import useSelector
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { persistor } from "../store/store";

const PatientDashboard = () => {
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get role from redux store
  const role = useSelector((state) => state.auth.user?.role || null);

  useEffect(() => {
    // Redirect if role is not patient
    if (role === "doctor") {
      navigate("/doctor-dashboard");  // or "/unauthorized" if you have such a page
    }
  }, [role, navigate]);

  const getOnlineDoctors = async () => {
    console.log('called this function');
    try {
      const response = await axios.get("http://localhost:7800/api/doctor/online-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching online doctors:", error.response?.data || error.message);
      throw error;
    }
  };

  useEffect(() => {
    const fetchOnlineDoctors = async () => {
      try {
        setLoading(true);
        const doctors = await getOnlineDoctors();
        setOnlineDoctors(doctors);
      } catch (error) {
        console.error("Failed to fetch online doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineDoctors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    dispatch(logout());
    persistor.purge();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Prevent rendering if role isn't patient (optional)
  if (role !== "patient") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between w-full items-center">
          <h1 className="text-3xl font-bold text-white">Patient Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Online Doctors
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {onlineDoctors && onlineDoctors.length > 0 ? (
              onlineDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="p-6 hover:bg-gray-750 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-blue-900 flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-300">
                          {doctor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">{doctor.name}</h3>
                      <p className="text-sm text-gray-400">{doctor.email}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <div className="text-gray-400">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-gray-300">No doctors are currently online</p>
                  <p className="mt-1 text-sm text-gray-500">Please check back later</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
