import { request } from "./index";

interface Post {
  id: number;
  title: string;
}

async function runDemo() {
  console.log("Starting API request...");
  
  const res = await request<Post>("https://jsonplaceholder.typicode.com/posts/1");

  if (res.ok) {
    console.log("SUCCESS:", res.data.title);
  } else {
    console.log("ERROR:", res.error);
  }
}

runDemo();