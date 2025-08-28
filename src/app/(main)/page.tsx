import CreatePost from "@/components/main/CreatePost";
import PostCard from "@/components/main/PostCard";

const dummyPosts = [
  {
    user: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    date: "August 28, 2025",
    content: "Just enjoying the beautiful weather today! ☀️",
    images: ["https://picsum.photos/id/1015/1000/600"],
  },
  {
    user: {
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    date: "August 27, 2025",
    content: "Had a great time at the beach with friends! 🏖️",
    images: [
      "https://picsum.photos/id/1018/1000/600",
      "https://picsum.photos/id/1019/1000/600",
    ],
  },
  {
    user: {
      name: "Peter Jones",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    },
    date: "August 26, 2025",
    content: "Just finished a great book! Highly recommend it. 📚",
  },
  {
    user: {
      name: "Mary Johnson",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    },
    date: "August 25, 2025",
    content: "My new puppy is the cutest! ❤️",
    images: [
      "https://picsum.photos/id/1025/1000/600",
      "https://picsum.photos/id/1026/1000/600",
      "https://picsum.photos/id/1027/1000/600",
    ],
  },
  {
    user: {
      name: "Alice Brown",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026708d",
    },
    date: "August 24, 2025",
    content: "Exploring new places! This view is breathtaking. ⛰️",
    images: ["https://picsum.photos/id/1030/1000/600"],
  },
  {
    user: {
      name: "Bob White",
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
  },
  {
    user: {
      name: "Charlie Green",
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
  },
  {
    user: {
      name: "Diana Prince",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026711d",
    },
    date: "August 21, 2025",
    content: "New art project in progress. Stay tuned! 🎨",
  },
  {
    user: {
      name: "Eve Adams",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026712d",
    },
    date: "August 20, 2025",
    content: "Throwback to last summer's adventure! ☀️",
    images: [
      "https://picsum.photos/id/1050/1000/600",
      "https://picsum.photos/id/1051/1000/600",
    ],
  },
  {
    user: {
      name: "Frank Miller",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026713d",
    },
    date: "August 19, 2025",
    content: "Coding all night! 💻",
  },
  {
    user: {
      name: "Grace Taylor",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026714d",
    },
    date: "August 18, 2025",
    content: "Weekend vibes!  relaxing by the pool. 🏊‍♀️",
    images: [
      "https://picsum.photos/id/1060/1000/600",
      "https://picsum.photos/id/1061/1000/600",
      "https://picsum.photos/id/1062/1000/600",
    ],
  },
  {
    user: {
      name: "Henry Wilson",
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
  },
  {
    user: {
      name: "Ivy Moore",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026716d",
    },
    date: "August 16, 2025",
    content: "Baking some cookies! 🍪",
  },
  {
    user: {
      name: "Jack King",
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
  },
];

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost />
      <div>
        {dummyPosts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </div>
    </div>
  );
}
