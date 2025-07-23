import BlogButton from './BlogButton';
import ExhibitionButton from './ExhibitionButton';
import ModeButton from './ModeButton';
import SearchBar from './SearchBar';
import StyleFilter from './StyleFilter';

function NavMenu() {
  return (
    <div
      data-testid="nav-menu"
      role="navigation"
      className="pointer-events-auto absolute top-2 right-0 flex flex-col items-center justify-center gap-4 md:top-4 md:right-4">
      <SearchBar />
      <StyleFilter />
      <ExhibitionButton />
      <BlogButton />
      <ModeButton />
    </div>
  );
}

export default NavMenu;
