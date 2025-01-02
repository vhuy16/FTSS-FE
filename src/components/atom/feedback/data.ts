import staticImages from "@images/feedback.jpg"; // Điều chỉnh đường dẫn cho phù hợp

// Định nghĩa kiểu dữ liệu cho feedback
interface Feedback {
  id: string;
  imgSource: string; // Hoặc kiểu dữ liệu tương ứng với imgSource
  name: string;
  designation: string;
  rating: number;
  feedbackText: string;
}

// Dữ liệu feedback
export const feedbackData: Feedback[] = [
  {
    id: "feedback-1",
    imgSource: staticImages,
    name: "Floyd Miles",
    designation: "Marketing Manager",
    rating: 3,
    feedbackText:
      "I am incredibly pleased with my recent shopping experience on this clothing ecommerce website. The user-friendly interface made it a breeze to browse through a wide range of stylish options. The variety of sizes and styles available was impressive, and I found the perfect outfit for a special occasion.",
  },
  {
    id: "feedback-2",
    imgSource: staticImages,
    name: "Ronald Richards",
    designation: "Teacher",
    rating: 4,
    feedbackText:
      "This clothing ecommerce website has become my go-to destination for fashion finds. The selection is fantastic, catering to various tastes and preferences. From casual wear to elegant pieces, I always discover something unique and stylish. The website's organization and clear product images make it easy to make informed choices.",
  },
  {
    id: "feedback-3",
    imgSource: staticImages,
    name: "Savannah Nguyen",
    designation: "Student",
    rating: 4,
    feedbackText:
      "I want to express my gratitude for the exceptional service provided by this clothing ecommerce website. Not only is the website intuitive and easy to navigate, but the customer service team also went above and beyond to assist me with a query.",
  },
  {
    id: "feedback-4",
    imgSource: staticImages,
    name: "Arthur Ramsay",
    designation: "Fashion Designer",
    rating: 4,
    feedbackText:
      "I recently made a purchase from this clothing ecommerce website, and I couldn't be happier with my experience. The website is well-designed, making it easy to navigate and find the items I was looking for. The product descriptions were detailed, helping me make informed decisions.",
  },
];
