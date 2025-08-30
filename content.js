chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getVideos") {
    const videos = [];
    
    // Find HTML5 video elements
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      if (video.src) {
        videos.push({
          src: video.src,
          type: 'video/mp4'
        });
      }
      
      // Check for source elements within video
      const sources = video.querySelectorAll('source');
      sources.forEach(source => {
        if (source.src) {
          videos.push({
            src: source.src,
            type: source.type || 'video/mp4'
          });
        }
      });
    });
    
    // Find iframe embedded videos
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      // For YouTube iframes
      if (iframe.src.includes('youtube.com/embed/')) {
        const videoId = iframe.src.split('/').pop().split('?')[0];
        videos.push({
          src: `https://www.youtube.com/watch?v=${videoId}`,
          type: 'youtube',
          videoId: videoId
        });
      }
      
      // For Vimeo iframes
      if (iframe.src.includes('player.vimeo.com/video/')) {
        const videoId = iframe.src.split('/').pop().split('?')[0];
        videos.push({
          src: `https://vimeo.com/${videoId}`,
          type: 'vimeo',
          videoId: videoId
        });
      }
    });
    
    // For SCORM players and other embedded videos
    // This is a more advanced detection that looks for video URLs in the page
    const pageContent = document.documentElement.innerHTML;
    const mp4Regex = /https?:\/\/[^"'\s]+\.mp4/g;
    const mp4Matches = pageContent.match(mp4Regex);
    
    if (mp4Matches) {
      mp4Matches.forEach(url => {
        videos.push({
          src: url,
          type: 'video/mp4'
        });
      });
    }
    
    // Look for HLS streams (.m3u8)
    const hlsRegex = /https?:\/\/[^"'\s]+\.m3u8/g;
    const hlsMatches = pageContent.match(hlsRegex);
    
    if (hlsMatches) {
      hlsMatches.forEach(url => {
        videos.push({
          src: url,
          type: 'application/x-mpegURL'
        });
      });
    }
    
    sendResponse({videos: videos});
  }
  return true;
});

function detectScormVideos() {
  const videos = [];
  
  // Look for video elements inside iframes
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeVideos = iframeDoc.querySelectorAll('video');
      
      iframeVideos.forEach(video => {
        if (video.src) {
          videos.push({
            src: video.src,
            type: 'video/mp4'
          });
        }
        
        const sources = video.querySelectorAll('source');
        sources.forEach(source => {
          if (source.src) {
            videos.push({
              src: source.src,
              type: source.type || 'video/mp4'
            });
          }
        });
      });
    } catch (e) {
      // Cross-origin iframe access will fail
      console.log("Could not access iframe content due to same-origin policy");
    }
  });
  
  // Look for specific SCORM player elements
  const scormElements = document.querySelectorAll('[data-scorm-video], .scorm-video, .video-js');
  scormElements.forEach(element => {
    // Extract video URL from data attributes or other properties
    const videoUrl = element.getAttribute('data-video-url') || 
                     element.getAttribute('src') ||
                     element.querySelector('source')?.src;
    
    if (videoUrl) {
      videos.push({
        src: videoUrl,
        type: 'video/mp4'
      });
    }
  });
  
  return videos;
}

// Add the SCORM detection to the message listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getVideos") {
    let videos = [];
    
    // Standard video detection (from previous code)
    // ...
    
    // Add SCORM-specific detection
    const scormVideos = detectScormVideos();
    videos = videos.concat(scormVideos);
    
    sendResponse({videos: videos});
  }
  return true;
});
