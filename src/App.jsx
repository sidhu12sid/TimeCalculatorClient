import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Modal from "./components/modal-component/modal";
import { useMutation } from "@tanstack/react-query";
import { createPortal } from "react-dom";

const App = () => {
  const [punchData, setPunchData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dayType, setDayType] = useState("0");
  const calculateTime = async () => {
    // const urlProd =
    //   "https://timecalculator-deebf4apfbhvenca.canadacentral-01.azurewebsites.net/api/Punch/calculate";
    const urlProd =
    "https://timecalculator-deebf4apfbhvenca.canadacentral-01.azurewebsites.net/api/Punch/caluclateV2";
    const urlLocal =
    "https://localhost:44338/api/Punch/caluclateV2";
    const result = await axios.post(
      urlProd,
      {},
      {
        params: { punchData , dayType },
        headers: {
          accept: "*/*",
          "Content-Type": "application/json-patch+json",
        },
      }
    );
    const res = result.data.data;
    return res;
  };

  const { mutate, isPending, data } = useMutation({
    mutationFn: calculateTime,
    onError: (error) => {
      setShowModal(false);
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Punch calculation successful!");
    },
  });

  const handleSubmit = async (e) => {
    setShowModal(true);
    e.preventDefault();
    if (!punchData) {
      toast.error("Please enter your timesheet data");
      setShowModal(false);
    } else {
      mutate(punchData);
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
              <div className="mt-4 mb-5">
                <label
                  htmlFor="dayType"
                  className="block text-lg font-medium text-gray-900"
                >
                  Select Day Type:
                </label>
                <div className="mt-1 block p-1 rounded-md border-gray-300 shadow-sm outline-1 -outline-offset-1 outline-[#959595]">
                <select
                  id="dayType"
                  value={dayType}
                  onChange={(e) => setDayType(e.target.value)}
                  className="w-full bg-transparent border-none p-2 outline-none rounded-md"
                >
                  <option value="0">Full Day</option>
                  <option value="1">Half Day</option>
                </select>
                </div>
              </div>
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
                className="rounded-md w-45 stat bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Calculate
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal &&
        createPortal(
          <Modal
            title="Calculation Result"
            content={data}
            onClose={() => setShowModal(false)}
            status={isPending}
          />,
          document.body
        )}

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
