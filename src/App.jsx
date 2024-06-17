import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import './index.css';

const App = () => {
  const [stories, setStories] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(data => {
        const top5Ids = data.slice(0, 5);
        return Promise.all(top5Ids.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        ));
      })
      .then(stories => setStories(stories));
  }, []);

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-light-purple dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Hacker News Top Stories</h1>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full bg-light-green dark:bg-gray-800"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Search stories..." 
            className="w-full p-2 mb-4 border rounded" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <ul className="space-y-4">
            {filteredStories.map(story => (
              <li key={story.id} className="p-4 bg-light-green dark:bg-gray-800 rounded shadow">
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold">
                  {story.title}
                </a>
                <p>{story.score} upvotes</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;