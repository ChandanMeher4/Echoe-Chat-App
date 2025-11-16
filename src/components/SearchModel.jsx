import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { RiSearchLine } from "react-icons/ri";
import defaultAvatar from "../assets/default.jpg";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

const SearchModel = ({startChat}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      alert("please enter an username");
    }

    try {
      const normalizedSearchName = search.trim().toLowerCase();
      console.log(`Searching for: "[${normalizedSearchName}]"`);
      const q = query(
        collection(db, "user"),
        where("username", ">=", normalizedSearchName),
        where("username", "<=", normalizedSearchName + "\uf8ff")
      );

      const querySnapShot = await getDocs(q);

      const foundUsers = [];

      querySnapShot.forEach((doc) => {
        foundUsers.push(doc.data());
      });

      setUsers(foundUsers);

      if (foundUsers.length === 0) {
        alert("No users found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(users);

  return (
    <div>
      {/* This is the trigger button */}
      <button
        className="w-10 h-10 p-2 flex items-center justify-center rounded-lg
				   bg-slate-700/50 text-slate-400
				   hover:bg-slate-600/50 hover:text-sky-400
				   transition-colors duration-200"
        onClick={openModal}
      >
        <RiSearchLine className="w-6 h-6" />
      </button>
      {isModalOpen && (
        <>
          {/* {MODAL} */}
          <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-slate-900/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="relative w-full p-4 max-w-md"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="relative bg-slate-800 w-full rounded-lg shadow-xl border border-slate-700/50">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                  <h3 className="text-xl font-semibold text-slate-200">
                    Search Chats
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-slate-400 bg-transparent hover:bg-slate-700/50 hover:text-sky-400 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                  >
                    <FaXmark className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 space-y-4">
                  {/* Search Input (like ChatBox) */}
                  <div className="flex items-center relative bg-slate-700 h-11 rounded-lg">
                    <input
                      type="text"
                      className="h-full w-full bg-transparent pl-4 pr-12 text-slate-200 placeholder:text-slate-500 outline-none rounded-lg"
                      placeholder="Search by name..."
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors"
                      onClick={handleSearch}
                    >
                      <FaSearch />
                    </button>
                  </div>

                  {/* Dummy Search Result (like ChatList item) */}
                  <div className="mt-4 space-y-2">
                    {users.map((user) => (
                      <>
                        <div onClick={()=>{
                          console.log(user)
                          startChat(user)
                          closeModal()
                        }} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors">
                          <img
                            src={user?.image || defaultAvatar}
                            alt="avatar"
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700"
                          />
                          <span>
                            <h2 className="font-semibold text-slate-200">
                              {user?.fullName}
                            </h2>
                            <p className="text-sm text-slate-400">
                              @{user?.username}
                            </p>
                          </span>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchModel;
