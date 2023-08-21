window.FlexAnimation = {
    autoReverse: false,
};

window.FlexAnimation.animateIn = function(element)
{
    if(element.dataset.animationState == "in") return;

    let delay = element.dataset.animationDelay;
    if(delay) element.style.animationDelay = delay + "ms";

    element.style.animationName = element.dataset.animation;
    element.style.animationFillMode = "backwards";
    element.style.animationPlayState = "running";
    
    element.dataset.animationState = "in";
};


window.FlexAnimation.animateOut = function(element)
{
    if(element.dataset.animationState == "out") return;

    let animation = element.style.animationName;
    element.style.animationName = "none";
    element.style.animationPlayState = "paused";
    
    setTimeout(() => {    
        element.style.animationName = animation;
    }, 100);

    element.dataset.animationState = "out";
};

window.FlexAnimation.isInLineOfSight = function(element)
{
    let rect = element.getBoundingClientRect();
    return ((rect.top <= window.innerHeight) && (rect.top <= window.innerWidth));
}

window.FlexAnimation.overwatch = function()
{
    let currentScrollPosition = window.scrollY;

    if (
        (currentScrollPosition == 0) ||
        (Math.abs(currentScrollPosition - FlexAnimation.lastScrollPosition) >= 100)
    ) {

        for(let element of document.querySelectorAll("[data-animation]"))
        {
            if(FlexAnimation.isInLineOfSight(element)) {
                FlexAnimation.animateIn(element);
            } else if(FlexAnimation.autoReverse) {
                FlexAnimation.animateOut(element);
            }
        }

        FlexAnimation.lastScrollPosition = currentScrollPosition;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.FlexAnimation.lastScrollPosition = 0;
    
    for(let element of document.querySelectorAll("[data-animation]"))
    {
        element.style.animationName = element.dataset.animation;
        element.style.animationFillMode = "backwards";
        element.style.animationPlayState = "paused";
    }

    FlexAnimation.overwatch();
    window.addEventListener('scroll', () => {
        FlexAnimation.overwatch();
    });
});