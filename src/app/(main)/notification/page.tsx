"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MessageCircle, UserCheck, UserPlus, X, Check, Bell, Eye, UserStar, ArrowBigUpDash } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import {
  deleteNotificationById,
  fetchUserNotifications,
  markAsReadNotificationById,
} from "@/actions/notifications.action";
import { formatDistanceToNowStrict } from "date-fns";
import { acceptFriendRequest } from "@/actions/user.actions";

export default function NotificationPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "upvote" | "comment" | "request">("all");

  const { user } = useUser();
  const queryClient = useQueryClient();

  const getNotificationIcon = (type: "upvote" | "comment" | "follow" | "follow_accept" | "follow_back") => {
    switch (type) {
      case "upvote":
        return <ArrowBigUpDash size={18} className="text-green-500" fill="currentColor" />;
      case "comment":
        return <MessageCircle size={18} className="text-blue-500" />;
      case "follow_accept":
        return <UserCheck size={18} className="text-green-500" />;
      case "follow_back":
        return <UserStar size={18} className="text-green-500" />;
      case "follow":
        return <UserPlus size={18} className="text-purple-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  const { data: fetchedNotifications, isLoading: isFetchingNotifications } = useQuery({
    queryKey: ["notifications", user?.username],
    queryFn: fetchUserNotifications,
    enabled: !!user?.username,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markAsReadNotificationById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requestId: string) => await acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["friends", "all"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: deleteNotificationById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
  const filteredNotifications =
    activeFilter === "all"
      ? fetchedNotifications
      : fetchedNotifications?.filter((notif) => {
          switch (activeFilter) {
            case "comment":
              return notif.type === "comment";
            case "upvote":
              return notif.type === "upvote";
            case "request":
              return notif.type === "follow" || notif.type === "follow_accept" || notif.type === "follow_back";
          }
        });

  const unreadNotifications = fetchedNotifications?.filter((notif) => notif.read === false);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Bell size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadNotifications && unreadNotifications.length > 0 && (
            <span className="badge badge-primary badge-lg">{unreadNotifications.length}</span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex h-12 justify-around bg-base-200 p-1 rounded-lg mb-6 ">
        <a
          className={`tab ${activeFilter === "all" ? "bg-primary hover:bg-primary" : ""} hover:bg-base-100 w-full`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </a>
        <a
          className={`tab ${activeFilter === "upvote" ? "bg-primary hover:bg-primary" : ""} hover:bg-base-100 w-full`}
          onClick={() => setActiveFilter("upvote")}
        >
          Upvotes
        </a>
        <a
          className={`tab ${activeFilter === "comment" ? "bg-primary hover:bg-primary" : ""} hover:bg-base-100 w-full`}
          onClick={() => setActiveFilter("comment")}
        >
          Comments
        </a>
        <a
          className={`tab ${activeFilter === "request" ? "bg-primary hover:bg-primary" : ""} hover:bg-base-100 w-full`}
          onClick={() => setActiveFilter("request")}
        >
          Requests
        </a>
      </div>

      <div className="space-y-3">
        {filteredNotifications?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell size={48} className="text-base-content/30 mb-4" />
            <p className="text-base-content/60 text-lg font-medium">No notifications</p>
            <p className="text-base-content/40 mt-1">
              {activeFilter === "all" ? "You're all caught up!" : `No ${activeFilter} notifications`}
            </p>
          </div>
        )}

        {!isFetchingNotifications &&
          filteredNotifications &&
          filteredNotifications.map((notification) => (
            <div
              key={notification._id + notification.type}
              className={`card shadow-sm border border-base-300/50 hover:shadow-md transition-shadow duration-200 relative ${notification.read ? "bg-base-200" : "bg-base-300"}`}
            >
              <div className="card-body p-4">
                <div className="flex items-start gap-3">
                  {/* Notification Icon */}
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-base-content/70 flex items-center gap-1">
                      {formatDistanceToNowStrict(notification.createdAt, { addSuffix: true })}
                    </span>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          <Image
                            src={notification.sender.profilePic}
                            alt={notification.sender.username}
                            width={32}
                            height={32}
                          />
                        </div>
                      </div>
                      <Link
                        href={`/profile/${notification.sender.username}`}
                        className="font-semibold hover:underline truncate"
                      >
                        {notification.sender.username}
                      </Link>
                    </div>

                    {/* Notification Content */}
                    <div className="ml-10">
                      {notification.type === "upvote" && (
                        <div>
                          <p className="text-base-content/80 mb-2">Upvoted your post:</p>
                          <Link
                            href={`/post/${notification.post._id}`}
                            className="flex items-start gap-3 hover:bg-base-200/50 p-2 rounded-lg transition-colors"
                          >
                            {notification.post.images.length > 0 && (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                                <Image src={notification.post.images[0]} alt="Post" fill className="object-cover" />
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
                            href={`/post/${notification.post._id}`}
                            className="flex items-start gap-3 hover:bg-base-200/50 p-2 rounded-lg transition-colors mb-2"
                          >
                            {notification.post.images && (
                              <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                                <Image src={notification.post.images[0]} alt="Post" fill className="object-cover" />
                              </div>
                            )}
                            <p className="text-sm text-base-content/70 line-clamp-2">{notification.post.content}</p>
                          </Link>
                          <div className="bg-base-200/50 p-3 rounded-lg">
                            <p className="text-sm">"{notification.comment.content as string}"</p>
                          </div>
                        </div>
                      )}

                      {notification.type === "follow_accept" && (
                        <p className="text-base-content/80">accepted your friend request.</p>
                      )}
                      {notification.type === "follow_back" && <p className="text-base-content/80">follows you back.</p>}

                      {notification.type === "follow" && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <p className="text-base-content/80">sent you a friend request.</p>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => acceptRequest(notification.request as unknown as string)}
                            >
                              <Check size={16} />
                              Accept
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => {}}>
                              <X size={16} />
                              Decline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dismiss Button */}
                  {!notification.read && (
                    <button
                      className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
                      onClick={() => markAsRead(notification._id as string)}
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
                    onClick={() => deleteNotification(notification._id as string)}
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
