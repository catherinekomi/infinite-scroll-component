import React, { useState, useRef, useCallback, useEffect } from 'react';
import InfiniteScroll from './components/InfiniteScroll';
import axios from 'axios';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchMoreData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=3`
      );
      setItems((prevItems) => [
        ...prevItems,
        ...response.data.filter(
          (newItem) => !prevItems.some((item) => item.id === newItem.id)
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
  }, [fetchMoreData]);

  return (
    <div>
      <h1>Infinite Scroll with API Example</h1>
      <div className='item-container'>
        {items.map((item) => (
          <div key={item.id} className='item'>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
      <div ref={loader} className='loading'>
        {hasMore && <p>Loading more items...</p>}
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
