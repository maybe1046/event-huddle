import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";

const events = [
  {
    id: 1,
    title: "Hackathon 2024",
    image: "/images/event1.png",
  },
  {
    id: 2,
    title: "Tech Conference",
    image: "/images/event2.png",
  },
  {
    id: 3,
    title: "Developer Meetup",
    image: "/images/event3.png",
  },

  {
    id: 4,
    title: "Tech Meetup",
    image: "/images/event4.png",
  },
  {
    id: 5,
    title: "AI Conference",
    image: "/images/event5.png",
  },
];

const Page = () => (
  <>
    <section>
      <h1 className="text-center">
        The Hub for Every Dev Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event) => (
            <li key={event.id} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
);

export default Page;
