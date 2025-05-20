import React, { useState } from 'react';
import * as AiIcons_md from 'react-icons/md';
import { QR_Login } from "@/components/QR_Scanning"; 
import styles from "@/styles/Modals.module.css";
import Cookies from 'js-cookie'; 
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/authentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Login failed');

      // Store cookies
      Cookies.set('user_id', data.id);
      Cookies.set('user_type', data.role);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `You have successfully logged in as ${data.role}.`,
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      });

      // Delay navigation to allow Swal to finish
      setTimeout(() => {
        if (data.role === 'Admin') router.push('/Admin');
        else if (data.role === 'Incharge') router.push('/Incharge');
        else if (data.role === 'Student') router.push('/User');
        else if (data.role === 'Staff') router.push('/User');
        else router.push('/User');
      }, 1600);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };




  const handleQRSuccess = async (decodedText) => {
    console.log('Scanned QR Code:', decodedText);
    setIsQRVisible(false);

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/authentication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr: decodedText }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'QR login failed');

      Cookies.set('user_id', data.id);
      Cookies.set('user_type', data.role);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome, ${data.full_name}`,
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (data.role === 'Admin') router.push('/Admin');
        else if (data.role === 'Incharge') router.push('/Incharge');
        else router.push('/User');
      }, 1600);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[url('../public/Login_SRCB_BackgroundImg_LowGPX.png')] bg-cover bg-blend-multiply bg-gray-800 bg-center flex items-center justify-center w-screen h-screen text-white">
      <title>SRCB AVR Reservation & Inventory System</title>
      <div className="relative bg-gray-800 bg-opacity-70 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-sm border border-blue-900/50 animate-fade-in">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow p-1">
            <img src="./App_Icon.png" alt="App Icon" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 animate-fade-in">SRCB AVR SYSTEM</h2>
        <p className="text-center text-blue-200 mb-6 animate-fade-in">Please enter your credentials</p>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Username */}
          <div className="animate-slide-in">
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder=" "
                className="w-full px-4 py-3 bg-gray-700 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-transparent peer transition-all duration-200"
              />
              <label
                htmlFor="username"
                className="absolute left-4 -top-2.5 bg-gray-800 px-1 text-sm rounded-md text-blue-300 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
              >
                Username
              </label>
            </div>
          </div>

          {/* Password */}
          <div className="animate-slide-in animation-delay-100">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
                className="w-full px-4 py-3 pr-12 bg-gray-700 border border-blue-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-transparent peer transition-all duration-200"
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 bg-gray-800 px-1 text-sm rounded-md text-blue-300 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
              >
                Password
              </label>

              {/* Toggle Password */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-300 hover:text-blue-100"
              >
                {showPassword ? <AiIcons_md.MdVisibilityOff size={20} /> : <AiIcons_md.MdVisibility size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between animate-slide-in animation-delay-200">
            <label className="flex items-center text-sm text-blue-200">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 bg-gray-700 border-blue-900 rounded focus:ring-blue-500"
              />
              Remember Me
            </label>
          </div>

          {/* Submit Button */}
          <div className="animate-slide-in animation-delay-300">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 shadow-lg ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <AiIcons_md.MdAutorenew className="animate-spin mr-2" size={20} />
                  Logging in...
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </div>

          {/* QR Code Login Button */}
          <div className="text-center mt-6 animate-fade-in animation-delay-400">
            <button
              type="button"
              onClick={() => setIsQRVisible(true)}
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center justify-center transition-all w-full"
            >
              <AiIcons_md.MdQrCodeScanner className="mr-2" size={20} />
              Login Using QR Code
            </button>
          </div>
        </form>
      </div>

      {/* QR Scanner Modal */}
      {isQRVisible && (
        <div className={styles.BlurryBackground}>
            <QR_Login
            ScanningStatus={isQRVisible}
            onScanSuccess={handleQRSuccess}
            CloseForm={() => setIsQRVisible(false)}
            />
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
