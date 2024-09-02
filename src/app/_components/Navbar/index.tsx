/**
 * Renders the navbar component.
 *
 * @example
 * <Navbar />
 */

import ModeButton from './ModeButton';
import UserStatus from './UserStatus';
import BackToTopButton from './BackToTopButton';
import StyleFilter from './StyleFilter';

async function Navbar() {
  return (
    <div className="pointer-events-none sticky top-0 z-10 flex h-16 w-full items-center justify-between px-8">
      <BackToTopButton />
      <div className="pointer-events-auto flex flex-row items-center justify-center gap-4">
        <StyleFilter />
        <UserStatus />
        <ModeButton />
      </div>
    </div>
  );
}

export default Navbar;
