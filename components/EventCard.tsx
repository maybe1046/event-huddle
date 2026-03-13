import Image from "next/image";
import Link from "next/link";

interface Props {
  id: number;
  title: string;
  image: string;
}

const EventCard = ({ id, title, image }: Props) => {
  return (
    <Link href={`/events/${id}`} className="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <p className="title">{title}</p>
    </Link>
  );
};

export default EventCard;
