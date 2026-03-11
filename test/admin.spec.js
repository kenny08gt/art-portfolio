'use strict';

const { test, expect } = require('@playwright/test');

const PASSWORD = 'testadmin123';
const WRONG_PW = 'wrongpassword';

// ── helpers ───────────────────────────────────────────────────────────────────
async function goToTab(page, name) {
  await page.click(`.tab[data-tab="${name}"]`);
  await expect(page.locator(`#tab-${name}`)).toBeVisible();
}

// ════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN  (uses real form — stays well under rate limit)
// ════════════════════════════════════════════════════════════════════════════
test.describe('Login screen', () => {

  test('shows only login form on first visit — dashboard is hidden', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('.login-screen')).toBeVisible();
    await expect(page.locator('.dashboard')).toBeHidden();
  });

  test('password field is focused on load', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('#loginPassword')).toBeFocused();
  });

  test('shows error message for wrong password', async ({ page }) => {
    await page.goto('/admin');
    await page.fill('#loginPassword', WRONG_PW);
    await page.click('button[type="submit"]');
    await expect(page.locator('#loginError')).toContainText(/invalid password/i);
  });

  test('correct password hides login and shows dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.fill('#loginPassword', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('.dashboard')).toBeVisible();
    await expect(page.locator('.login-screen')).toBeHidden();
  });

});

