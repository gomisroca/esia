import BlogButton from './BlogButton';
import ExhibitionButton from './ExhibitionButton';
import ModeButton from './ModeButton';
import SearchBar from './SearchBar';
import StyleFilter from './StyleFilter';

export default function NavMenu() {
  return (
    <nav className="pointer-events-auto absolute top-2 right-0 flex flex-col items-center justify-center gap-4 md:top-4 md:right-4">
      <SearchBar />
      <StyleFilter />
      <ExhibitionButton />
      <BlogButton />
      <ModeButton />
    </nav>
  );
}
