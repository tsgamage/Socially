import Image from "next/image";

export default function CreatePost() {
  return (
    <div className="card bg-base-200 shadow-xl border border-base-content/20 mb-4">
      <div className="card-body">
        <div className="flex items-center mb-4">
          <div className="avatar mr-4">
            <div className="w-12 rounded-full">
              <Image src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User Avatar" width={48} height={48} />
            </div>
          </div>
          <textarea
            className="textarea textarea-bordered flex-grow"
            placeholder="What's on your mind?"
          ></textarea>
        </div>
        {/* Image preview area */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Placeholder for image previews */}
        </div>
        <div className="card-actions justify-between items-center mt-4">
          <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
          <button className="btn btn-primary">Post</button>
        </div>
      </div>
    </div>
  );
}
