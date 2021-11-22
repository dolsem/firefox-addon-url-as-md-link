/**
 * Based on https://github.com/asamuzaK/url2clipboard/blob/950e0b0d2290be5dfe5b6c428639fd0403a32f87/src/mjs/clipboard.js
 */

const Clipboard = {
  async copy(text) {
    const { clipboard } = navigator;
    if (clipboard && typeof clipboard.writeText === 'function') {
      try {
        await clipboard.writeText(text);
      } catch (e) {
        this._copySync(text);
      }
    } else {
        this._copySync(text);
    }
  },
  _copySync(text) {
    /**
     * set clipboard data
     *
     * @param {object} evt - Event
     * @returns {void}
     */
    const setClipboardData = evt => {
      document.removeEventListener('copy', setClipboardData, true);
      evt.stopImmediatePropagation();
      evt.preventDefault();
      evt.clipboardData.setData('text/plain', text);
    };
    document.addEventListener('copy', setClipboardData, true);
    document.execCommand('copy');
  },
}
