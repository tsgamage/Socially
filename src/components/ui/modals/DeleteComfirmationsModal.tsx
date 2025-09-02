import { Loader2 } from "lucide-react";

type Props = {
  ref: React.RefObject<HTMLDialogElement> | null;
  onDelete: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
};

export default function DeleteComfirmationModal({ ref, onDelete, isDeleting, title, description }: Props) {
  return (
    <dialog ref={ref} id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title || "Are you sure?"}</h3>
        <p className="py-4">{description || "This action cannot be undone."}</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2 ">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
            <button type="button" className="btn btn-outline btn-error" onClick={onDelete}>
              {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
