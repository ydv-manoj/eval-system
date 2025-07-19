export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 h-full border-r">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a href="/subjects" className="block px-3 py-2 rounded hover:bg-gray-200">
              Subjects
            </a>
          </li>
          <li>
            <a href="/competencies" className="block px-3 py-2 rounded hover:bg-gray-200">
              Competencies
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}