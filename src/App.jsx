import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import Modal from "./components/modal-component/modal";


const App = () => {
  const [punchData, setPunchData] = useState("");
  const [response, setResponse] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlProd =
      "https://timecalculator-deebf4apfbhvenca.canadacentral-01.azurewebsites.net/api/Punch/calculate";
   // const urlDev = "https://localhost:44338/api/Punch/calculate";
    if (!punchData) {
      toast.error("Please enter your timesheet data.");
    } else {
      try {
        const result = await axios.post(
          urlProd,
          {},
          {
            params: { punchData },
            headers: {
              accept: "*/*",
              "Content-Type": "application/json-patch+json",
            },
          }
        );
        if (result.status === 200 && result.data.status && !result.data.error) {
          setResponse(result.data.data.completionTime);
        } else {
          setResponse("Error: " + result.data.message);
        }
        setShowModal(true);
      } catch (error) {
        toast.error("An error occurred while calling the API.");
      }
    }
  };

  return (
    <>
    
      <div className=" flex justify-center items-center h-screen">
        <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-center">
            <h1 className="text-xl">TIME CALCULATOR</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="col-span-full p-6 ">
              <label
                htmlFor="about"
                className="block text-lg font-medium text-gray-900"
              >
                Enter your timesheet data :
              </label>
              <div className="mt-2">
                <textarea
                  name="about"
                  id="about"
                  rows="8"
                  value={punchData}
                  onChange={(e) => setPunchData(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#959595] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-900 sm:text-sm/6"
                ></textarea>
              </div>
              <p className="mt-3 text-sm/6 text-black">
                Enter your timesheet data to calculate the woking hours.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-x-6">
              <button
                type="submit"
                className="rounded-md w-45 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Calculate
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (<Modal
         title="Calculation Result"
         content={response}
         onClose={() => setShowModal(false)}
      />)}

      
      <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
    </>
  );
};

export default App;
