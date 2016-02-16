Polymer({
  is: 'chrome-idle',
  /**
   * Fired when a iddle state has changed
   * The details object will have "state" key with either "active", "idle",
   * or "locked" state.
   *
   * @event state-changed
   */
  /**
   * Fired when a iddle state has been determined by querying it's state.
   * Detail's "state" key will have a value: "locked" if the system is locked,
   * "idle" if the user has not generated any input for a specified number
   * of seconds, or "active" otherwise.
   *
   * @event state
   */
  properties: {
    /**
     * Threshold, in seconds, used to determine when the system is in an idle state.
     *
     * The system is considered idle if interval seconds have elapsed
     * since the last user input detected.
     *
     * API Docs: https://developer.chrome.com/apps/idle#method-setDetectionInterval
     *
     * @type Number
     */
    interval: {
      value: 60,
      type: Number,
      observer: 'intervalChanged'
    },
    /**
     * Current state of browser / ChromeOS.
     * Value can be `locked`, `idle` or `active`
     *
     * @type {String}
     */
    state: {
      type: String,
      readOnly: true,
      notify: true
    },

    /**
     * A handler to be called when device state has changed.
     */
    _onStateChangedHandler: {
      value: function() {
        return this._onStateChanged.bind(this);
      }
    }
  },

  intervalChanged: function() {
    if (!this.interval) {
      return;
    }
    if (typeof this.interval !== 'number') {
      try {
        this.interval = parseInt(this.interval);
      } catch (e) {
        this.fire('error', e);
        return;
      }
    }
    try {
      chrome.idle.setDetectionInterval(this.interval);
    } catch (e) {
      this.fire('error', e);
    }
  },

  /**
   * Returns "locked" if the system is locked, "idle" if the user has not
   * generated any input for a specified number of seconds, or "active" otherwise.
   *
   * This function will fire "state" event.
   */
  state: function() {
    chrome.idle.queryState(this.interval, (state) => this.fire('state', {
      'state': state
    }));
  },
  /**
   * Add a listener for state change.
   */
  attached: function() {
    chrome.idle.onStateChanged.addListener(this._onStateChangedHandler);
  },
  /**
   * Remove state listener.
   */
  detached: function() {
    chrome.idle.onStateChanged.removeListener(this._onStateChangedHandler);
  },
  /**
   * A function called when state has changed
   */
  _onStateChanged: function(state) {
    this._setState(state);
    this.fire('state-changed', {
      'state': state
    });
  }
});
