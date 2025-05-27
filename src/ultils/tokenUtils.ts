import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  iat: number;
  exp: number;
  role: string;
  userId: string;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    // Gọi hàm jwtDecode với kiểu trả về là TokenPayload
    const decoded = jwtDecode<TokenPayload>(token);

    // Kiểm tra nếu token đã hết hạn
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây
    if (decoded.exp < currentTime) {
      console.warn("Token đã hết hạn");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return null;
  }
};
