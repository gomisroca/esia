/**
 * Renders the navbar component.
 *
 * @example
 * <Navbar />
 */

import BackToTopButton from './BackToTopButton';
import NavMenu from './NavMenu';

async function Navbar() {
  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-start px-0 md:px-4">
      <BackToTopButton />
      <NavMenu />
    </div>
  );
}

export default Navbar;
