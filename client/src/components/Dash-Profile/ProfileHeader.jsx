import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiCalendar, FiCheckCircle, FiUpload, FiX } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const MAX_BIO_LENGTH = 200;

const ProfileHeader = ({ profile, isOwnProfile, isEditing, onEditToggle, onUpdate }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [bio, setBio] = useState(profile.bio || "");
  const [displayBio, setDisplayBio] = useState(profile.bio || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: profile.socialLinks?.facebook || "",
    instagram: profile.socialLinks?.instagram || "",
    linkedin: profile.socialLinks?.linkedin || "",
    twitter: profile.socialLinks?.twitter || "",
    website: profile.socialLinks?.website || ""
  });

  // Sync local state with profile prop changes
  useEffect(() => {
    setBio(profile.bio || "");
    setDisplayBio(profile.bio || "");
    setSocialLinks(profile.socialLinks || {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      website: ""
    });
  }, [profile]);

  const handleBioUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${user._id}/profile`,
        { bio, socialLinks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setDisplayBio(res.data.bio);
      setSocialLinks(res.data.socialLinks || {});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onUpdate(res.data);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/upload-profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistically update the profile picture before the parent updates
      const updatedProfile = { 
        ...profile,
        profilePicture: res.data.url 
      };
      onUpdate(updatedProfile);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeProfilePicture = async () => {
    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/remove-profile-picture`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Optimistically update the profile picture before the parent updates
      const updatedProfile = { 
        ...profile,
        profilePicture: null 
      };
      onUpdate(updatedProfile);
    } catch (err) {
      console.error("Remove failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const SocialIcon = ({ platform, url }) => {
    const icons = {
      facebook: <FaFacebook />,
      instagram: <FaInstagram />,
      linkedin: <FaLinkedin />,
      twitter: <FaTwitter />,
      website: <FaGlobe />
    };
    
    return url ? (
      <motion.a 
        href={url.startsWith('http') ? url : `https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="text-2xl p-2 rounded-full bg-green-100/70 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 shadow-sm hover:shadow-md transition-all"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        {icons[platform]}
      </motion.a>
    ) : (
      <div 
        className="text-2xl p-2 rounded-full bg-gray-100/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-default"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        {icons[platform]}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center text-center mb-8 px-4"
    >
      {/* Background Glow Effect */}
      <motion.div 
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-green-100 dark:bg-green-900 opacity-20 dark:opacity-30 blur-3xl -z-10"
      />
      
      {/* Profile Picture and Basic Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start w-full max-w-6xl gap-8">
        {/* Left Column - Avatar and Social */}
        <div className="flex flex-col items-center md:items-start md:pr-8">
          {/* Avatar with Upload Options */}
          <motion.div 
            key={`avatar-${profile.profilePicture}`} // Force re-render on picture change
            layout
            className="relative group mb-4"
          >
            <div className="absolute inset-0 rounded-full bg-green-300 dark:bg-green-500 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300 -z-10" />
            
            {profile.profilePicture ? (
              <>
                <img
                  src={`${profile.profilePicture}?${Date.now()}`} // Cache busting
                  alt={profile.username}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${profile.username}&background=random&size=160`;
                  }}
                />
                {isEditing && (
                  <motion.button
                    onClick={removeProfilePicture}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={uploading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
                  >
                    <FiX />
                  </motion.button>
                )}
              </>
            ) : (
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 text-white flex items-center justify-center text-5xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                {profile.username?.[0]?.toUpperCase() || "B"}
              </div>
            )}
            
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex justify-center"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureUpload}
                  accept="image/*"
                  className="hidden"
                />
                <motion.button
                  onClick={() => fileInputRef.current.click()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={uploading}
                  className="px-4 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 shadow-sm flex items-center text-sm"
                >
                  <FiUpload className="mr-2" />
                  {uploading ? "Uploading..." : "Change Photo"}
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex gap-3 flex-wrap justify-center mb-4"
          >
            <SocialIcon platform="facebook" url={profile.socialLinks?.facebook} />
            <SocialIcon platform="instagram" url={profile.socialLinks?.instagram} />
            <SocialIcon platform="linkedin" url={profile.socialLinks?.linkedin} />
            <SocialIcon platform="twitter" url={profile.socialLinks?.twitter} />
            <SocialIcon platform="website" url={profile.socialLinks?.website} />
          </motion.div>

          {/* Join Date */}
          <div className="flex items-center text-gray-500 dark:text-gray-400 px-4 py-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <FiCalendar className="mr-2 text-green-500 dark:text-green-400" />
            <span className="text-sm sm:text-base">
              Joined{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>

        {/* Right Column - Bio and Info */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Username */}
          <motion.h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            {profile.username}
          </motion.h1>

          {/* Bio Section */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-bio"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mb-6"
              >
                <div className="p-1 rounded-xl bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    maxLength={MAX_BIO_LENGTH}
                    className="w-full p-4 rounded-xl border-none outline-none bg-transparent text-gray-800 dark:text-white resize-none font-sans text-lg leading-relaxed focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700"
                    placeholder="Tell your story..."
                    disabled={loading}
                  />
                </div>

                {/* Social Links - Edit Mode */}
                <motion.div 
                  className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm"
                >
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Social Links</h3>
                  <div className="space-y-3">
                    {['facebook', 'instagram', 'linkedin', 'twitter', 'website'].map((platform) => (
                      <div key={platform} className="flex items-center">
                        <div className="w-10 mr-3 text-gray-700 dark:text-gray-300">
                          {platform === 'facebook' && <FaFacebook className="text-2xl" />}
                          {platform === 'instagram' && <FaInstagram className="text-2xl" />}
                          {platform === 'linkedin' && <FaLinkedin className="text-2xl" />}
                          {platform === 'twitter' && <FaTwitter className="text-2xl" />}
                          {platform === 'website' && <FaGlobe className="text-2xl" />}
                        </div>
                        <input
                          type="text"
                          value={socialLinks[platform] || ""}
                          onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                          placeholder={`https://${platform}.com/username`}
                          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-300 dark:focus:ring-green-700"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="flex justify-between items-center mt-6 px-2">
                  <div className="text-sm text-gray-500">
                    {bio.length}/{MAX_BIO_LENGTH}
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => onEditToggle()}
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleBioUpdate}
                      disabled={loading || bio.length > MAX_BIO_LENGTH}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-2 rounded-full font-medium transition-all ${
                        loading
                          ? "bg-gray-400 text-white"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3"
                    >
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-sm font-medium">
                        <FiCheckCircle className="mr-2" />
                        Profile updated successfully!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="display-bio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mb-6"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-md transition-all duration-300">
                  <div className="absolute inset-0 rounded-xl bg-green-50 dark:bg-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">
                    {displayBio || (isOwnProfile ? "Tell your story..." : "This writer prefers mystery...")}
                  </p>
                  {displayBio && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Profile Button */}
          {isOwnProfile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEditToggle}
              className={`px-6 py-3 rounded-full font-medium flex items-center transition-all ${
                isEditing
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm hover:shadow-md"
              }`}
            >
              <FiEdit className="mr-2" />
              {isEditing ? "Finish Editing" : "Edit Profile"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;