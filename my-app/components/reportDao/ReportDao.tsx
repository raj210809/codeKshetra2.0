import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoStar, IoStarOutline } from "react-icons/io5"; // Icons for star ratings
//import { cn } from "@/utils/classNames"; // Utility function for className management (optional)
import { useTheme } from "next-themes"; // For light/dark theme support

const ReportDao = () => {
  // Fetch user address from the connected wallet
  const [userAddress, setUserAddress] = useState("");
  const [employerUserAddress, setEmployerUserAddress] = useState("");
  const [daoMembers, setDaoMembers] = useState([]);
  const [isDaoCreated, setIsDaoCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme(); // Handle light & dark mode

  // Simulating user data (Replace with API call)
  const users = [
    {
      profile: "/profile-placeholder.png",
      name: "Talha",
      DaoNumber: 69,
      Stars: 3.4,
    },
    {
      profile: "/profile-placeholder.png",
      name: "Ayesha",
      DaoNumber: 42,
      Stars: 4.2,
    },
  ];

  // Function to invite a user to the DAO
  const pushToDao = (user) => {
    if (!daoMembers.find((member) => member.name === user.name)) {
      setDaoMembers([...daoMembers, user]);
    }
  };

  // Function to create DAO
  const createDao = () => {
    setLoading(true);
    setTimeout(() => {
      setIsDaoCreated(true);
      setLoading(false);
    }, 2000); // Simulating async operation
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-3xl p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        {/* Input Fields for User & Employer Address */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Wallet Address"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Employer's Wallet Address"
            value={employerUserAddress}
            onChange={(e) => setEmployerUserAddress(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* User List */}
        <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">Available Users</h2>
          <div className="mt-4 space-y-4">
            {users.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <Image src={user.profile} alt={user.name} width={40} height={40} className="rounded-full" />
                  <div>
                    <h3 className="font-medium dark:text-white">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Voted in {user.DaoNumber} DAOs</p>
                    {/* Star Ratings */}
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) =>
                        i < Math.round(user.Stars) ? (
                          <IoStar key={i} className="text-yellow-500" />
                        ) : (
                          <IoStarOutline key={i} className="text-gray-400" />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  onClick={() => pushToDao(user)}
                >
                  Invite to DAO
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* DAO Section */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex space-x-4">
            {daoMembers.map((member, index) => (
              <Image key={index} src={member.profile} alt={member.name} width={40} height={40} className="rounded-full" />
            ))}
          </div>

          {!isDaoCreated ? (
            <button
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={createDao}
            >
              {loading ? "Creating..." : "Create DAO"}
            </button>
          ) : (
            <button className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
              Go to DAO
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDao;
