function saveOptions() {
  browser.storage.sync.set({
    labelEnabled: document.querySelector('#label-toggle').checked,
    label: document.querySelector('#label-text').value,
  });
}
document.querySelector('#label-toggle').addEventListener('change', saveOptions);
document.querySelector('#label-text').addEventListener('change', saveOptions);

document.addEventListener('DOMContentLoaded', async () => {
  const loadValues = browser.storage.sync.get();
  toggleInput = document.querySelector('#label-toggle');
  labelInput = document.querySelector('#label-text');

  toggleInput.addEventListener('change', () => {
    labelInput.disabled = !toggleInput.checked;
  });

  const { label, labelEnabled } = await loadValues;
  toggleInput.checked = labelEnabled;
  if (label) labelInput.value = label;
  labelInput.disabled = !toggleInput.checked;
});
