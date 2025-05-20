import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "@/styles/Tables.module.css";


export default function Settings({onClose}) {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const user_id = Cookies.get("user_id");

  useEffect(() => {
    if (!user_id) return;
    const fetchUser = async () => {
      const res = await fetch(`/api/profile_settings?user_id=${user_id}`);
      const data = await res.json();
      if (!res.ok) return alert(data.error);
      setUser(data);
    };
    fetchUser();
  }, [user_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const verifyCurrentPassword = async () => {
    const res = await fetch("/api/profile_settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, currentPassword: form.currentPassword }),
    });

    const data = await res.json();
    if (!res.ok) return setMessage(data.error);
    setMessage("");
    setStep(2);
  };

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return setMessage("New passwords do not match.");
    }

    const res = await fetch("/api/profile_settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, newPassword: form.newPassword }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) {
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setStep(1);
      setShowModal(false);
    }
  };

  if (!user) return <div className="text-center mt-10 text-blue-800">Loading...</div>;

  return (
    <div>
  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200 relative">
        <h1 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Profile Settings</h1>
        <button
        onClick={() => onClose()}
        className="absolute top-4 right-4 bg-red-700 text-white hover:bg-red-900 rounded-lg w-8 h-8 flex items-center justify-center text-2xl"
        aria-label="Close"
        >
        &times;
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-700 mb-2">Personal Information</h2>
            <div className="space-y-2 text-blue-900">
              <div><span className="font-medium">Name:</span> {user.first_name} {user.last_name}</div>
              <div><span className="font-medium">Username:</span> {user.username}</div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-700 mb-2">Contact Information</h2>
            <div className="space-y-2 text-blue-900">
              <div><span className="font-medium">Email:</span> {user.email}</div>
              <div><span className="font-medium">Phone:</span> {user.phone_number || "N/A"}</div>
              <div><span className="font-medium">Account Type:</span> {user.user_type}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { setShowModal(true); setStep(1); setMessage(""); }}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition duration-200"
        >
          Change Password
        </button>
        
        {message == "Password updated successfully." && (
          <div className={`mt-4 p-3 rounded text-sm ${message.includes("error") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
            {message}
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.BlurryBackground}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-800 p-4">
              <h2 className="text-xl font-semibold text-white">Change Password</h2>
            </div>
            
            <div className="p-6">
              {step === 1 ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      placeholder="Enter current password"
                      className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.currentPassword}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded border border-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={verifyCurrentPassword}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      placeholder="Enter new password"
                      className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded border border-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      Update Password
                    </button>
                  </div>
                </>
              )}
              
              {message && (
                <div className={`mt-4 p-3 rounded text-sm ${message.includes("error") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}