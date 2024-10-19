'use client';

import { useState } from 'react';
import ModeButton from './ModeButton';
import SearchBar from './SearchBar';
import StyleFilter from './StyleFilter';
import Button from '../ui/Button';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';

function NavMenu() {
  const [showExtraButtons, setShowExtraButtons] = useState(false);

  const toggleButtons = () => {
    setShowExtraButtons(!showExtraButtons);
  };

  return (
    <div className="pointer-events-auto absolute right-0 top-2 flex flex-col items-center justify-center gap-4 md:right-4 md:top-4">
      <SearchBar />
      <StyleFilter />
      {showExtraButtons && <ModeButton />}
      <Button
        className="rounded-r-none bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:rounded-md md:bg-transparent md:drop-shadow-none"
        onClick={toggleButtons}>
        {showExtraButtons ? <FaCaretUp /> : <FaCaretDown />}
      </Button>
    </div>
  );
}

export default NavMenu;
