const form = document.querySelector('#testerFeedbackForm');
const statusLine = document.querySelector('#feedbackStatus');

function setStatus(message) {
  if (statusLine) statusLine.textContent = message;
}

function formValue(formData, key) {
  return String(formData.get(key) || '').trim();
}

async function submitFeedback(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const answers = {};

  [
    'browser_opened',
    'apk_installed',
    'product_clear',
    'first_click_clear',
    'game_started',
    'would_return',
  ].forEach((key) => {
    const value = formValue(formData, key);
    if (value) answers[key] = value;
  });

  const payload = {
    name: formValue(formData, 'name'),
    email: formValue(formData, 'email'),
    device: formValue(formData, 'device'),
    tested_version: formValue(formData, 'tested_version'),
    answers,
    confusion_comment: formValue(formData, 'confusion_comment'),
    interesting_feature: formValue(formData, 'interesting_feature'),
    clarity_rating: Number(formData.get('clarity_rating') || 0) || undefined,
    first_improvement: formValue(formData, 'first_improvement'),
    additional_comments: formValue(formData, 'additional_comments'),
    source: 'public-web-checklist',
  };

  setStatus('Saving feedback...');
  try {
    const response = await window.marketApiJson('/platform/launch/tester-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setStatus(response.message || 'Thank you. Your feedback was saved.');
    form.reset();
  } catch (error) {
    setStatus(error.message || 'Feedback could not be saved.');
  }
}

form?.addEventListener('submit', submitFeedback);
