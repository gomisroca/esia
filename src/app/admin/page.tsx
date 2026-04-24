import Link from 'next/link';
import { type ReactNode } from 'react';
import { FaPaintBrush } from 'react-icons/fa';
import { FaCalendar, FaNewspaper, FaUsers } from 'react-icons/fa6';

import ProtectedRoute from '../_components/ProtectedRoute';

interface AdminCardProps {
  icon: ReactNode;
  title: string;
  color: string;
  links: { href: string; label: string }[];
}

function AdminCard({ icon, title, color, links }: AdminCardProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-gray-300 bg-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-100 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
        </div>
        <div className="space-y-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block w-full rounded-sm px-4 py-2 text-left ${color} transition-colors duration-200`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const ADMIN_SECTIONS: AdminCardProps[] = [
  {
    icon: <FaPaintBrush className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: 'Artworks',
    color:
      'text-blue-600 hover:bg-blue-300/50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-gray-700/50 dark:hover:text-blue-300',
    links: [
      { href: '/admin/artworks/create', label: 'Create Artwork' },
      { href: '/admin/artworks/update', label: 'Update Artwork' },
    ],
  },
  {
    icon: <FaUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    title: 'Artists',
    color:
      'text-purple-600 hover:bg-purple-300/50 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-gray-700/50 dark:hover:text-purple-300',
    links: [
      { href: '/admin/artists/create', label: 'Create Artist' },
      { href: '/admin/artists/update', label: 'Update Artist' },
    ],
  },
  {
    icon: <FaCalendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    title: 'Exhibitions',
    color:
      'text-emerald-600 hover:bg-emerald-300/50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-gray-700/50 dark:hover:text-emerald-300',
    links: [
      { href: '/admin/exhibitions/create', label: 'Create Exhibition' },
      { href: '/admin/exhibitions/update', label: 'Update Exhibition' },
    ],
  },
  {
    icon: <FaNewspaper className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
    title: 'Blogs',
    color:
      'text-rose-600 hover:bg-rose-300/50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-gray-700/50 dark:hover:text-rose-300',
    links: [
      { href: '/admin/blogs/create', label: 'Create Blog' },
      { href: '/admin/blogs/update', label: 'Update Blog' },
    ],
  },
];

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="rounded-sm bg-gray-50 p-8 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-4">
            {ADMIN_SECTIONS.map((section) => (
              <AdminCard key={section.title} {...section} />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
