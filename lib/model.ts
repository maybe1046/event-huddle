export interface EventType {
  id: number;
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
}

export const events: EventType[] = [
  {
    id: 1,
    title: "Hackathon 2024",
    image: "/images/event1.png",
    location: "Oslo, Norway",
    date: "2024-09-15",
    time: "10:00 AM",
  },
  {
    id: 2,
    title: "Tech Conference",
    image: "/images/event2.png",
    location: "New York, USA",
    date: "2024-10-20",
    time: "9:00 AM",
  },
  {
    id: 3,
    title: "Developer Meetup",
    image: "/images/event3.png",
    location: "San Francisco, USA",
    date: "2024-11-05",
    time: "2:00 PM",
  },
  {
    id: 4,
    title: "Tech Meetup",
    image: "/images/event4.png",
    location: "London, UK",
    date: "2024-12-10",
    time: "6:00 PM",
  },
  {
    id: 5,
    title: "AI Conference",
    image: "/images/event5.png",
    location: "Berlin, Germany",
    date: "2025-01-15",
    time: "11:00 AM",
  },
];
