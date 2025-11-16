const chatData = [
  {
    id: "chat1",
    users: [
      {
        uid: "user1",
        fullName: "Emily Jackson",
        email: "emily@mailinator.com",
        image: "https://i.pravatar.cc/150?img=1",
        status: "online",
      },
      {
        uid: "user2",
        fullName: "Harrison Duran",
        email: "harrison@mailinator.com",
        image: "https://i.pravatar.cc/150?img=2",
        status: "offline",
      },
    ],
    lastMessage: "What about you?",
    lastSeen: {
      seconds: 1738364736, // More recent
      nanoseconds: 25000000,
    },
  },
  {
    id: "chat2",
    users: [
      {
        uid: "user1",
        fullName: "Emily Jackson",
        email: "emily@mailinator.com",
        image: "https://i.pravatar.cc/150?img=1",
        status: "online",
      },
      {
        uid: "user3",
        fullName: "Ryan Cooper",
        email: "ryan@mailinator.com",
        image: "https://i.pravatar.cc/150?img=3",
        status: "online",
      },
    ],
    lastMessage: "Sure, I'll send it right now!",
    lastSeen: {
      seconds: 1738368890, // Most recent
      nanoseconds: 800000000,
    },
  },
  {
    id: "chat3",
    users: [
      {
        uid: "user1",
        fullName: "Emily Jackson",
        email: "emily@mailinator.com",
        image: "https://i.pravatar.cc/150?img=1",
        status: "online",
      },
      {
        uid: "user4",
        fullName: "Alex Chen",
        email: "alex@mailinator.com",
        image: "https://i.pravatar.cc/150?img=4",
        status: "offline",
      },
    ],
    lastMessage: "Did you check the new mockups?",
    lastSeen: {
      seconds: 1738278336, // Yesterday
      nanoseconds: 0,
    },
  },
  {
    id: "chat4",
    users: [
      {
        uid: "user1",
        fullName: "Emily Jackson",
        email: "emily@mailinator.com",
        image: "https://i.pravatar.cc/150?img=1",
        status: "online",
      },
      {
        uid: "user5",
        fullName: "Design Team",
        email: "design@mailinator.com",
        image: "https://i.pravatar.cc/150?img=5",
        status: "online",
      },
    ],
    lastMessage: "New components are ready for review.",
    lastSeen: {
      seconds: 1738019136, // 3 days ago
      nanoseconds: 0,
    },
  },
  {
    id: "chat5",
    users: [
      {
        uid: "user1",
        fullName: "Emily Jackson",
        email: "emily@mailinator.com",
        image: "https://i.pravatar.cc/150?img=1",
        status: "online",
      },
      {
        uid: "user6",
        fullName: "Samantha Lee",
        email: "samantha@mailinator.com",
        image: "https://i.pravatar.cc/150?img=6",
        status: "offline",
      },
    ],
    lastMessage: "Okay, I'll look into it. Thanks!",
    lastSeen: {
      seconds: 1737414336, // Last week
      nanoseconds: 0,
    },
  },
];

export default chatData;