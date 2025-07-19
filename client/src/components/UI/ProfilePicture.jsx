import React, { useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const avatarOptions = [
  { id: 1, url: '/avatars/girl1.jpg', label: 'Girl 1' },
  { id: 2, url: '/avatars/girl2.jpg', label: 'Girl 2' },
  { id: 3, url: '/avatars/Boy1.jpg', label: 'Boy 1' },
  { id: 4, url: '/avatars/Boy2.jpg', label: 'Boy 2' },
  { id: 5, url: '/avatars/Man1.jpg', label: 'Man 1' },
  { id: 6, url: '/avatars/Man2.jpg', label: 'Man 2' },
  { id: 7, url: '/avatars/Boy3.jpg', label: 'Boy 3' }
];

const ProfilePicture = ({ user, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const fileInputRef = useRef();

  const handleAvatarSelect = async (avatar) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ avatarUrl: avatar.url })
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate(data.profilePicture);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate(data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="relative">
      <img
        src={user.profilePicture || '/avatars/default.png'}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-white shadow-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />

      <Transition show={isOpen} as={React.Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Choose Your Avatar
                </Dialog.Title>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  {avatarOptions.map((avatar) => (
                    <div
                      key={avatar.id}
                      className={`p-1 rounded-full cursor-pointer ${selectedAvatar?.id === avatar.id ? 'ring-2 ring-indigo-500' : ''}`}
                      onClick={() => setSelectedAvatar(avatar)}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.label}
                        className="w-full h-auto rounded-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Upload Custom
                  </button>
                  
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    onClick={() => selectedAvatar && handleAvatarSelect(selectedAvatar)}
                    disabled={!selectedAvatar}
                  >
                    Save Avatar
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProfilePicture;