import React, { useState, useRef, useCallback, useEffect } from 'react';
import InfiniteScroll from './components/InfiniteScroll';
import axios from 'axios';
import './App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchMoreData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=3`
      );
      setPosts((prevPosts) => [
        ...prevPosts,
        ...response.data.filter(
          (newPost) => !prevPosts.some((post) => post.id === newPost.id)
        ),
      ]);
      if (response.data.length === 0 || response.data.length < 3) {
        setHasMore(false);
      }
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [page]);

  useEffect(() => {
    fetchMoreData();
  }, []);

  return (
    <div>
      <h1>Infinite Scroll with API Example</h1>
      <div className='post-container'>
        {posts.map((post) => (
          <div key={post.id} className='post'>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
      <div ref={loader} className='loading'>
        {hasMore && <p>Loading more posts...</p>}
      </div>
      <InfiniteScroll
        fetchMoreData={fetchMoreData}
        hasMore={hasMore}
        loader={loader}
      />
    </div>
  );
};

export default App;
