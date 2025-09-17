"use client";

import { AtSign, Loader } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  onSubmit: (username: string) => void;
  placeholder: string;
  isSending: boolean;
  isError: boolean;
  error: string;
  successMessage: string;
};

export default function FriendsSearch({ onSubmit, placeholder, isSending, isError, error, successMessage }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (successMessage) {
      setSearchQuery("");
    }
  }, [successMessage]);

  function handleOnClick() {
    if (searchQuery.trim()) {
      onSubmit(searchQuery as string);
    } else {
      setSearchQuery("");
    }
  }

  return (
    <div className="relative mb-4 sm:mb-6">
      <div className="flex items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative w-full">
          <label
            htmlFor="friendsSearchInput"
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
          >
            <AtSign size={18} className="z-10" />
          </label>
          <input
            id="friendsSearchInput"
            type="text"
            placeholder={placeholder}
            className={`input w-full pl-9 ${isError ? "input-error" : successMessage ? "input-success" : "input-bordered"}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleOnClick()}
          />
        </div>
        <button className="btn btn-primary shrink-0" disabled={isSending} onClick={handleOnClick}>
          {isSending ? <Loader size={20} className="animate-spin" /> : "Send"}
        </button>
      </div>
      {isError && <p className="text-error text-sm mt-1">{error}</p>}
      {successMessage && <p className="text-success text-sm mt-1">{successMessage}</p>}
    </div>
  );
}
