
export const USERS_URL = "https://jsonplaceholder.typicode.com/users";
export const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export const USERS_FILE = "./user.csv";
export const POSTS_FILE = "./post.csv";

// export const DEFAULT_BUFFER_SIZE = 32 * 1024;
export const DEFAULT_BUFFER_SIZE = 32 * 3;

export type User = {
  id: number;
  name: string;
  email: string;
}

type UserCol = keyof User;

export const USER_COLS = ["id", "name", "email"];

export type Post = {
  userId: number,
  id: number;
  title: string;
  body: string;
}

type PostCol = keyof Post;

export const POST_COLS: PostCol[] = ["userId", "id", "title", "body"];

