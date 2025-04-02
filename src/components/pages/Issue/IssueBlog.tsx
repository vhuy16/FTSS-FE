import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { format } from "date-fns";
import { Container } from "@styles/styles";
import Breadcrumb from "@common/Breadcrumb";
const IssueBlog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  type Post = {
    id: string;
    title: string;
    author: string;
    date: Date;
    image: string;
    category: string;
  };
  const breadcrumbItems = [
    {
      label: "Trang chủ",
      link: "/",
    },
    { label: "Bài viết", link: "issue-post" },
  ];
  const blogPosts = [
    {
      id: "11",
      title: "Understanding Modern Web Development",
      author: "John Doe",
      date: new Date("2024-01-15"),
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      category: "Technology",
    },
    {
      id: "22",
      title: "The Future of Artificial Intelligence",
      author: "Jane Smith",
      date: new Date("2024-01-14"),
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
      category: "AI",
    },
    {
      id: "33",
      title: "Best Practices in React Development",
      author: "Mike Johnson",
      date: new Date("2024-01-13"),
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
      category: "React",
    },
    {
      id: "4",
      title: "Mastering CSS Grid Layout",
      author: "Sarah Wilson",
      date: new Date("2024-01-12"),
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
      category: "CSS",
    },
  ];

  const categories = ["Technology", "AI", "React", "CSS", "JavaScript", "Web Design"];

  const tags = ["frontend", "development", "coding", "web", "design", "ui", "ux", "responsive"];

  const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out">
      <div className="relative overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300 ease-in-out"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 mb-2">
          {post.title}
        </h2>
        <div className="text-sm text-gray-600 mb-4">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <span>{format(post.date, "MMM dd, yyyy")}</span>
        </div>
        <div className="text-sm bg-gray-100 inline-block px-3 py-1 rounded-full">{post.category}</div>
      </div>
    </div>
  );

  return (
    <main className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-10 ">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="grid md:grid-cols-2 gap-6">
                  {blogPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Search Bar */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
                  <div className="space-y-3">
                    {blogPosts.slice(0, 5).map((post) => (
                      <a
                        key={post.id}
                        href="#"
                        className="block text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-300"
                      >
                        {post.title}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <a
                        key={category}
                        href="#"
                        className="block text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-300"
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default IssueBlog;
