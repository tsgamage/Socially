import React, { useState } from "react";

type Props = {
  ref: React.RefObject<HTMLDialogElement>;
  title?: string;
  onChange: (value: string) => void;
};

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  //   { value: "friends", label: "Friends" },
  //   { value: "unlisted", label: "Unlisted" },
];

export default function VisibilityChangeModal({ ref, onChange }: Props) {
  const [selected, setSelected] = useState<string>("public");

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex flex-col gap-6 sm:gap-8 justify-center px-6 py-8">
        <fieldset className="flex flex-col gap-2">
          <label className="label text-base font-medium mb-1" htmlFor="visibility-select">
            Select a visibility option
          </label>
          <select
            id="visibility-select"
            className="select select-bordered w-full"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {VISIBILITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </fieldset>
        <div className="modal-action flex justify-end gap-3 mt-4">
          <form method="dialog" className="flex gap-2">
            <button className="btn btn-ghost px-6" type="submit">
              Close
            </button>
            <button type="button" className="btn btn-primary px-6" onClick={() => onChange(selected)}>
              Change
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
