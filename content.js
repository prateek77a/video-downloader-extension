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
