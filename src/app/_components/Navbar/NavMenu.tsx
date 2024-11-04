import ModeButton from './ModeButton';
import SearchBar from './SearchBar';
import StyleFilter from './StyleFilter';
import ExhibitionButton from './ExhibitionButton';

function NavMenu() {
  return (
    <div className="pointer-events-auto absolute right-0 top-2 flex flex-col items-center justify-center gap-4 md:right-4 md:top-4">
      <SearchBar />
      <StyleFilter />
      <ExhibitionButton />
      <ModeButton />
    </div>
  );
}

export default NavMenu;
