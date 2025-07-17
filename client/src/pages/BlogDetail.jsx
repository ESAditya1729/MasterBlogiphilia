import { useParams } from 'react-router-dom';

export default function BlogDetail() {
  const { id } = useParams();
  return (
    <div>
      <h2 className="text-2xl font-bold">Blog Post #{id}</h2>
      <p className="mt-4">Blog content will go here...</p>
    </div>
  );
}