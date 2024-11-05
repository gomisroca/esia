import Link from 'next/link';
import ProtectedRoute from '../_components/ProtectedRoute';
import { FaCalendar, FaUsers } from 'react-icons/fa6';
import { FaPaintBrush } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <ProtectedRoute>
      <div className="rounded-lg bg-gray-50 p-8 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Artworks Section */}
            <div className="overflow-hidden rounded-lg border border-gray-300 bg-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-100 p-6 dark:border-gray-700">
                <div className="mb-4 flex items-center gap-3">
                  <FaPaintBrush className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Artworks</h2>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/admin/artworks/create"
                    className="block w-full rounded-md px-4 py-2 text-left text-blue-600 transition-colors duration-150 hover:bg-blue-300/50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-gray-700/50 dark:hover:text-blue-300">
                    Create Artwork
                  </Link>
                  <Link
                    href="/admin/artworks/update"
                    className="block w-full rounded-md px-4 py-2 text-left text-blue-600 transition-colors duration-150 hover:bg-blue-300/50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-gray-700/50 dark:hover:text-blue-300">
                    Update Artwork
                  </Link>
                </div>
              </div>
            </div>

            {/* Artists Section */}
            <div className="overflow-hidden rounded-lg border border-gray-300 bg-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-100 p-6 dark:border-gray-700">
                <div className="mb-4 flex items-center gap-3">
                  <FaUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Artists</h2>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/admin/artists/create"
                    className="block w-full rounded-md px-4 py-2 text-left text-purple-600 transition-colors duration-150 hover:bg-purple-300/50 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-gray-700/50 dark:hover:text-purple-300">
                    Create Artist
                  </Link>
                  <Link
                    href="/admin/artists/update"
                    className="block w-full rounded-md px-4 py-2 text-left text-purple-600 transition-colors duration-150 hover:bg-purple-300/50 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-gray-700/50 dark:hover:text-purple-300">
                    Update Artist
                  </Link>
                </div>
              </div>
            </div>

            {/* Exhibitions Section */}
            <div className="overflow-hidden rounded-lg border border-gray-300 bg-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-100 p-6 dark:border-gray-700">
                <div className="mb-4 flex items-center gap-3">
                  <FaCalendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Exhibitions</h2>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/admin/exhibitions/create"
                    className="block w-full rounded-md px-4 py-2 text-left text-emerald-600 transition-colors duration-150 hover:bg-emerald-300/50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-gray-700/50 dark:hover:text-emerald-300">
                    Create Exhibition
                  </Link>
                  <Link
                    href="/admin/exhibitions/update"
                    className="block w-full rounded-md px-4 py-2 text-left text-emerald-600 transition-colors duration-150 hover:bg-emerald-300/50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-gray-700/50 dark:hover:text-emerald-300">
                    Update Exhibition
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
