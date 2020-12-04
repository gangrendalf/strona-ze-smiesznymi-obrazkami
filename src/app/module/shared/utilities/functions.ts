
export function disablePageScroll(){
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('wheel', preventDefault, { passive: false });
    document.addEventListener('scroll', preventDefault, { passive: false });
}

export function enablePageScroll(){
    document.removeEventListener('touchmove', preventDefault);
    document.removeEventListener('wheel', preventDefault);
    document.removeEventListener('scroll', preventDefault);
}

function preventDefault(e: Event) {
    e.preventDefault();
}


