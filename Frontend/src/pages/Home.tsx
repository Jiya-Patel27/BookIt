import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Experience } from '../types';
import ExperienceCard from '../components/ExperienceCard';

export default function Home() {
  const [list, setList] = useState<Experience[]>([]);
  const [filteredList, setFilteredList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/experiences')
      .then(res => {
        setList(res.data);
        setFilteredList(res.data);
      })
      .catch(err => {
        setError('Could not load experiences');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Listen for search input from Header
  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      const query = e.detail.toLowerCase();
      if (query === '') setFilteredList(list);
      else {
        const filtered = list.filter(exp =>
          exp.title.toLowerCase().includes(query) ||
          exp.location?.toLowerCase().includes(query) ||
          exp.description?.toLowerCase().includes(query)
        );
        setFilteredList(filtered);
      }
    };

    window.addEventListener('search', handleSearch as EventListener);
    return () => window.removeEventListener('search', handleSearch as EventListener);
  }, [list]);

  return (
    <div className="py-6">
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && filteredList.length === 0 && (
        <div className="text-gray-500 text-center mt-10">No results found.</div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 place-items-center">
        {filteredList.map(exp => <ExperienceCard key={exp._id} exp={exp} />)}
      </div>
    </div>
  );
}
