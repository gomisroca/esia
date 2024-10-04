/**
 * Renders the navbar component.
 *
 * @example
 * <Navbar />
 */

import ModeButton from './ModeButton';
import BackToTopButton from './BackToTopButton';
import StyleFilter from './StyleFilter';
import SearchBar from './SearchBar';

async function Navbar() {
  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-start px-0 md:px-4">
      <BackToTopButton />
      <div className="pointer-events-auto absolute right-0 top-2 flex flex-col items-center justify-center gap-4 md:right-4 md:top-4">
        <ModeButton />
        <SearchBar />
        <StyleFilter />
      </div>
    </div>
  );
}

export default Navbar;
