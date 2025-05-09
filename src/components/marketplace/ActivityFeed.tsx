const ActivityFeed = () => {
  const activities = [
    {
      type: "purchase",
      property: "Luxury Condo, New York",
      user: "0x1234...5678",
      tokens: 5,
      value: "$12,500",
      time: "2 minutes ago",
    },
    {
      type: "list",
      property: "Beach Villa, Miami",
      user: "0x9876...4321",
      tokens: 10,
      value: "$41,000",
      time: "15 minutes ago",
    },
    {
      type: "sell",
      property: "Office Building, London",
      user: "0x4567...8901",
      tokens: 3,
      value: "$23,400",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Live Activity</h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === "purchase"
                    ? "bg-green-500"
                    : activity.type === "list"
                    ? "bg-blue-500"
                    : "bg-orange-500"
                }`}
              />
              <div>
                <p className="text-white font-medium">{activity.property}</p>
                <p className="text-sm text-gray-400">
                  {activity.type === "purchase"
                    ? "Purchased by"
                    : activity.type === "list"
                    ? "Listed by"
                    : "Sold by"}{" "}
                  {activity.user}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{activity.value}</p>
              <p className="text-sm text-gray-400">{activity.tokens} tokens</p>
            </div>
            <span className="text-sm text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
