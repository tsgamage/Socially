import Image from "next/image";

interface Post {
  user: {
    name: string;
    avatar: string;
  };
  date: string;
  content: string;
  images?: string[];
}

export default function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const renderImages = (images: string[]) => {
    const count = images.length;

    if (count === 1) {
      return (
        <div className="relative w-full h-96">
          <Image src={images[0]} alt="Post image" className="w-full h-full object-cover" width={1000} height={600} />
        </div>
      );
    } else if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 w-full h-96">
          <div className="relative col-span-1">
            <Image src={images[0]} alt="Post image 1" className="w-full h-full object-cover" width={500} height={500} />
          </div>
          <div className="relative col-span-1">
            <Image src={images[1]} alt="Post image 2" className="w-full h-full object-cover" width={500} height={500} />
          </div>
        </div>
      );
    } else if (count === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-96">
          <div className="relative col-span-2 row-span-2">
            <Image src={images[0]} alt="Post image 1" className="w-full h-full object-cover" width={1000} height={600} />
          </div>
          <div className="relative col-span-1">
            <Image src={images[1]} alt="Post image 2" className="w-full h-full object-cover" width={500} height={500} />
          </div>
          <div className="relative col-span-1">
            <Image src={images[2]} alt="Post image 3" className="w-full h-full object-cover" width={500} height={500} />
          </div>
        </div>
      );
    } else if (count === 4) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-96">
          <div className="relative col-span-1 row-span-1">
            <Image src={images[0]} alt="Post image 1" className="w-full h-full object-cover" width={500} height={500} />
          </div>
          <div className="relative col-span-1 row-span-1">
            <Image src={images[1]} alt="Post image 2" className="w-full h-full object-cover" width={500} height={500} />
          </div>
          <div className="relative col-span-1 row-span-1">
            <Image src={images[2]} alt="Post image 3" className="w-full h-full object-cover" width={500} height={500} />
          </div>
          <div className="relative col-span-1 row-span-1">
            <Image src={images[3]} alt="Post image 4" className="w-full h-full object-cover" width={500} height={500} />
          </div>
        </div>
      );
    } else if (count >= 5) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-96">
          <div className="relative col-span-1 row-span-1">
            <Image src={images[0]} alt="Post image 1" className="w-full h-full object-cover" width={500} height={500} />
          </div>
          <div className="relative col-span-1 row-span-1">
            <Image src={images[1]} alt="Post image 2" className="w-full h-full object-cover" width={500} height={500} />
          </div>
          <div className="relative col-span-1 row-span-1">
            <Image src={images[2]} alt="Post image 3" className="w-full h-full object-cover" width={500} height={500} />
          </div>
          <div className="relative col-span-1 row-span-1">
            <Image src={images[3]} alt="Post image 4" className="w-full h-full object-cover" width={500} height={500} />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">
              +{count - 4}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card bg-base-200 shadow-xl border border-base-content/20 mb-4 cursor-pointer" onClick={onClick}>
      <div className="card-body">
        <div className="flex items-center mb-4">
          <div className="avatar mr-4">
            <div className="w-12 rounded-full">
              <Image src={post.user.avatar} alt={post.user.name} width={48} height={48} />
            </div>
          </div>
          <div>
            <h2 className="card-title">{post.user.name}</h2>
            <p className="text-sm text-base-content/70">{post.date}</p>
          </div>
          <div className="flex-grow"></div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Edit</a></li>
              <li><a>Delete</a></li>
              <li><a>Report</a></li>
            </ul>
          </div>
        </div>
        <p className="mb-4">{post.content}</p>
      </div>
      {post.images && post.images.length > 0 && renderImages(post.images)}
      <div className="card-body">
        <div className="card-actions justify-between">
          <div className="flex space-x-4">
            <button className="btn btn-ghost btn-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>Like</button>
            <button className="btn btn-ghost btn-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>Comment</button>
            <button className="btn btn-ghost btn-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.882 13.07 9 12.734 9 12c0-.734-.118-1.07-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.516 3.756A3 3 0 0021 12a3 3 0 00-5.8-1.342l-6.516-3.756m0 2.684a3 3 0 110-2.684m0 2.684L12 12l-3.316 1.342z" /></svg>Share</button>
          </div>
          <button className="btn btn-ghost btn-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>Save</button>
        </div>
      </div>
    </div>
  );
}
