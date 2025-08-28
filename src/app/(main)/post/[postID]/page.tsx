import SinglePostModal from "@/components/main/SinglePostModal";
import { redirect } from "next/navigation";

// Reusing dummyPosts for content
const dummyPosts = [
  {
    id: "1",
    user: {
      name: "John Doe",
      username: "john_doe",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    date: "August 28, 2025",
    content: "Just enjoying the beautiful weather today! ☀️",
    images: ["https://picsum.photos/id/1015/1000/600"],
    likes: 120,
    comments: 15,
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      username: "jane_smith",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    date: "August 27, 2025",
    content: "Had a great time at the beach with friends! 🏖️",
    images: [
      "https://picsum.photos/id/1018/1000/600",
      "https://picsum.photos/id/1019/1000/600",
    ],
    likes: 250,
    comments: 30,
  },
  {
    id: "3",
    user: {
      name: "Peter Jones",
      username: "peter_jones",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    },
    date: "August 26, 2025",
    content: "Just finished a great book! Highly recommend it. 📚",
    images: ["https://picsum.photos/id/1020/1000/600"],
    likes: 80,
    comments: 5,
  },
  {
    id: "4",
    user: {
      name: "Mary Johnson",
      username: "mary_j",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    },
    date: "August 25, 2025",
    content: "My new puppy is the cutest! ❤️",
    images: [
      "https://picsum.photos/id/1025/1000/600",
      "https://picsum.photos/id/1026/1000/600",
      "https://picsum.photos/id/1027/1000/600",
    ],
    likes: 300,
    comments: 45,
  },
];

export default function SinglePost({ params }: { params: { postID: string } }) {
  const post = dummyPosts.find((p) => p.id === params.postID);

  if (!post) {
    redirect("/"); // Redirect to home if post not found
  }

  const handleClose = () => {
    redirect("/"); // Redirect to home or previous page
  };

  return <SinglePostModal post={post} onClose={handleClose} />;
}

