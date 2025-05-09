import React from "react";

const App = () => {
  return (
    <>
      <div className=" flex justify-center items-center h-screen">
        <div className="bg-white w-180 h-150 p-10">
          <div className="flex justify-center">
          <h1 className="text-2xl">Time calculator</h1>
          </div>
          <div className="col-span-full p-6">
            <label for="about" className="block text-lg font-medium text-gray-900">
              Enter your timesheet data :
            </label>
            <div className="mt-2">
              <textarea
                name="about"
                id="about"
                rows="8"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              ></textarea>
            </div>
            <p className="mt-3 text-sm/6 text-gray-600">
              Enter your timesheet data to calculate the woking hours.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-x-6">
          {/* <button type="button" class="text-sm/6 font-semibold text-gray-900">Cancel</button> */}
          <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Check</button>
          </div>
        </div>

      </div>
    </>
  );
};

export default App;
