// Hover-to-play video; revert to poster image on leave 
document.querySelectorAll(".gallery-item").forEach((item) => { 
    const videoUrl = item.dataset.video; 
    const video = item.querySelector(".video"); 
    const play = () => { 
        if (!video || !videoUrl) return; 
        if (!video.src) video.src = videoUrl; 
        // lazy set src on first hover 
        video.currentTime = 0; 
        video.muted = true; 
        const p = video.play(); 
        if (p && typeof p.then === "function") p.catch(() => {

        }); 
        item.classList.add("playing"); 
    }; 
    
    const stop = () => { 
        if (!video) return; 
        video.pause(); 
        video.currentTime = 0; 
        item.classList.remove("playing"); 
        
        // hides video, reveals poster underneath 
    }; 
    item.addEventListener("mouseenter", play); 
    item.addEventListener("mouseleave", stop); 
    
    // Optional keyboard/focus support 
    item.addEventListener("focusin", play); 
    item.addEventListener("focusout", stop); 
});