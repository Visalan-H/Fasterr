const slider = document.getElementById('slider');
const label = document.getElementById('slider-label');
const speedInput = document.getElementById('speed-input');

document.getElementById('slider').addEventListener('input', handleChange);
document.getElementById('speed-input').addEventListener('input', handleChange);

chrome.storage.local.get('playbackRate', (res) => {
    const savedRate = res.playbackRate || 1;
    slider.value = savedRate;
    speedInput.value = savedRate;
    label.innerHTML = savedRate + "x";
});


function handleChange(e) {
    speed = parseInt(e.target.value);
    // if (speed < 0.0625) speed = 0.0625;
    if (speed > 16) speed = 16;
    label.innerHTML = speed + "x";
    slider.value=speed;
    speedInput.value=speed;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (speed) => {
                const video = document.querySelector('video');
                if (video) video.playbackRate = speed;
            },
            args: [speed]
        });
    });

    chrome.storage.local.set({ playbackRate: speed });
}