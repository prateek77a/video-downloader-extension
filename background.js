chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "downloadVideo") {
    if (request.format === "mp4") {
      // Direct download for MP4
      chrome.downloads.download({
        url: request.url,
        filename: request.filename,
        saveAs: true
      });
    } 
    else if (request.format === "mp3") {
      // For MP3, we would ideally convert the video
      // Since browser extensions can't directly convert videos to MP3,
      // we'll use a server-side service or inform the user
      
      // Option 1: Use a conversion service API
      // This is a placeholder - you would need to implement or use a real service
      convertToMp3(request.url, request.filename);
      
      // Option 2: Open a tab with a conversion service
      chrome.tabs.create({
        url: `https://convert-video-online.com/download/?url=${encodeURIComponent(request.url)}`
      });
    }
  }
  return true;
});

// This function would call your server-side conversion API
function convertToMp3(videoUrl, filename) {
  // This is a placeholder for server-side conversion
  // In a real implementation, you would call your own API endpoint
  console.log("Converting", videoUrl, "to MP3");
  
  // Example of what this might look like:
  /*
  fetch('https://your-conversion-api.com/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: videoUrl,
      format: 'mp3'
    })
  })
  .then(response => response.json())
  .then(data => {
    chrome.downloads.download({
      url: data.downloadUrl,
      filename: filename,
      saveAs: true
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */
}
