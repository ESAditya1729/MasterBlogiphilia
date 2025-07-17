import React from "react";

const BioSection = ({ bio, editing, colors, handleSave, setBio, setEditing }) => {
  return (
    <div className="mt-4">
      {editing ? (
        <>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
            className={`w-full px-3 py-2 rounded-xl border ${colors.border} dark:bg-gray-700 ${colors.text} text-sm resize-none font-sans`}
            placeholder="Write something about yourself..."
            maxLength="500"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className={`px-4 py-1.5 text-sm rounded-xl ${colors.button} transition shadow-md`}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className={`px-4 py-1.5 text-sm rounded-xl border ${colors.border} ${colors.text} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p
            className={`text-sm font-sans leading-relaxed ${
              bio ? colors.text : "text-gray-400 italic"
            }`}
          >
            {bio || "No bio added yet."}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 mt-2 text-xs rounded-xl bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-white hover:bg-indigo-200 dark:hover:bg-gray-600 transition shadow-sm"
          >
            Edit Bio
          </button>
        </>
      )}
    </div>
  );
};

export default BioSection;