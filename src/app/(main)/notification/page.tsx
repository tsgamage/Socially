"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  Heart, MessageCircle, UserCheck, UserPlus, 
  X, Check, Clock, Bell, Trash2 
} from "lucide-react";

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
  const [activeFilter, setActiveFilter] = useState("all");

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

  const handleAcceptRequest = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    // In a real app, you would also send an API request to accept the friend request
  };

  const handleRejectRequest = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    // In a real app, you would also send an API request to reject the friend request
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart size={18} className="text-red-500" fill="currentColor" />;
      case "comment":
        return <MessageCircle size={18} className="text-blue-500" />;
      case "requestAccepted":
        return <UserCheck size={18} className="text-green-500" />;
      case "incomingRequest":
        return <UserPlus size={18} className="text-purple-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  const filteredNotifications = activeFilter === "all" 
    ? notifications 
    : notifications.filter(notif => notif.type === activeFilter);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Bell size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {notifications.length > 0 && (
            <span className="badge badge-primary badge-lg">{notifications.length}</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleMarkAllAsRead}
            disabled={notifications.length === 0}
          >
            <Trash2 size={16} />
            Clear all
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed justify-center bg-base-200 p-1 rounded-lg mb-6">
        <a
          className={`tab ${activeFilter === "all" ? "tab-active bg-base-100" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </a>
        <a
          className={`tab ${activeFilter === "like" ? "tab-active bg-base-100" : ""}`}
          onClick={() => setActiveFilter("like")}
        >
          Likes
        </a>
        <a
          className={`tab ${activeFilter === "comment" ? "tab-active bg-base-100" : ""}`}
          onClick={() => setActiveFilter("comment")}
        >
          Comments
        </a>
        <a
          className={`tab ${activeFilter === "incomingRequest" ? "tab-active bg-base-100" : ""}`}
          onClick={() => setActiveFilter("incomingRequest")}
        >
          Requests
        </a>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell size={48} className="text-base-content/30 mb-4" />
            <p className="text-base-content/60 text-lg font-medium">No notifications</p>
            <p className="text-base-content/40 mt-1">
              {activeFilter === "all" 
                ? "You're all caught up!" 
                : `No ${activeFilter} notifications`
              }
            </p>
          </div>
        )}
        
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className="card bg-base-100 shadow-sm border border-base-300/50 hover:shadow-md transition-shadow duration-200 relative"
          >
            <div className="card-body p-4">
              <div className="flex items-start gap-3">
                {/* Notification Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <Image 
                          src={notification.user.avatar} 
                          alt={notification.user.name} 
                          width={32} 
                          height={32}
                        />
                      </div>
                    </div>
                    <Link 
                      href={`/profile/${notification.user.username}`}
                      className="font-semibold hover:underline truncate"
                    >
                      {notification.user.name}
                    </Link>
                    <span className="text-sm text-base-content/70 flex items-center gap-1">
                      <Clock size={14} />
                      {notification.date}
                    </span>
                  </div>

                  {/* Notification Content */}
                  <div className="ml-10">
                    {notification.type === "like" && (
                      <div>
                        <p className="text-base-content/80 mb-2">liked your post:</p>
                        <Link 
                          href={`/post/${notification.post.id}`} 
                          className="flex items-start gap-3 hover:bg-base-200/50 p-2 rounded-lg transition-colors"
                        >
                          {notification.post.image && (
                            <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                              <Image 
                                src={notification.post.image} 
                                alt="Post" 
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <p className="text-sm text-base-content/70 line-clamp-2">{notification.post.content}</p>
                        </Link>
                      </div>
                    )}

                    {notification.type === "comment" && (
                      <div>
                        <p className="text-base-content/80 mb-2">commented on your post:</p>
                        <Link 
                          href={`/post/${notification.post.id}`} 
                          className="flex items-start gap-3 hover:bg-base-200/50 p-2 rounded-lg transition-colors mb-2"
                        >
                          {notification.post.image && (
                            <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                              <Image 
                                src={notification.post.image} 
                                alt="Post" 
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <p className="text-sm text-base-content/70 line-clamp-2">{notification.post.content}</p>
                        </Link>
                        <div className="bg-base-200/50 p-3 rounded-lg">
                          <p className="text-sm">"{notification.comment}"</p>
                        </div>
                      </div>
                    )}

                    {notification.type === "requestAccepted" && (
                      <p className="text-base-content/80">accepted your friend request.</p>
                    )}

                    {notification.type === "incomingRequest" && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-base-content/80">sent you a friend request.</p>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleAcceptRequest(notification.id)}
                          >
                            <Check size={16} />
                            Accept
                          </button>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => handleRejectRequest(notification.id)}
                          >
                            <X size={16} />
                            Decline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Dismiss Button */}
                <button
                  className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
                  onClick={() => handleDismissNotification(notification.id)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}