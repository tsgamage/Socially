"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface User {
  name: string;
  username: string;
  avatar: string;
}

interface PostInfo {
  id: string;
  content: string;
  image?: string;
}

interface LikeNotification {
  type: "like";
  id: string;
  user: User;
  date: string;
  post: PostInfo;
}

interface CommentNotification {
  type: "comment";
  id: string;
  user: User;
  date: string;
  post: PostInfo;
  comment: string;
}

interface RequestAcceptedNotification {
  type: "requestAccepted";
  id: string;
  user: User;
  date: string;
}

interface IncomingRequestNotification {
  type: "incomingRequest";
  id: string;
  user: User;
  date: string;
}

type Notification =
  | LikeNotification
  | CommentNotification
  | RequestAcceptedNotification
  | IncomingRequestNotification;

const initialDummyNotifications: Notification[] = [
  {
    type: "like",
    id: "notif1",
    user: {
      name: "Alice Brown",
      username: "alicebrown",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026708d",
    },
    date: "2 hours ago",
    post: {
      id: "post1",
      content: "Exploring new places! This view is breathtaking. ⛰️",
      image: "https://picsum.photos/id/1035/1000/600",
    },
  },
  {
    type: "comment",
    id: "notif2",
    user: {
      name: "Bob White",
      username: "bobwhite",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026709d",
    },
    date: "1 hour ago",
    post: {
      id: "post2",
      content: "Delicious dinner tonight! 🍝",
      image: "https://picsum.photos/id/1035/1000/600",
    },
    comment: "Looks amazing! What's the recipe?",
  },
  {
    type: "requestAccepted",
    id: "notif3",
    user: {
      name: "Charlie Green",
      username: "charliegreen",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026710d",
    },
    date: "30 minutes ago",
  },
  {
    type: "incomingRequest",
    id: "notif4",
    user: {
      name: "Diana Prince",
      username: "dianaprince",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026711d",
    },
    date: "10 minutes ago",
  },
  {
    type: "like",
    id: "notif5",
    user: {
      name: "Eve Adams",
      username: "eveadams",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026712d",
    },
    date: "5 minutes ago",
    post: {
      id: "post3",
      content: "Throwback to last summer's adventure! ☀️",
      image: "https://picsum.photos/id/1050/1000/600",
    },
  },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialDummyNotifications);

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="btn btn-sm btn-primary" onClick={handleMarkAllAsRead}>
          Mark all as read
        </button>
      </div>
      <div className="space-y-4">
        {notifications.length === 0 && (
          <p className="text-center text-base-content/70">No new notifications.</p>
        )}
        {notifications.map((notification) => (
          <div key={notification.id} className="card bg-base-200 shadow-xl border border-base-content/20 relative">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2 z-10"
              onClick={() => handleDismissNotification(notification.id)}
            >
              ✕
            </button>
            <div className="card-body p-4">
              <div className="flex items-center mb-2">
                <div className="avatar mr-3">
                  <div className="w-10 h-10 rounded-full">
                    <Image src={notification.user.avatar} alt={notification.user.name} width={40} height={40} />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{notification.user.name}</p>
                  <p className="text-sm text-base-content/70">{notification.date}</p>
                </div>
              </div>

              {notification.type === "like" && (
                <div>
                  <p className="mb-2">liked your post:</p>
                  <Link href={`/post/${notification.post.id}`} className="flex items-center space-x-2 hover:underline">
                    {notification.post.image && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image src={notification.post.image} alt="Post" layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
                    )}
                    <p className="text-sm truncate">{notification.post.content}</p>
                  </Link>
                </div>
              )}

              {notification.type === "comment" && (
                <div>
                  <p className="mb-2">commented on your post:</p>
                  <Link href={`/post/${notification.post.id}`} className="flex items-center space-x-2 hover:underline mb-2">
                    {notification.post.image && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image src={notification.post.image} alt="Post" layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
                    )}
                    <p className="text-sm truncate">{notification.post.content}</p>
                  </Link>
                  <div className="bg-base-100 p-3 rounded-md">
                    <p className="text-sm italic">"{notification.comment}"</p>
                  </div>
                </div>
              )}

              {notification.type === "requestAccepted" && (
                <p>accepted your friend request.</p>
              )}

              {notification.type === "incomingRequest" && (
                <div className="flex justify-between items-center">
                  <p>sent you a friend request.</p>
                  <div className="space-x-2">
                    <button className="btn btn-sm btn-primary">Accept</button>
                    <button className="btn btn-sm btn-ghost">Reject</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
