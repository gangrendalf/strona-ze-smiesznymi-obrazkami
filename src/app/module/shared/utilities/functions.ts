
export function disableScroll(){
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('wheel', preventDefault, { passive: false });
    document.addEventListener('scroll', preventDefault, { passive: false });
}

export function enableScroll(){
    document.removeEventListener('touchmove', preventDefault);
    document.removeEventListener('wheel', preventDefault);
    document.removeEventListener('scroll', preventDefault);
}

function preventDefault(e: Event) {
    e.preventDefault();
}


