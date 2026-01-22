import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/routes/constants";
import {
  useUpdateSellerProfileMutation,
  useGetSellerProfileQuery,
} from "../../features/sellerprofile/sellerApi";
import { renderIcon } from "../../shared/utils/iconMap";
import { sellerProfileDto } from "@/types/api";

const EditSellerProfile: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState<boolean | undefined>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { data, isLoading, error } = useGetSellerProfileQuery();
  const [updateSellerProfile, { isLoading: isUpdating }] =
    useUpdateSellerProfileMutation();

  const navigate = useNavigate();

  // Initialize MFA + profile image when data loads
  useEffect(() => {
    if (data) {
      setMfaEnabled(data.mfaEnabled);
      if (data.profileImage) {
        setProfileImage(data.profileImage);
        setPreview(data.profileImage);
      }
    }
  }, [data]);

  const covertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const convertedImage = await covertToBase64(file);
      setProfileImage(convertedImage);
      setPreview(convertedImage);
    } catch (err) {
      console.error("Error converting image:", err);
    }
  };

  const editUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;

    const form = e.currentTarget;

    const firstNameInput = form.firstName as HTMLInputElement;
    const lastNameInput = form.lastName as HTMLInputElement;
    const phoneInput = form.phone as HTMLInputElement;
    const addressInput = form.address as HTMLInputElement;
    const mfaSelect = form.mfa as HTMLSelectElement;

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    // Safely split existing name into first + last
    const fullNameParts = (data.name || "").split(" ");
    const currentFirst = fullNameParts[0] || "";
    const currentLast = fullNameParts.slice(1).join(" ") || "";

    const newFirst = firstName || currentFirst;
    const newLast = lastName || currentLast;

    const name =
      `${newFirst} ${newLast}`.trim() || data.name || "";

    const user: sellerProfileDto = {
      ...data, // keep any other fields from the DTO
      name,
      phone: phone || data.phone || "",
      address: address || data.address || "",
      mfaEnabled: mfaSelect.value === "true",
      profileImage: profileImage || data.profileImage || "",
    };

    try {
      await updateSellerProfile(user).unwrap();
      window.requestAnimationFrame(() => {
        navigate(ROUTES.SELLER.PROFILE);
      });
    } catch (err) {
      console.error("Failed to update seller profile", err);
    }
  };

  // Simple loading/error state (optional)
  if (isLoading) {
    return (
      <section className="bg-white inset-0 h-max text-black rounded-lg p-6 border-2 my-20 mx-4 sm:my-16 sm:mx-4 absolute -top-12 right-0 z-[100]">
        <p className="text-center text-sm text-gray-600">Loading profile…</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-white inset-0 h-max text-black rounded-lg p-6 border-2 my-20 mx-4 sm:my-16 sm:mx-4 absolute -top-12 right-0 z-[100]">
        <p className="text-center text-sm text-red-600">
          Failed to load profile.
        </p>
      </section>
    );
  }

  // Pre-fill name fields from existing full name
  const fullNameParts = (data.name || "").split(" ");
  const defaultFirstName = fullNameParts[0] || "";
  const defaultLastName = fullNameParts.slice(1).join(" ") || "";

  return (
    <section className="bg-white inset-0 h-max text-black rounded-lg p-6 border-2 my-20 mx-4 sm:my-16 sm:mx-4 absolute -top-12 right-0 z-[100]">
      <form
        onSubmit={editUser}
        id="edit-users"
        className="flex flex-col gap-4"
      >
        <div>
          <div className="flex justify-center flex-col items-center">
            <div className="sm:w-24 sm:h-24 w-20 h-20 rounded-full bg-gray-400 flex justify-center items-center relative overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-white">No Image</span>
              )}
              <label
                htmlFor="image"
                className="absolute bg-gray-800 text-white p-2 rounded-full bottom-1 right-1 cursor-pointer hover:bg-gray-900 transition-colors"
              >
                {renderIcon("FiEdit", "w-4 h-4")}
              </label>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="mt-2 hidden"
              name="image"
              id="image"
              onChange={handleChange}
            />
            <p className="font-light text-xs mt-2">
              Click the icon to upload profile picture
            </p>
          </div>

          <div className="flex flex-col gap-2 absolute top-3 right-3">
            {/* SAVE BUTTON – make it look clearly clickable */}
            <button
              className="rounded-xl px-4 py-2 bg-black text-white border-2 border-black text-sm sm:w-32 w-20 text-center font-semibold hover:bg-neutral-900 hover:border-neutral-900 active:scale-[0.98] transition-transform transition-colors disabled:bg-neutral-500 disabled:border-neutral-500"
              type="submit"
              form="edit-users"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>

            <Link
              to={ROUTES.SELLER.PROFILE}
              className="rounded-xl border-black py-1 px-4 border-2 text-center bg-white text-black text-sm sm:w-32 w-20 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full mt-4">
          <label
            htmlFor="firstName"
            className="font-bold text-sm text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            defaultValue={defaultFirstName}
            className="w-full border-2 bg-transparent rounded-xl p-2 focus:border-blue-400 focus:outline-none"
          />

          <label
            htmlFor="lastName"
            className="font-bold text-sm text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            defaultValue={defaultLastName}
            className="w-full border-2 bg-transparent rounded-xl p-2 focus:border-blue-400 focus:outline-none"
          />

          <label
            htmlFor="phone"
            className="font-bold text-sm text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            defaultValue={data.phone ?? ""}
            className="w-full border-2 bg-transparent rounded-xl p-2 focus:border-blue-400 focus:outline-none"
          />

          <label
            htmlFor="address"
            className="font-bold text-sm text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            defaultValue={data.address ?? ""}
            className="w-full border-2 bg-transparent rounded-xl p-2 focus:border-blue-400 focus:outline-none"
          />

          <label
            htmlFor="mfa"
            className="font-bold text-sm text-gray-700 mb-1"
          >
            MFA Enabled
          </label>
          <select
            name="mfa"
            id="mfa"
            value={String(mfaEnabled)}
            onChange={(e) => setMfaEnabled(e.target.value === "true")}
            className="w-full border-2 bg-transparent rounded-xl p-2 focus:border-blue-400 focus:outline-none"
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>

          <label
            htmlFor="user-id"
            className="font-bold text-sm text-gray-700 mb-1"
          >
            User ID
          </label>
          <input
            type="text"
            value={data.id}
            id="user-id"
            className="w-full border-2 bg-black text-white rounded-xl px-4 py-2"
            disabled
          />
        </div>
      </form>
    </section>
  );
};

export default EditSellerProfile;
