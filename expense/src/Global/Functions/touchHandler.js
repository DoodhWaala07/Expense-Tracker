export default handleTouchStart = (e) => {
    // Check if the element is meant to receive focus
    if (e.target.classList.contains('focusable')) {
        // Explicitly set focus to the element
        e.target.focus();
    }
};