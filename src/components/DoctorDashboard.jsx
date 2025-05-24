import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { persistor } from "../store/store";

const DoctorDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const role = useSelector((state) => state.auth.user?.role || null);

  useEffect(() => {
    // If user role is not doctor, redirect to login or unauthorized page
    if (role === "patient") {
      navigate("/patient-dashboard"); // or "/unauthorized" if you have one
    }
  }, [role, navigate]);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:7800/api/doctor/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsOnline(response.data.isOnline);
    } catch (error) {
      console.error("Error fetching doctor status:", error.response?.data || error.message);
    }
  };

  const toggleStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:7800/api/doctor/update-status",
        { isOnline: !isOnline },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && typeof response.data.isOnline === 'boolean') {
        setIsOnline(response.data.isOnline);
      } else if (response.data && response.data.updatedDoctor && typeof response.data.updatedDoctor.isOnline === 'boolean') {
        setIsOnline(response.data.updatedDoctor.isOnline);
      } else {
        setIsOnline(!isOnline);
      }
    } catch (error) {
      console.error("Error updating doctor status:", error.response?.data || error.message);
      setIsOnline(!isOnline);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    dispatch(logout());
    persistor.purge();
    navigate("/");
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Optionally render nothing or a loading state while redirecting
  if (role !== "doctor") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${isOnline ? "bg-green-500" : "bg-red-500"}`}></span>
              Status
            </h2>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-blue-900 flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-300">D</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Doctor Status</h3>
                  <p className="text-sm text-gray-400">Current availability</p>
                </div>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOnline ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                  <span className={`h-2 w-2 rounded-full mr-1 ${isOnline ? "bg-green-500" : "bg-red-500"}`}></span>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={toggleStatus}
                className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors duration-150 ${isOnline ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
              >
                {isOnline ? "Go Offline" : "Go Online"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
