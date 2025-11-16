// src/components/Profile.jsx

import React, { useState, useEffect } from "react";
import { FaSave, FaSpinner, FaCamera } from "react-icons/fa";
import { auth, db, isUsernameUnique } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import defaultAvatar from "../assets/default.jpg";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
  });
  const [profilePic, setProfilePic] = useState(null); // For the new file
  const [profilePicUrl, setProfilePicUrl] = useState(defaultAvatar); // For the preview
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // 1. Listen for auth changes
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  // 2. Fetch user data when component loads
  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      const userDocRef = doc(db, "user", currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          fullName: data.fullName || "",
          username: data.username || "",
          bio: data.bio || "", // Add bio
        });
        setProfilePicUrl(data.image || defaultAvatar);
      } else {
        console.log("No such user document!");
      }
    };

    fetchUserData();
  }, [currentUser]); // Re-run when user logs in

  // 3. Handle text input changes
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  // 5. Handle saving all changes
  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    let newImageUrl = profilePicUrl;
    const newUsername = formData.username.trim().toLowerCase();

    try {
      if (!newUsername) {
        alert("Username cannot be empty.");
        setIsLoading(false);
        return;
      }

      const isUnique = await isUsernameUnique(newUsername, currentUser?.uid);
      if (!isUnique) {
        alert("This username is already taken. Please choose another one.");
        setIsLoading(false);
        return;
      }

      // Step 1: Upload new image if one was selected
      if (profilePic) {
        const storage = getStorage();
        // Create a unique path for the image
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);

        await uploadBytes(storageRef, profilePic);
        newImageUrl = await getDownloadURL(storageRef);
      }

      // Step 2: Update the user's document in Firestore
      const userDocRef = doc(db, "user", currentUser.uid);
      await updateDoc(userDocRef, {
        fullName: formData.fullName.trim(),
        username: newUsername,
        bio: formData.bio.trim(),
        image: newImageUrl,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. " + err.message);
    } finally {
      setIsLoading(false);
      setProfilePic(null);
    }
  };

  return (
    // Use w-full to fill the remaining space next to NavLinks
    <section className="flex flex-col justify-center items-center h-screen w-full bg-slate-900 background_image">
      <div
        className="w-full max-w-md flex flex-col justify-center items-center 
                   rounded-2xl bg-slate-800/60 p-6 backdrop-blur-lg 
                   border border-slate-700/50 shadow-2xl shadow-black/30"
      >
        <div className="mb-6 text-center">
          <h1 className="text-[28px] font-bold text-slate-100">My Profile</h1>
          <p className="text-sm text-slate-400 font-light">
            Update your profile details
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="relative mb-6">
          <img
            src={profilePicUrl}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-700 shadow-lg"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <label
            htmlFor="profile-pic-upload"
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-sky-500 rounded-full
                       flex items-center justify-center text-white cursor-pointer
                       border-4 border-slate-800 hover:bg-sky-400 transition-colors"
          >
            <FaCamera />
          </label>
          <input
            type="file"
            id="profile-pic-upload"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Form Section */}
        <form className="w-full space-y-4" onSubmit={handleSave}>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleTextChange}
            className="w-full p-2.5 rounded-md bg-slate-900/70 text-slate-200 placeholder:text-slate-500 
                       border border-slate-700 shadow-inner shadow-black/20 outline-none 
                       focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50 
                       transition-all duration-300"
            placeholder="Full Name"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleTextChange}
            className="w-full p-2.5 rounded-md bg-slate-900/70 text-slate-200 placeholder:text-slate-500 
                       border border-slate-700 shadow-inner shadow-black/20 outline-none 
                       focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50 
                       transition-all duration-300"
            placeholder="Username"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleTextChange}
            className="w-full p-2.5 rounded-md bg-slate-900/70 text-slate-200 placeholder:text-slate-500 
                       border border-slate-700 shadow-inner shadow-black/20 outline-none 
                       focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50 
                       transition-all duration-300"
            placeholder="Your bio..."
            rows={3}
          />

          <div className="w-full mt-6">
            <button
              type="submit"
              className="w-full p-2.5 font-bold rounded-md cursor-pointer 
                         bg-linear-to-r from-sky-400 to-sky-500 text-slate-900 
                         shadow-lg shadow-sky-500/20 
                         hover:shadow-xl hover:shadow-sky-500/30 hover:scale-[1.02] 
                         transition-all duration-300 ease-in-out
                         disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="inline mr-2 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className="inline mr-2" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
