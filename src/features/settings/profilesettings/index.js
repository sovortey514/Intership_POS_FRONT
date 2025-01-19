import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from '../../../components/Cards/TitleCard';
import { showNotification } from '../../common/headerSlice';
import InputText from '../../../components/Input/InputText';
import TextAreaInput from '../../../components/Input/TextAreaInput';
import ToogleInput from '../../../components/Input/ToogleInput';

const ProfileSettings = ({ userId }) => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    department: 'OFL',
    language: 'English',
    profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKJQp8ndvEkIa-u1rMgJxVc7BBsR11uSLHGA&s',
  });

  const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKJQp8ndvEkIa-u1rMgJxVc7BBsR11uSLHGA&s';

  const department = 'OFL';
  const language ='English';
  const [username, setUsername]= useState("")



    const fetchUserById = async (userId) => {
      try {
        const response = await fetch(`http://localhost:6060/auth/users/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          // Log the fetched data to the console
          console.log('Fetched user data:', userData);
          
          setProfile({
            name: userData.name || '',
            username: userData.username || '', // Assuming 'username' should be used for email
            profileImage: userData.profileImage || defaultImage, 
            department: userData.department || department,
            language: userData.language || language,
           
          });
        } else {
          console.error('Failed to fetch user:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
  
    useEffect(()=>{
      const user =localStorage.getItem("username");
      setUsername(user)
    },[])
    
  const handleImageError = () => {
    setProfile(prev => ({ ...prev, profileImage: defaultImage }));
  };

  const updateProfile = () => {
    dispatch(showNotification({ message: "Profile Updated", status: 1 }));
  };

  const updateFormValue = (updateType, value) => {
    setProfile(prev => ({ ...prev, [updateType.toLowerCase()]: value }));
  };

  const InputText = ({ labelTitle, defaultValue, updateFormValue }) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600 mb-1">{labelTitle}</label>
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={(e) => updateFormValue(labelTitle, e.target.value)}
        className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-150 ease-in-out"
      />
    </div>
  );

  const TitleCard = ({ title, topMargin, children }) => (
    <div className={`bg-white shadow-lg rounded-lg p-6 ${topMargin}`}>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
      {children}
    </div>
  );

  return (
    <>
      <TitleCard topMargin="mt-4">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={profile.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
              onError={handleImageError}
            />
            {/* Edit Button */}
            <button
              className="absolute bottom-0 right-0 bg-white text-yellow-500 p-2 rounded-full shadow-lg transition-colors duration-300 ease-in-out hover:text-yellow-600"
              aria-label="Edit Profile Picture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <h2 className="text-2xl mt-4 font-semibold text-gray-800">{profile.name}</h2>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <InputText
            labelTitle="Name"
            defaultValue={profile.name}
            readOnly={true} 
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle="User name"
            defaultValue={username}
            readOnly={true} 
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle="Department"
            defaultValue={profile.department}
            readOnly={true} 
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle="Language"
            defaultValue={profile.language}
            readOnly={true} 
            updateFormValue={updateFormValue}
          />
        </div>

        <div className="border-t border-gray-300 mt-6 mb-8"></div>

        
      </TitleCard>
    </>
  );
};

export default ProfileSettings;
