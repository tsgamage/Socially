"use client";
import CreatePost from "@/components/Home/CreatePost";
import PostCard from "@/components/Home/PostCard";
import SinglePostModal from "@/components/main/SinglePostModal";
import { useState } from "react";

const dummyPosts = [
  {
    id: "1",
    user: {
      name: "John Doe",
      username: "johndoe",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    date: "August 28, 2025",
    content: "Just enjoying the beautiful weather today! ☀️",
    images: ["https://picsum.photos/id/1015/1000/600"],
    likes: 10,
    comments: 5,
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      username: "janesmith",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    date: "August 27, 2025",
    content: "Had a great time at the beach with friends! 🏖️",
    images: [
      "https://picsum.photos/id/1018/1000/600",
      "https://picsum.photos/id/1019/1000/600",
    ],
    likes: 20,
    comments: 10,
  },
  {
    id: "3",
    user: {
      name: "Peter Jones",
      username: "peterjones",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    },
    date: "August 26, 2025",
    content: "Just finished a great book! Highly recommend it. 📚",
    images: [],
    likes: 15,
    comments: 7,
  },
  {
    id: "4",
    user: {
      name: "Mary Johnson",
      username: "maryjohnson",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    },
    date: "August 25, 2025",
    content: "My new puppy is the cutest! ❤️",
    images: [
      "https://picsum.photos/id/1025/1000/600",
      "https://picsum.photos/id/1026/1000/600",
      "https://picsum.photos/id/1027/1000/600",
    ],
    likes: 30,
    comments: 12,
  },
  {
    id: "5",
    user: {
      name: "Alice Brown",
      username: "alicebrown",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026708d",
    },
    date: "August 24, 2025",
    content: "Exploring new places! This view is breathtaking. ⛰️",
    images: ["https://picsum.photos/id/1030/1000/600"],
    likes: 25,
    comments: 8,
  },
  {
    id: "6",
    user: {
      name: "Bob White",
      username: "bobwhite",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026709d",
    },
    date: "August 23, 2025",
    content: "Delicious dinner tonight! 🍝",
    images: [
      "https://picsum.photos/id/1035/1000/600",
      "https://picsum.photos/id/1036/1000/600",
      "https://picsum.photos/id/1037/1000/600",
      "https://picsum.photos/id/1038/1000/600",
    ],
    likes: 18,
    comments: 6,
  },
  {
    id: "7",
    user: {
      name: "Charlie Green",
      username: "charliegreen",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026710d",
    },
    date: "August 22, 2025",
    content: "Morning run views. So refreshing! 🏃‍♀️",
    images: [
      "https://picsum.photos/id/1040/1000/600",
      "https://picsum.photos/id/1041/1000/600",
      "https://picsum.photos/id/1042/1000/600",
      "https://picsum.photos/id/1043/1000/600",
      "https://picsum.photos/id/1044/1000/600",
    ],
    likes: 22,
    comments: 9,
  },
  {
    id: "8",
    user: {
      name: "Diana Prince",
      username: "dianaprince",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026711d",
    },
    date: "August 21, 2025",
    content: "New art project in progress. Stay tuned! 🎨",
    images: [],
    likes: 12,
    comments: 4,
  },
  {
    id: "9",
    user: {
      name: "Eve Adams",
      username: "eveadams",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026712d",
    },
    date: "August 20, 2025",
    content: "Throwback to last summer's adventure! ☀️",
    images: [
      "https://picsum.photos/id/1050/1000/600",
      "https://picsum.photos/id/1051/1000/600",
    ],
    likes: 28,
    comments: 11,
  },
  {
    id: "10",
    user: {
      name: "Frank Miller",
      username: "frankmiller",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026713d",
    },
    date: "August 19, 2025",
    content: "Coding all night! 💻",
    images: [],
    likes: 8,
    comments: 3,
  },
  {
    id: "11",
    user: {
      name: "Grace Taylor",
      username: "gracetaylor",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026714d",
    },
    date: "August 18, 2025",
    content: "Weekend vibes!  relaxing by the pool. 🏊‍♀️",
    images: [
      "https://picsum.photos/id/1060/1000/600",
      "https://picsum.photos/id/1061/1000/600",
      "https://picsum.photos/id/1062/1000/600",
    ],
    likes: 35,
    comments: 15,
  },
  {
    id: "12",
    user: {
      name: "Henry Wilson",
      username: "henrywilson",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026715d",
    },
    date: "August 17, 2025",
    content: "Hiking in the mountains. So peaceful. 🌲",
    images: [
      "https://picsum.photos/id/1070/1000/600",
      "https://picsum.photos/id/1071/1000/600",
      "https://picsum.photos/id/1072/1000/600",
      "https://picsum.photos/id/1073/1000/600",
      "https://picsum.photos/id/1074/1000/600",
    ],
    likes: 40,
    comments: 18,
  },
  {
    id: "13",
    user: {
      name: "Ivy Moore",
      username: "ivymoore",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026716d",
    },
    date: "August 16, 2025",
    content: "Baking some cookies! 🍪",
    images: [],
    likes: 10,
    comments: 5,
  },
  {
    id: "14",
    user: {
      name: "Jack King",
      username: "jackking",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026717d",
    },
    date: "August 15, 2025",
    content: "Concert night! 🎸",
    images: [
      "https://picsum.photos/id/1080/1000/600",
      "https://picsum.photos/id/1081/1000/600",
      "https://picsum.photos/id/1082/1000/600",
      "https://picsum.photos/id/1083/1000/600",
      "https://picsum.photos/id/1084/1000/600",
      "https://picsum.photos/id/1085/1000/600",
    ],
    likes: 50,
    comments: 20,
  },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost />
      <div>
        {dummyPosts.map((post, index) => (
          <PostCard key={index} post={post} onClick={() => handlePostClick(post)} />
        ))}
      </div>
      {showModal && selectedPost && (
        <SinglePostModal post={selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  );
}
