import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class TopParamsReader implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    
    // Output values
    private _parameterValue: string;
    private _allParameters: string;
    private _isInIframe: boolean;
    private _errorMessage: string;
    
    // UI elements
    private _statusDiv: HTMLDivElement;
    private _paramsDiv: HTMLDivElement;
    private _compactDiv: HTMLDivElement;

    constructor() {
        console.log("[TopParamsReader] Constructor called");
        this._parameterValue = "";
        this._allParameters = "{}";
        this._isInIframe = false;
        this._errorMessage = "";
    }

    /**
     * Safely checks if the current window is in an iframe
     */
    private checkIfInIframe(): boolean {
        try {
            const isIframe = window.self !== window.top;
            console.log("[TopParamsReader] checkIfInIframe:", isIframe);
            return isIframe;
        } catch (e) {
            // If we get an error, we're likely in an iframe with cross-origin restrictions
            console.log("[TopParamsReader] checkIfInIframe: Cross-origin error, assuming iframe", e);
            return true;
        }
    }

    /**
     * Safely attempts to get URL parameters from the top window
     */
    private getTopWindowParams(): URLSearchParams | null {
        try {
            // Check if we can access top window
            if (window.top && window.top.location) {
                const params = new URLSearchParams(window.top.location.search);
                console.log("[TopParamsReader] getTopWindowParams: Successfully retrieved via direct access", params.toString());
                return params;
            }
            console.log("[TopParamsReader] getTopWindowParams: Top window not accessible");
            return null;
        } catch (e) {
            // Cross-origin restriction - this is expected in Canvas Apps
            console.log("[TopParamsReader] getTopWindowParams: Cross-origin restriction detected (expected for Canvas Apps)", e);
            console.log("[TopParamsReader] Will use postMessage API - ensure parent window has listener installed");
            this._errorMessage = "Using postMessage API for cross-origin communication";
            return null;
        }
    }

    /**
     * Attempts to get parameters via postMessage from parent
     */
    private setupMessageListener(): void {
        console.log("[TopParamsReader] setupMessageListener: Setting up message listener");
        
        // Set up message listener
        window.addEventListener("message", (event) => {
            console.log("[TopParamsReader] Message received from:", event.origin);
            console.log("[TopParamsReader] Message data:", event.data);
            
            try {
                // Add your trusted origins here for production
                // if (event.origin !== "https://yourtrustedorigin.com") {
                //     console.log("[TopParamsReader] Ignoring message from untrusted origin:", event.origin);
                //     return;
                // }
                
                if (event.data && event.data.type === "urlParams") {
                    console.log("[TopParamsReader] ✅ URL params received via postMessage:", event.data.params);
                    this._allParameters = JSON.stringify(event.data.params);
                    this._errorMessage = "";
                    this.updateUI();
                    this._notifyOutputChanged();
                } else if (event.data && event.data.type === "requestUrlParams") {
                    // If this control is in a parent frame, respond with current URL params
                    console.log("[TopParamsReader] Received request for URL params, responding...");
                    const currentParams = new URLSearchParams(window.location.search);
                    const paramsObj: { [key: string]: string } = {};
                    currentParams.forEach((value, key) => {
                        paramsObj[key] = value;
                    });
                    if (event.source && typeof event.source.postMessage === 'function') {
                        (event.source as Window).postMessage({ type: "urlParams", params: paramsObj }, { targetOrigin: event.origin } as any);
                    }
                }
            } catch (error) {
                console.error("[TopParamsReader] Error processing message:", error);
            }
        });

        // Request parameters from parent window with retry logic
        if (this._isInIframe) {
            console.log("[TopParamsReader] Running in iframe - requesting params from parent");
            this.requestParamsFromParent();
            
            // Retry after 1 second if no response
            setTimeout(() => {
                if (this._allParameters === "{}") {
                    console.log("[TopParamsReader] No params received yet, retrying...");
                    this.requestParamsFromParent();
                }
            }, 1000);
            
            // Final retry after 3 seconds
            setTimeout(() => {
                if (this._allParameters === "{}") {
                    console.log("[TopParamsReader] Still no params received after retries");
                    console.log("[TopParamsReader] Parent window may not have postMessage listener installed");
                    this._errorMessage = "No response from parent window. Install postMessage listener in parent.";
                    this.updateUI();
                    this._notifyOutputChanged();
                }
            }, 3000);
        }
    }
    
    /**
     * Requests parameters from parent window via postMessage
     * Sends to both immediate parent and top window to handle nested iframes
     */
    private requestParamsFromParent(): void {
        const message = { type: "requestUrlParams", source: "TopParamsReader" };
        let messagesSent = 0;

        // Send to immediate parent
        if (window.parent && window.parent !== window) {
            try {
                console.log("[TopParamsReader] Sending requestUrlParams message to window.parent");
                window.parent.postMessage(message, "*");
                messagesSent++;
            } catch (error) {
                console.error("[TopParamsReader] Error requesting params from window.parent:", error);
            }
        }

        // Send to top window (in case we're nested multiple levels deep)
        if (window.top && window.top !== window && window.top !== window.parent) {
            try {
                console.log("[TopParamsReader] Sending requestUrlParams message to window.top");
                window.top.postMessage(message, "*");
                messagesSent++;
            } catch (error) {
                console.error("[TopParamsReader] Error requesting params from window.top:", error);
            }
        }

        console.log(`[TopParamsReader] Sent requestUrlParams to ${messagesSent} parent window(s)`);
    }

    /**
     * Retrieves a specific parameter value
     */
    private getParameterValue(paramName: string, params: URLSearchParams | null): string {
        if (!paramName || !params) {
            console.log("[TopParamsReader] getParameterValue: No paramName or params");
            return "";
        }
        const value = params.get(paramName) || "";
        console.log(`[TopParamsReader] getParameterValue: ${paramName} = ${value}`);
        return value;
    }

    /**
     * Converts URLSearchParams to JSON string
     */
    private paramsToJson(params: URLSearchParams | null): string {
        if (!params) {
            console.log("[TopParamsReader] paramsToJson: No params provided");
            return "{}";
        }
        
        const paramsObj: { [key: string]: string } = {};
        params.forEach((value, key) => {
            paramsObj[key] = value;
        });
        
        const json = JSON.stringify(paramsObj);
        console.log("[TopParamsReader] paramsToJson:", json);
        return json;
    }

    /**
     * Updates the UI display
     */
    private updateUI(): void {
        console.log("[TopParamsReader] updateUI: Updating UI", {
            allParameters: this._allParameters,
            isInIframe: this._isInIframe,
            errorMessage: this._errorMessage
        });
        // Update compact view
        if (this._compactDiv) {
            try {
                const paramsObj = JSON.parse(this._allParameters);
                const paramCount = Object.keys(paramsObj).length;
                const status = this._errorMessage ? "⚠️" : "✓";
                const iframeIndicator = this._isInIframe ? "📄" : "";
                this._compactDiv.innerHTML = `<span class="compact-indicator">${status} ${iframeIndicator} ${paramCount} param${paramCount !== 1 ? 's' : ''}</span>`;
            } catch (error) {
                console.log("[TopParamsReader] updateUI: Error parsing parameters", error);
                this._compactDiv.innerHTML = '<span class="compact-indicator">⚙️ Ready</span>';
            }
        }

        if (this._statusDiv) {
            let statusHtml = `<strong>Status:</strong> ${this._isInIframe ? "Running in iframe" : "Not in iframe"}<br/>`;
            
            if (this._errorMessage) {
                statusHtml += `<span class="error"><strong>Error:</strong> ${this._errorMessage}</span><br/>`;
                statusHtml += `<span class="info">Tip: Use postMessage API for cross-origin iframe communication</span>`;
            } else {
                statusHtml += `<span class="success">✓ Successfully accessed parameters</span>`;
            }
            
            this._statusDiv.innerHTML = statusHtml;
        }

        if (this._paramsDiv) {
            try {
                const paramsObj = JSON.parse(this._allParameters);
                const paramCount = Object.keys(paramsObj).length;
                
                let paramsHtml = `<strong>Parameters Found:</strong> ${paramCount}<br/>`;
                
                if (paramCount > 0) {
                    paramsHtml += '<ul class="params-list">';
                    for (const [key, value] of Object.entries(paramsObj)) {
                        paramsHtml += `<li><code>${key}</code>: ${value}</li>`;
                    }
                    paramsHtml += '</ul>';
                } else {
                    paramsHtml += '<em>No parameters found in URL</em>';
                }
                
                this._paramsDiv.innerHTML = paramsHtml;
            } catch (error) {
                console.log("[TopParamsReader] updateUI: Error rendering parameters", error);
                this._paramsDiv.innerHTML = '<em>No parameters available</em>';
            }
        }
    }

    /**
     * Used to initialize the control instance
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        console.log("[TopParamsReader] init: Initializing component", {
            context: context,
            state: state
        });
        this._context = context;
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;

        // Create container
        this._container.className = "top-params-reader-container";

        // Create compact view (always present)
        this._compactDiv = document.createElement("div");
        this._compactDiv.className = "compact-view";
        this._container.appendChild(this._compactDiv);

        // Create status section
        this._statusDiv = document.createElement("div");
        this._statusDiv.className = "status-section";
        this._container.appendChild(this._statusDiv);

        // Create parameters display section
        this._paramsDiv = document.createElement("div");
        this._paramsDiv.className = "params-section";
        this._container.appendChild(this._paramsDiv);

        // Check if in iframe
        this._isInIframe = this.checkIfInIframe();

        // Setup message listener for cross-origin scenarios
        this.setupMessageListener();

        // Try to get parameters from top window
        const params = this.getTopWindowParams();
        
        if (params) {
            this._allParameters = this.paramsToJson(params);
            this._errorMessage = "";
        }

        // Update UI
        this.updateUI();
        
        // Notify outputs changed
        this._notifyOutputChanged();
    }

    /**
     * Called when any value in the property bag has changed
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        console.log("[TopParamsReader] updateView: View update called");
        this._context = context;
        
        // Get the parameter name input
        const paramName = context.parameters.parameterName?.raw || "";
        console.log("[TopParamsReader] updateView: paramName =", paramName);
        
        // Get showDetails setting
        const showDetails = context.parameters.showDetails?.raw ?? true;
        console.log("[TopParamsReader] updateView: showDetails =", showDetails);
        
        // Toggle visibility of detailed sections
        if (this._statusDiv && this._paramsDiv) {
            this._statusDiv.style.display = showDetails ? "block" : "none";
            this._paramsDiv.style.display = showDetails ? "block" : "none";
            this._compactDiv.style.display = "none"; // Always hide compact view
        }
        
        // Make entire container invisible when showDetails is false
        if (this._container) {
            this._container.style.display = showDetails ? "block" : "none";
        }
        
        // Try to get parameters again
        const params = this.getTopWindowParams();
        
        if (params) {
            this._allParameters = this.paramsToJson(params);
            this._parameterValue = this.getParameterValue(paramName, params);
            this._errorMessage = "";
        } else if (paramName) {
            // Try to get from cached all parameters
            try {
                const paramsObj = JSON.parse(this._allParameters);
                this._parameterValue = paramsObj[paramName] || "";
                console.log(`[TopParamsReader] updateView: Retrieved from cache - ${paramName} = ${this._parameterValue}`);
            } catch (e) {
                console.log("[TopParamsReader] updateView: Error parsing cached parameters", e);
                this._parameterValue = "";
            }
        }

        // Update UI
        this.updateUI();
        
        // Notify outputs changed
        this._notifyOutputChanged();
    }

    /**
     * Returns an object that encapsulates any data that should be persisted
     */
    public getOutputs(): IOutputs {
        const outputs = {
            parameterValue: this._parameterValue,
            allParameters: this._allParameters,
            isInIframe: this._isInIframe,
            errorMessage: this._errorMessage
        };
        console.log("[TopParamsReader] getOutputs:", outputs);
        return outputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree
     */
    public destroy(): void {
        console.log("[TopParamsReader] destroy: Component being destroyed");
        // Clean up if needed
    }
}
