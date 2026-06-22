import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group block border border-zinc-200 hover:border-black transition-all duration-200 card-shadow hover:shadow-none hover:translate-x-1 hover:translate-y-1"
    >
      <div className="aspect-video overflow-hidden bg-zinc-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/000000/FFFFFF?text=Course";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-zinc-700 transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">
            {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
          </span>
          <span className="text-xs text-zinc-400">
            {course.studentsEnrolled?.length || 0} students
          </span>
        </div>
        {course.creator?.name && (
          <p className="text-xs text-zinc-400 mt-1">by {course.creator.name}</p>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
