const launchPage = document.body.dataset.launchPage;
const launchStatus = document.querySelector('#launchStatus');

function launchApi(path, options = {}) {
  return fetch(window.marketApiUrl ? window.marketApiUrl(path) : path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }).then(async (response) => {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed: ${response.status}`);
    }
    return response.json();
  });
}

function setLaunchStatus(message) {
  if (launchStatus) launchStatus.textContent = message;
}

function referralFromUrl() {
  return new URLSearchParams(window.location.search).get('ref') || '';
}

function buildReferralUrl(code) {
  const url = new URL('./coming-soon.html', window.location.href);
  url.searchParams.set('ref', code);
  return url.toString();
}

async function copyText(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

function bootComingSoon() {
  const form = document.querySelector('#earlyAccessForm');
  const referralBox = document.querySelector('#referralBox');
  const referralLink = document.querySelector('#referralLink');
  const copyButton = document.querySelector('#copyReferralButton');
  let currentReferralLink = '';

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setLaunchStatus('Saving your early access request...');

    try {
      const result = await launchApi('/platform/launch/early-access', {
        method: 'POST',
        body: JSON.stringify({
          email: document.querySelector('#earlyAccessEmail').value,
          display_name: document.querySelector('#earlyAccessName').value,
          referral_code: referralFromUrl(),
          locale: localStorage.getItem('market_language') || 'en',
          source: 'coming-soon',
        }),
      });
      currentReferralLink = buildReferralUrl(result.referral.code);
      referralLink.textContent = currentReferralLink;
      referralBox.classList.remove('hidden');
      setLaunchStatus('You are on the early access list. Invite friends with your link.');
    } catch (error) {
      setLaunchStatus(error.message.replace(/[{}"]/g, ''));
    }
  });

  copyButton?.addEventListener('click', async () => {
    if (!currentReferralLink) return;
    await copyText(currentReferralLink);
    setLaunchStatus('Referral link copied.');
  });
}

function renderDevLog(entries) {
  const root = document.querySelector('#devlogList');
  root.innerHTML = entries
    .map(
      (entry) => `
        <article class="launch-entry">
          <div>
            <span>${entry.version}</span>
            <h2>${entry.title}</h2>
            <p>${entry.summary}</p>
          </div>
          <p>${entry.body}</p>
          <div class="launch-tags">${(entry.tags || [])
            .map((tag) => `<small>${tag}</small>`)
            .join('')}</div>
        </article>
      `,
    )
    .join('');
}

function renderWhatsNew(updates) {
  const root = document.querySelector('#whatsNewList');
  root.innerHTML = updates
    .map(
      (update) => `
        <article class="launch-entry featured">
          <div>
            <span>${update.version}</span>
            <h2>${update.title}</h2>
            <p>${update.summary}</p>
          </div>
          <ul>${(update.highlights || [])
            .map((item) => `<li>${item}</li>`)
            .join('')}</ul>
          <p>${update.body}</p>
        </article>
      `,
    )
    .join('');
}

async function bootLaunchPage() {
  if (launchPage === 'coming-soon') {
    bootComingSoon();
    return;
  }

  try {
    if (launchPage === 'devlog') {
      renderDevLog(await launchApi('/platform/devlog'));
      setLaunchStatus('DevLog loaded.');
    }

    if (launchPage === 'whats-new') {
      renderWhatsNew(await launchApi('/platform/whats-new'));
      setLaunchStatus('Latest update loaded.');
    }
  } catch (error) {
    setLaunchStatus(error.message.replace(/[{}"]/g, ''));
  }
}

bootLaunchPage();
