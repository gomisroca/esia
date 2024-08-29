/**
 * Function to scroll to the top of the page.
 *
 * @param {ScrollBehavior} behavior - The behavior of the scroll, e.g., 'smooth' or 'instant'.
 *
 * @example
 * import scrollToTop from './scrollToTop';
 * <Button onClick={() => scrollToTop('smooth')}>Scroll to top</Button>
 */

const scrollToTop = (behavior: ScrollBehavior) => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: behavior });
  }
};

export default scrollToTop;
