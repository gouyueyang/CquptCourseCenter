(function(){
	var doc = document,
		 video = doc.getElementById('video'),
		 hash = parseHash(window.location.href),
		 fileName = hash.fileName,
		 host = courseCenter.host,
		 errorInf = doc.getElementById('error'),
		 warp = doc.getElementById('warp'),
		 videoURL = host + 'upload/CourseCenterAttachment/';
	video.src = videoURL+fileName;
	video.onerror = function(){
		errorInf.style.cssText='display:block';
		warp.removeChild(video);
	}
})();