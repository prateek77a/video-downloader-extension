document.addEventListener('DOMContentLoaded', function() {
  const videosContainer = document.getElementById('videos-container');
  const loadingElement = document.getElementById('loading');
  
  // Query the active tab to get videos
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getVideos"}, function(response) {
      loadingElement.style.display = 'none';
      
      if (response && response.videos && response.videos.length > 0) {
        response.videos.forEach((video, index) => {
          const videoItem = document.createElement('div');
          videoItem.className = 'video-item';
          
          const videoTitle = document.createElement('div');
          videoTitle.className = 'video-title';
          videoTitle.textContent = `Video ${index + 1}`;
          
          const downloadOptions = document.createElement('div');
          downloadOptions.className = 'download-options';
          
          const mp4Button = document.createElement('button');
          mp4Button.textContent = 'Download MP4';
          mp4Button.addEventListener('click', function() {
            chrome.runtime.sendMessage({
              action: "downloadVideo",
              url: video.src,
              format: "mp4",
              filename: `video_${index + 1}.mp4`
            });
          });
          
          const mp3Button = document.createElement('button');
          mp3Button.textContent = 'Download MP3';
          mp3Button.addEventListener('click', function() {
            chrome.runtime.sendMessage({
              action: "downloadVideo",
              url: video.src,
              format: "mp3",
              filename: `video_${index + 1}.mp3`
            });
          });
          
          downloadOptions.appendChild(mp4Button);
          downloadOptions.appendChild(mp3Button);
          
          videoItem.appendChild(videoTitle);
          videoItem.appendChild(downloadOptions);
          videosContainer.appendChild(videoItem);
        });
      } else {
        videosContainer.innerHTML = '<div class="no-videos">No videos found on this page.</div>';
      }
    });
  });
});
