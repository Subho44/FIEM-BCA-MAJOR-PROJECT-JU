import React, { useEffect, useState } from "react";
import API from "../api/courseApi";
import CourseList from "../components/Courselist";
import { FaSearch, FaTimes, FaBookOpen } from "react-icons/fa";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const getCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/");
      setCourses(res.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Courses fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        if (search.trim() === "") {
          getCourses();
        } else {
          setLoading(true);
          const res = await API.get(`/search/${search}`);
          setCourses(res.data);
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Search failed");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (user?.role !== "admin" && user?.role !== "instructor") {
      alert("Only admin or instructor can delete course");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      alert("Course deleted successfully");
      getCourses();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please login again");
      } else {
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const clearSearch = () => {
    setSearch("");
    getCourses();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-10 mb-10 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <FaBookOpen className="text-5xl opacity-90" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Upgrade Your Skills
              </h1>
              <p className="text-lg opacity-90">
                Discover, manage, and explore high-quality online courses.
              </p>
            </div>
          </div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Courses
          </h2>
          <span className="text-2xl font-bold text-blue-600">
            {courses.length}
          </span>
        </div>

        <div className="relative mb-8">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-600">
              No courses found
            </h3>
            <p className="text-gray-500 mt-2">
              Try searching with a different title.
            </p>
          </div>
        ) : (
          <CourseList courses={courses} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default Home;