// ════════════════════════════════════════════════════════════════════════════
// ALL LOGGED-IN TESTS
// Uses token injection via sessionStorage to avoid making 20+ login API
// calls and hitting the rate limit.  One real login in beforeAll.
// ════════════════════════════════════════════════════════════════════════════
test.describe('Logged in >', () => {

  let token;

  test.beforeAll(async ({ request }) => {
    const res  = await request.post('/api/auth/login', { data: { password: PASSWORD } });
    const data = await res.json();
    if (!data.token) throw new Error('beforeAll login failed: ' + JSON.stringify(data));
    token = data.token;
  });

  // Inject JWT directly into sessionStorage — no UI login, no rate-limit hits
  async function loginViaToken(page) {
    await page.goto('/admin');
    await page.evaluate(t => sessionStorage.setItem('cms_token', t), token);
    await page.reload();
    await expect(page.locator('.dashboard')).toBeVisible();
  }

  // ── Session ──────────────────────────────────────────────────────────────
  test.describe('Session', () => {

    test('token in sessionStorage shows dashboard without login form', async ({ page }) => {
      await loginViaToken(page);
      await expect(page.locator('.login-screen')).toBeHidden();
    });

    test('token persists across page reload', async ({ page }) => {
      await loginViaToken(page);
      await page.reload();
      await expect(page.locator('.dashboard')).toBeVisible();
      await expect(page.locator('.login-screen')).toBeHidden();
    });

    test('logout clears session and shows login screen', async ({ page }) => {
      await loginViaToken(page);
      await page.click('#logoutBtn');
      await expect(page.locator('.login-screen')).toBeVisible();
      await expect(page.locator('.dashboard')).toBeHidden();
      // Reload still shows login (token was cleared)
      await page.reload();
      await expect(page.locator('.login-screen')).toBeVisible();
    });

  });

  // ── Dashboard layout ─────────────────────────────────────────────────────
  test.describe('Dashboard layout', () => {

    test('Hero tab is active by default', async ({ page }) => {
      await loginViaToken(page);
      await expect(page.locator('.tab.active')).toHaveText('Hero');
      await expect(page.locator('#tab-hero')).toBeVisible();
    });

    test('all five tabs are present', async ({ page }) => {
      await loginViaToken(page);
      for (const name of ['Hero', 'Stories', 'Sculptures', 'About', 'Images']) {
        await expect(page.locator(`.tab:has-text("${name}")`)).toBeVisible();
      }
    });

    test('clicking a tab shows its panel and hides others', async ({ page }) => {
      await loginViaToken(page);
      await page.click('.tab[data-tab="stories"]');
      await expect(page.locator('#tab-stories')).toBeVisible();
      await expect(page.locator('#tab-hero')).toBeHidden();
      await expect(page.locator('#tab-sculptures')).toBeHidden();
    });

  });

  // ── Hero tab ─────────────────────────────────────────────────────────────
  test.describe('Hero tab', () => {

    test('EN and ES tagline fields are populated from content.json', async ({ page }) => {
      await loginViaToken(page);
      await expect(page.locator('#hero-tagline-en')).not.toBeEmpty();
      await expect(page.locator('#hero-tagline-es')).not.toBeEmpty();
    });

    test('save shows success toast', async ({ page }) => {
      await loginViaToken(page);
      await expect(page.locator('#hero-tagline-en')).not.toBeEmpty(); // content loaded
      await page.route('/api/content', route =>
        route.request().method() === 'PUT'
          ? route.fulfill({ json: { ok: true } })
          : route.continue()
      );
      await page.fill('#hero-tagline-en', 'Updated tagline EN');
      await page.click('.btn-save[data-section="hero"]');
      await expect(page.locator('.toast.show')).toBeVisible();
      await expect(page.locator('.toast')).toContainText(/saved/i);
    });

    test('failed save shows error toast', async ({ page }) => {
      await loginViaToken(page);
      await page.route('/api/content', route =>
        route.request().method() === 'PUT'
          ? route.fulfill({ status: 500, json: { error: 'disk full' } })
          : route.continue()
      );
      await page.click('.btn-save[data-section="hero"]');
      await expect(page.locator('.toast.show')).toBeVisible();
      await expect(page.locator('.toast')).toContainText(/failed|error/i);
    });

  });

  // ── Stories tab ──────────────────────────────────────────────────────────
  test.describe('Stories tab', () => {

    test('renders all stories from content.json', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'stories');
      await expect(page.locator('#storiesList .item-row')).toHaveCount(3);
    });

    test('edit panel is hidden by default', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'stories');
      await expect(page.locator('#storyEditPanel')).toBeHidden();
    });

    test('Edit opens panel with pre-filled story data', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'stories');
      await page.locator('#storiesList .btn-edit').first().click();
      await expect(page.locator('#storyEditPanel')).toBeVisible();
      await expect(page.locator('#story-title-en')).not.toBeEmpty();
      await expect(page.locator('#story-tag-en')).not.toBeEmpty();
    });

    test('Cancel closes the edit panel', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'stories');
      await page.locator('#storiesList .btn-edit').first().click();
      await page.click('#storyEditCancel');
      await expect(page.locator('#storyEditPanel')).toBeHidden();
    });

    test('Add Story opens blank edit panel', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'stories');
      await page.click('#addStoryBtn');
      await expect(page.locator('#storyEditPanel')).toBeVisible();
      await expect(page.locator('#storyEditHeading')).toContainText(/new story/i);
      await expect(page.locator('#story-title-en')).toBeEmpty();
    });

    test('saving a story shows success toast', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'stories');
      await page.route('/api/content', route =>
        route.request().method() === 'PUT'
          ? route.fulfill({ json: { ok: true } })
          : route.continue()
      );
      await page.locator('#storiesList .btn-edit').first().click();
      await page.click('#storyEditSave');
      await expect(page.locator('.toast.show')).toBeVisible();
    });

  });

  // ── Sculptures tab ───────────────────────────────────────────────────────
  test.describe('Sculptures tab', () => {

    test('renders all sculptures from content.json', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'sculptures');
      await expect(page.locator('#sculpturesList .item-row')).toHaveCount(6);
    });

    test('Edit opens panel with pre-filled sculpture data', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'sculptures');
      await page.locator('#sculpturesList .btn-edit').first().click();
      await expect(page.locator('#sculptureEditPanel')).toBeVisible();
      await expect(page.locator('#sculpture-title-en')).not.toBeEmpty();
      await expect(page.locator('#sculpture-year')).not.toBeEmpty();
    });

    test('Cancel closes the sculpture edit panel', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'sculptures');
      await page.locator('#sculpturesList .btn-edit').first().click();
      await page.click('#sculptureEditCancel');
      await expect(page.locator('#sculptureEditPanel')).toBeHidden();
    });

  });

  // ── About tab ────────────────────────────────────────────────────────────
  test.describe('About tab', () => {

    test('renders 4 bio paragraph rows', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'about');
      await expect(page.locator('#aboutBioFields .bio-para-row')).toHaveCount(4);
    });

    test('all EN and ES bio fields are populated', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'about');
      const enFields = page.locator('#aboutBioFields textarea[data-lang="en"]');
      const esFields = page.locator('#aboutBioFields textarea[data-lang="es"]');
      await expect(enFields).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        await expect(enFields.nth(i)).not.toBeEmpty();
        await expect(esFields.nth(i)).not.toBeEmpty();
      }
    });

    test('Add Paragraph button adds a new row', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'about');
      await page.click('#addBioParaBtn');
      await expect(page.locator('#aboutBioFields .bio-para-row')).toHaveCount(5);
    });

  });

  // ── Images tab ───────────────────────────────────────────────────────────
  test.describe('Images tab', () => {

    test('shows upload area with file input', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'images');
      await expect(page.locator('#uploadArea')).toBeVisible();
      await expect(page.locator('#fileInput')).toBeAttached();
    });

    test('images grid renders without error', async ({ page }) => {
      await loginViaToken(page);
      await goToTab(page, 'images');
      await expect(page.locator('#imagesGrid')).toBeAttached();
    });

  });

});
