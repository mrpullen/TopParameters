/**
 * Parent Window PostMessage Listener for TopParamsReader PCF Control
 * 
 * INSTRUCTIONS:
 * Add this script to your Canvas App's HTML container or main page to enable
 * cross-origin parameter communication with the TopParamsReader control.
 * 
 * For Canvas Apps:
 * 1. Add an HTML text control to your app
 * 2. Set its HtmlText property to include this script in a <script> tag
 * 3. Or add this to your app's custom pages if available
 */

(function() {
    console.log('[TopParams Parent] Installing postMessage listener');
    
    // Listen for requests from child iframe (TopParamsReader control)
    window.addEventListener('message', function(event) {
        console.log('[TopParams Parent] Message received:', event.data);
        
        // Check if this is a request for URL parameters
        if (event.data && event.data.type === 'requestUrlParams') {
            console.log('[TopParams Parent] Received request for URL params from:', event.origin);
            
            // Get current URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const paramsObject = {};
            
            // Convert URLSearchParams to plain object
            urlParams.forEach(function(value, key) {
                paramsObject[key] = value;
            });
            
            console.log('[TopParams Parent] Sending URL params to child:', paramsObject);
            
            // Send parameters back to the requesting iframe
            event.source.postMessage({
                type: 'urlParams',
                params: paramsObject
            }, event.origin);
        }
    });
    
    console.log('[TopParams Parent] Listener installed successfully');
    
    // Also broadcast current params on load for any existing iframes
    setTimeout(function() {
        const urlParams = new URLSearchParams(window.location.search);
        const paramsObject = {};
        urlParams.forEach(function(value, key) {
            paramsObject[key] = value;
        });
        
        console.log('[TopParams Parent] Broadcasting initial URL params:', paramsObject);
        
        // Send to all iframes
        const iframes = document.getElementsByTagName('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                iframes[i].contentWindow.postMessage({
                    type: 'urlParams',
                    params: paramsObject
                }, '*');
            } catch (e) {
                console.log('[TopParams Parent] Could not send to iframe:', e);
            }
        }
    }, 500);
})();
