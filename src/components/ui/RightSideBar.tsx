const dummyUsers = [
  {
    username: "john_doe",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    username: "jane_doe",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    username: "peter_jones",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    username: "susan_smith",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
  {
    username: "william_brown",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d",
  },
];

export default function RightSideBar() {
  return (
    <div className="hidden lg:flex flex-col w-80 p-4">
      <div className="bg-base-100 border border-base-300 rounded-box shadow-lg p-4">
        <h2 className="font-semibold text-lg mb-4">Suggestions for you</h2>
        <div className="flex flex-col space-y-4">
          {dummyUsers.map((user, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img src={user.avatar} alt={user.username} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{user.username}</span>
                  <span className="text-xs text-base-content/70">Suggested for you</span>
                </div>
              </div>
              <button className="btn btn-sm btn-primary">Follow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
