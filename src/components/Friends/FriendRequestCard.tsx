import { IFetchedFollowRequest } from "@/lib/types/modals.type";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

type Props = {
  request: IFetchedFollowRequest;
  onCancelFollow: () => void;
  onAcceptReq: (requestId: string) => void;
  onRejectReq: () => void;
};

export default function FriendRequestCard({ request, onCancelFollow, onAcceptReq, onRejectReq }: Props) {
  const { user } = useUser();

  return (
    <>
      {request.sender.clerkId === user?.id && (
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="avatar">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full relative">
                <Image src={request.receiver.profilePic} alt={request.receiver.username} width={64} height={64} />
                {request.receiver.lastOnline !== undefined && (
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-base-200 ${request.receiver.lastOnline ? "bg-green-500" : "bg-gray-500"}`}
                  ></div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <Link href={`/profile/${request.receiver.username}`} className="font-semibold lg:text-lg hover:underline">
                {request.receiver.name}
              </Link>
              <p className="text-sm lg:text-base text-base-content/70">@{request.receiver.username}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button className="btn btn-warning btn-sm lg:btn-md" onClick={onCancelFollow}>
              Cancel Request
            </button>
          </div>
        </div>
      )}
      {request.sender.clerkId !== user?.id && (
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="avatar">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full relative">
                <Image src={request.sender.profilePic} alt={request.sender.username} width={64} height={64} />
              </div>
            </div>
            <div className="flex flex-col">
              <Link href={`/profile/${request.sender.username}`} className="font-semibold lg:text-lg hover:underline">
                {request.sender.name}
              </Link>
              <p className="text-sm lg:text-base text-base-content/70">@{request.sender.username}</p>

              <p className="text-xs lg:text-sm text-base-content/60">{request.sender.followersCount} followers</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="flex space-x-2 lg:space-x-3">
              <button className="btn btn-success btn-sm lg:btn-md" onClick={() => onAcceptReq(request._id as string)}>
                Accept
              </button>
              <button className="btn btn-error btn-sm lg:btn-md" onClick={onRejectReq}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
