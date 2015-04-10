# chrome-idle
A Chrome App's idle API.

## Permissions
You need to declare "idle" perrmissions into your manifest file.

    ...
      "permissions": [
        "idle"
      ],
    ...


## Example:

    <chrome-idle id="idle"
      interval="60"
      on-state-changed="{{showState}}"
      on-state="{{showState}}"
      on-error="{{iddleError}}"></chrome-idle>

## API
### state-changed event
Fired when a iddle state has changed. 
The details object will have "state" key with either "active", "idle", or "locked" state.

### state event
Fired when a iddle state has been determined by querying it's state.

Detail's "state" key will have a value: 
* "locked" if the system is locked, 
* "idle" if the user has not generated any input for a specified number of seconds, or 
* "active" otherwise.

### interval
Threshold, in seconds, used to determine when the system is in an idle state.

The system is considered idle if interval seconds have elapsed since the last user input detected.
API Docs: https://developer.chrome.com/apps/idle#method-setDetectionInterval