// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [buttonLoading, setButtonLoading] = useState(false);
//   const [fullLoading, setFullLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     setButtonLoading(true);

//     setTimeout(() => {
//       try {
//         if (email === "automation@jiotp.com" && password === "sahamid") {
//           toast.success("Login successful!");
//           setButtonLoading(false);
//           setFullLoading(true);

//           setTimeout(() => {
//             router.push("/dashboard");
//           }, 2000);
//         } else if (email === "automation@jiotp.com") {
//           setButtonLoading(false);
//           toast.error("Password incorrect");
//         } else {
//           setButtonLoading(false);
//           toast.error("Invalid email");
//         }
//       } catch (error) {
//         setButtonLoading(false);
//         toast.error("Network error or CORS issue. Please try again.");
//       }
//     }, 500); 
//   };

//   return (
//     <>
//       <div
//         className="flex items-center justify-center min-h-screen"
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.05)),
//             url('/pakistan_naval_academy.jpg')
//           `,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           backgroundAttachment: "fixed",
//         }}
//       >
//         <div className="w-[430px] border border-white/30 backdrop-blur-[13px] shadow-[0_0_10px_rgba(255,255,255,0.2)] text-black p-[30px] px-[50px] rounded-[20px] transition-all duration-300 ease-in-out">
//           {/* Logo */}
//           <div className="flex justify-center mb-4">
//             <Image
//               src="/Pakistan_Navy_Admiral 1-fotor-bg-remover-20250530163220 1.png"
//               alt="Logo"
//               className="w-[100px]"
//               width={150}
//               height={150}
//             />
//           </div>

//           <h2 className="mb-4 text-2xl font-semibold text-center text-black">
//             LOGIN
//           </h2>

//           <form onSubmit={handleLogin}>
//             <div className="mb-4">
//               <input
//                 type="email"
//                 placeholder="Enter Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 disabled={buttonLoading || fullLoading}
//                 className="w-full px-4 py-3 border bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#0de0fc] disabled:opacity-50"
//                 style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
//               />
//             </div>

//             <div className="mb-4">
//               <input
//                 type="password"
//                 placeholder="Enter Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 disabled={buttonLoading || fullLoading}
//                 className="w-full px-4 py-3 border bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#0de0fc] disabled:opacity-50"
//                 style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
//               />
//             </div>

//             {/* <button
//   type="submit"
//   disabled={buttonLoading || fullLoading}
//   className="w-full h-[45px] 
//              bg-gradient-to-r from-[#000000] via-[#1a1a1a] to-[#333333] 
//              rounded-[40px] 
//              shadow-[0_0_10px_rgba(0,0,0,0.3)] 
//              text-white font-semibold 
//              transition-all duration-500 
//              hover:from-[#333333] hover:to-[#000000] 
//              hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] 
//              disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
// >
//   {buttonLoading ? "Logging in..." : "Login"}
// </button> */}
//             <button
//               type="submit"
//               disabled={buttonLoading || fullLoading}
//               className="w-full h-[45px] 
//              bg-gradient-to-r from-[#000000] via-[#1a1a1a] to-[#000000] 
//              rounded-[40px] 
//              shadow-[0_0_10px_rgba(0,0,0,0.3)] 
//              text-white font-semibold 
//              transition-all duration-500 
//              hover:from-[#111111] hover:to-[#000000] 
//              hover:shadow-[0_0_20px_#F7D035] 
//              disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
//             >
//               {buttonLoading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         </div>
//       </div>
//       {fullLoading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50">
//           <div className="loader"></div>
//         </div>
//       )}

//       <ToastContainer
//         position="top-right"
//         autoClose={2000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </>
//   );
// };

// export default Login;

"use client";
import config from "@/constant/apiRouteList";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setFullLoading(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      toast.error("Email and password are required.");
      setButtonLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}${config.AUTH.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok && data.token) {
        setSuccess("Login successful.");
        toast.success("Login successful!");

        // Save token and user ID in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user._id);

        setButtonLoading(false);

        // Delay full loading so toast renders first
        setTimeout(() => {
          setFullLoading(true);
          router.push("/dashboard");
        }, 2500);
      } else {
        setError(data.message || "Invalid email or password.");
        setSuccess(null);
        toast.error(data.message || "Invalid email or password.");
        setButtonLoading(false);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while logging in.");
      toast.error("Something went wrong.");
      setSuccess(null);
      setButtonLoading(false);
    }
  };

  if (fullLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.05)),
            url('/pakistan_naval_academy.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-[430px] border border-white/30 backdrop-blur-[13px] shadow-[0_0_10px_rgba(255,255,255,0.2)] text-black p-[30px] px-[50px] rounded-[20px] transition-all duration-300 ease-in-out">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/Pakistan_Navy_Admiral 1-fotor-bg-remover-20250530163220 1.png"
              alt="Logo"
              className="w-[100px]"
              width={150}
              height={150}
            />
          </div>

          <h2 className="mb-4 text-2xl font-semibold text-center text-black">
            LOGIN
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={buttonLoading || fullLoading}
                className="w-full px-4 py-3 border bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#0de0fc] disabled:opacity-50"
                style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={buttonLoading || fullLoading}
                className="w-full px-4 py-3 border bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#0de0fc] disabled:opacity-50"
                style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
              />
            </div>

            <button
              type="submit"
              disabled={buttonLoading || fullLoading}
              className="w-full h-[45px] 
                     bg-gradient-to-r from-[#000000] via-[#1a1a1a] to-[#000000] 
                     rounded-[40px] 
                     shadow-[0_0_10px_rgba(0,0,0,0.3)] 
                     text-white font-semibold 
                     transition-all duration-500 
                     hover:from-[#111111] hover:to-[#000000] 
                     hover:shadow-[0_0_20px_#F7D035] 
                     disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {buttonLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Login;