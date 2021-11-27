import { useState, useRef, useCallback } from 'react';
import './App.css';
import useBookSearch from './useBookSearch';

const App = () => {

  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('visible');
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);

    console.log(node);

  }, [loading, hasMore])

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1)
  }

  return (
    <div className="App">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
      />

      <ul>
        {books.map((book, index) => {
          if (books.length === index + 1) {
            return <li ref={lastBookElementRef} key={book}>{book}</li>
          }
          else {
            return <li key={book}>{book}</li>
          }
        })}
      </ul>

      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error...'}</div>
    </div>
  );
}

export default App;
