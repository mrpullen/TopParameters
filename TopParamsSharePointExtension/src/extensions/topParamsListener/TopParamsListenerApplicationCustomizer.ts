import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

import * as strings from 'TopParamsListenerApplicationCustomizerStrings';

const LOG_SOURCE: string = 'TopParamsListenerApplicationCustomizer';

export interface ITopParamsListenerApplicationCustomizerProperties {
  enableLogging?: boolean;
}

/**
 * SharePoint Framework Application Customizer
 * Enables URL parameter communication between SharePoint pages and embedded Canvas Apps
 * containing the TopParamsReader PCF control
 */
export default class TopParamsListenerApplicationCustomizer
  extends BaseApplicationCustomizer<ITopParamsListenerApplicationCustomizerProperties> {

  private _enableLogging: boolean = true;

  /**
   * Logs message to console if logging is enabled
   */
  private log(message: string, ...args: any[]): void {
    if (this._enableLogging) {
      console.log(`[TopParams SPFx] ${message}`, ...args);
    }
  }

  /**
   * Gets URL parameters from the current page
   */
  private getUrlParameters(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    const paramsObject: Record<string, string> = {};
    
    params.forEach((value, key) => {
      paramsObject[key] = value;
    });
    
    return paramsObject;
  }

  /**
   * Handles incoming postMessage requests
   */
  private handleMessage = (event: MessageEvent): void => {
    this.log('Message received from:', event.origin);
    this.log('Message data:', event.data);

    // Validate message structure
    if (!event.data || typeof event.data !== 'object') {
      return;
    }

    // Handle request for URL parameters
    if (event.data.type === 'requestUrlParams') {
      this.log('Received request for URL params');
      
      const urlParams = this.getUrlParameters();
      this.log('Sending URL params:', urlParams);

      // Send parameters back to the requesting iframe
      if (event.source && typeof (event.source as Window).postMessage === 'function') {
        try {
          (event.source as Window).postMessage({
            type: 'urlParams',
            params: urlParams
          }, event.origin);
          this.log('✓ URL params sent successfully');
        } catch (error) {
          this.log('Error sending params:', error);
        }
      }
    }
  }

  /**
   * Broadcasts URL parameters to all iframes on the page (including nested iframes)
   */
  private broadcastToIframes(): void {
    const urlParams = this.getUrlParameters();
    
    this.log('Broadcasting params to all iframes (including nested):', urlParams);
    
    // Get all iframes recursively
    const allIframes = this.getAllIframesRecursive(document);
    
    this.log(`Found ${allIframes.length} total iframe(s) including nested`);

    let successCount = 0;
    for (let i = 0; i < allIframes.length; i++) {
      try {
        const iframe = allIframes[i];
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'urlParams',
            params: urlParams
          }, '*');
          successCount++;
          this.log(`✓ Sent to iframe ${i + 1}/${allIframes.length}`);
        }
      } catch (error) {
        this.log(`✗ Could not send to iframe ${i + 1}:`, error);
      }
    }
    
    this.log(`Successfully sent params to ${successCount}/${allIframes.length} iframes`);
  }

  /**
   * Recursively gets all iframes including nested ones
   */
  private getAllIframesRecursive(doc: Document | HTMLDocument, depth: number = 0): HTMLIFrameElement[] {
    const maxDepth = 10; // Prevent infinite recursion
    if (depth > maxDepth) {
      this.log(`Max recursion depth ${maxDepth} reached`);
      return [];
    }

    let allIframes: HTMLIFrameElement[] = [];
    const directIframes = doc.getElementsByTagName('iframe');
    
    this.log(`Depth ${depth}: Found ${directIframes.length} direct iframe(s)`);

    for (let i = 0; i < directIframes.length; i++) {
      const iframe = directIframes[i];
      allIframes.push(iframe);
      
      // Try to access nested iframes
      try {
        if (iframe.contentDocument) {
          const nestedIframes = this.getAllIframesRecursive(iframe.contentDocument, depth + 1);
          this.log(`Depth ${depth}: Found ${nestedIframes.length} nested iframe(s) in iframe ${i}`);
          allIframes = allIframes.concat(nestedIframes);
        }
      } catch (error) {
        // Cross-origin restriction - can't access nested content
        this.log(`Depth ${depth}: Cannot access nested content of iframe ${i} (cross-origin)`);
      }
    }

    return allIframes;
  }

  /**
   * Called when the extension is initialized
   */
  public onInit(): Promise<void> {
    // Log IMMEDIATELY to console - before anything else
    console.log('============================================');
    console.log('[TopParams SPFx] EXTENSION LOADING...');
    console.log('[TopParams SPFx] Timestamp:', new Date().toISOString());
    console.log('[TopParams SPfx] Page URL:', window.location.href);
    console.log('============================================');
    
    // Make it VERY obvious in the console
    console.log('%c[TopParams SPFx] Extension is ACTIVE!', 'color: white; background: green; font-size: 20px; padding: 10px;');
    
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Get logging preference from properties
    if (this.properties && typeof this.properties.enableLogging === 'boolean') {
      this._enableLogging = this.properties.enableLogging;
    }

    this.log('✓ Top Params Listener initialized successfully');
    this.log('Current URL:', window.location.href);
    this.log('URL Parameters:', this.getUrlParameters());
    this.log('Properties:', this.properties);
    this.log('Context:', this.context);

    // Set up postMessage listener
    window.addEventListener('message', this.handleMessage);
    this.log('✓ PostMessage listener installed');
    console.log('[TopParams SPFx] ✓ PostMessage event listener attached to window');

    // Broadcast parameters after a short delay to allow iframes to load
    setTimeout(() => {
      this.log('Initial broadcast (1 second delay)');
      this.broadcastToIframes();
    }, 1000);

    // Additional broadcasts for nested iframes that may load slower
    setTimeout(() => {
      this.log('Retry broadcast (3 seconds delay)');
      this.broadcastToIframes();
    }, 3000);

    setTimeout(() => {
      this.log('Final broadcast (5 seconds delay)');
      this.broadcastToIframes();
    }, 5000);

    // Also broadcast when page becomes visible (for cached pages)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.log('Page became visible, broadcasting params');
        this.broadcastToIframes();
      }
    });

    // Set up MutationObserver to detect new iframes being added
    const observer = new MutationObserver((mutations) => {
      let iframeAdded = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'IFRAME') {
            iframeAdded = true;
          }
        });
      });
      
      if (iframeAdded) {
        this.log('New iframe detected, broadcasting params');
        setTimeout(() => this.broadcastToIframes(), 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.log('✓ Iframe observer installed');

    return Promise.resolve();
  }

  /**
   * Called when the extension is disposed
   */
  public onDispose(): void {
    this.log('Extension being disposed');
    window.removeEventListener('message', this.handleMessage);
  }
}
