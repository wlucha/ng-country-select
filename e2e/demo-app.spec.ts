import { test, expect, Page } from '@playwright/test';

// Helper: locate an .example block by its h2 heading text
function exampleSection(page: Page, heading: string) {
    return page.locator('.example', { has: page.locator(`h2:has-text("${heading}")`) });
}

test.describe('ng-country-select component', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    // ── Appearance ──────────────────────────────────────────────────────────

    test('should render with outline appearance', async ({ page }) => {
        const section = exampleSection(page, '1. Outline Appearance');
        const formField = section.locator('.preview mat-form-field');
        await expect(formField).toBeVisible();
        await expect(formField).toHaveClass(/mat-form-field-appearance-outline/);
    });

    // ── Include / Exclude Countries ─────────────────────────────────────────

    test('should render with excludeCountries input', async ({ page }) => {
        const section = exampleSection(page, '2. Exclude countries');
        await expect(section.locator('.preview ng-country-select')).toBeVisible();
        await expect(section.locator('.preview mat-form-field')).toBeVisible();
    });

    test('should render with includeCountries input', async ({ page }) => {
        const section = exampleSection(page, '3. Include countries');
        await expect(section.locator('.preview ng-country-select')).toBeVisible();
        await expect(section.locator('.preview mat-form-field')).toBeVisible();
    });

    // ── Default Country ─────────────────────────────────────────────────────

    test('should preset default country via defaultCountry input', async ({ page }) => {
        const section = exampleSection(page, '4. Set Default Country (non-FormControl)');
        const input = section.locator('.preview input[matinput]').first();
        await expect(input).toHaveValue('Germany');
    });

    test('should display German flag for preset country', async ({ page }) => {
        const section = exampleSection(page, '4. Set Default Country (non-FormControl)');
        const flag = section.locator('.preview .fi-de');
        await expect(flag).toBeVisible();
    });

    test('should preset default country via FormControl', async ({ page }) => {
        const section = exampleSection(page, '5. Set Default Country (FormControl)');
        const input = section.locator('.preview input[matinput]').first();
        await expect(input).toHaveValue('Germany');
    });

    // ── Language Switching ──────────────────────────────────────────────────

    test('should update displayed country name when lang changes', async ({ page }) => {
        const section = exampleSection(page, '6. Set language');
        const input = section.locator('.preview input[matinput]').first();
        await input.scrollIntoViewIfNeeded();

        await expect(input).toHaveValue('Germany');

        await section.locator('mat-radio-button', { hasText: 'Deutsch' }).click();
        await expect(input).toHaveValue('Deutschland');

        await section.locator('mat-radio-button', { hasText: 'Français' }).click();
        await expect(input).toHaveValue('Allemagne');

        await section.locator('mat-radio-button', { hasText: 'Español' }).click();
        await expect(input).toHaveValue('Alemania');

        await section.locator('mat-radio-button', { hasText: 'Русский' }).click();
        await expect(input).toHaveValue('Германия');
    });

    test('should update placeholder when language changes', async ({ page }) => {
        const section = exampleSection(page, '6. Set language');
        await section.scrollIntoViewIfNeeded();

        await section.locator('mat-radio-button', { hasText: 'Deutsch' }).click();
        const label = section.locator('.preview mat-label');
        await expect(label).toContainText('Land suchen');

        await section.locator('mat-radio-button', { hasText: 'Français' }).click();
        await expect(label).toContainText('Chercher un pays');

        await section.locator('mat-radio-button', { hasText: 'Español' }).click();
        await expect(label).toContainText('Buscar país');
    });

    // ── Custom Language (Polish) ────────────────────────────────────────────

    test('should support custom language via CountrySelectConfig', async ({ page }) => {
        const section = exampleSection(page, '7. Custom Language Support');
        const input = section.locator('.preview input[matinput]').first();
        await input.scrollIntoViewIfNeeded();
        await expect(input).toBeVisible();
        // Polish placeholder should be rendered
        await expect(section.locator('.preview ng-country-select')).toBeVisible();
    });

    // ── Display Options ─────────────────────────────────────────────────────

    test('should render with showCodes input', async ({ page }) => {
        const section = exampleSection(page, '8. Show Alpha2/Alpha3 Codes');
        await expect(section.locator('.preview ng-country-select')).toBeVisible();
    });

    test('should render with showFlag=false', async ({ page }) => {
        const section = exampleSection(page, '9. Hide Flag');
        await expect(section.locator('.preview ng-country-select')).toBeVisible();
    });

    test('should render with alpha2Only input', async ({ page }) => {
        const section = exampleSection(page, '10. Show Alpha2');
        await expect(section.locator('.preview ng-country-select')).toBeVisible();
    });

    // ── Programmatic Selection ──────────────────────────────────────────────

    test('should set country by alpha2 programmatically', async ({ page }) => {
        const section = exampleSection(page, '11. Set a country programmatically by Alpha2');
        const input = section.locator('.preview input[matinput]').first();
        await input.scrollIntoViewIfNeeded();

        await expect(input).toHaveValue('');
        await section.locator('button', { hasText: 'Set Germany as country' }).click();
        await expect(input).toHaveValue('Germany');
    });

    test('should display flag icon after programmatic alpha2 selection', async ({ page }) => {
        const section = exampleSection(page, '11. Set a country programmatically by Alpha2');
        await section.scrollIntoViewIfNeeded();

        await section.locator('button', { hasText: 'Set Germany as country' }).click();
        const flag = section.locator('.preview .fi-de');
        await expect(flag).toBeVisible();
    });

    test('should handle repeated programmatic alpha2 selection (idempotent)', async ({ page }) => {
        const section = exampleSection(page, '11. Set a country programmatically by Alpha2');
        const input = section.locator('.preview input[matinput]').first();
        await input.scrollIntoViewIfNeeded();

        await section.locator('button', { hasText: 'Set Germany as country' }).click();
        await expect(input).toHaveValue('Germany');

        await section.locator('button', { hasText: 'Set Germany as country' }).click();
        await expect(input).toHaveValue('Germany');
    });

    test('should set country by alpha3 programmatically', async ({ page }) => {
        const section = exampleSection(page, '12. Set a country programmatically by Alpha3');
        const input = section.locator('.preview input[matinput]').first();
        await input.scrollIntoViewIfNeeded();

        await expect(input).toHaveValue('');
        await section.locator('button', { hasText: 'Set Germany as country' }).click();
        await expect(input).toHaveValue('Germany');
    });

    // ── Required Validation ─────────────────────────────────────────────────

    test('should show required error when touched without value', async ({ page }) => {
        const section = exampleSection(page, '13. Using required fields');
        const input = section.locator('.preview input[matinput]').first();
        await input.scrollIntoViewIfNeeded();

        await input.focus();
        await page.keyboard.press('Escape');
        await page.keyboard.press('Tab');

        const error = section.locator('.preview mat-error').first();
        await expect(error).toContainText('Please select a country');
    });

    test('should have required and aria-required attributes', async ({ page }) => {
        const section = exampleSection(page, '13. Using required fields');
        const input = section.locator('.preview input[matinput]').first();
        await input.scrollIntoViewIfNeeded();

        await expect(input).toHaveAttribute('required', '');
        await expect(input).toHaveAttribute('aria-required', 'true');
    });

    // ── All Inputs & Outputs ────────────────────────────────────────────────

    test('should display default country in German when lang=de', async ({ page }) => {
        const section = exampleSection(page, '14. All Inputs');
        const input = section.locator('.preview input[matinput]').first();
        await input.scrollIntoViewIfNeeded();

        await expect(input).toHaveValue('Deutschland');
    });

    test('should display selected country as JSON output', async ({ page }) => {
        const section = exampleSection(page, '14. All Inputs');
        await section.scrollIntoViewIfNeeded();

        const preview = section.locator('.preview');
        await expect(preview).toContainText('Selected:');
        await expect(preview).toContainText('"alpha2": "de"');
        await expect(preview).toContainText('"alpha3": "deu"');
    });

    test('should render custom label text', async ({ page }) => {
        const section = exampleSection(page, '14. All Inputs');
        await section.scrollIntoViewIfNeeded();

        const label = section.locator('.preview mat-label');
        await expect(label).toContainText('Custom Label');
    });

    test('should combine outline + required + label + formControl', async ({ page }) => {
        const section = exampleSection(page, '14. All Inputs');
        const formField = section.locator('.preview mat-form-field');
        const input = section.locator('.preview input[matinput]').first();
        await formField.scrollIntoViewIfNeeded();

        await expect(formField).toHaveClass(/mat-form-field-appearance-outline/);
        await expect(input).toHaveAttribute('required', '');
        await expect(input).toHaveAttribute('aria-required', 'true');
    });

    // ── Custom Label & Error Projection ─────────────────────────────────────

    test('should display custom label via label input', async ({ page }) => {
        const section = exampleSection(page, '15. Custom Label');
        await section.scrollIntoViewIfNeeded();

        const label = section.locator('.preview mat-label');
        await expect(label).toContainText('Select a Country');
    });

    test('should show projected error when touched and hide on reset', async ({ page }) => {
        const section = exampleSection(page, '15. Custom Label');
        await section.scrollIntoViewIfNeeded();

        await section.locator('button', { hasText: 'Mark as Touched' }).click();

        const error = section.locator('.preview [country-error]');
        await expect(error).toContainText('You must select a country!');

        await section.locator('button', { hasText: 'Reset' }).click();
        await page.waitForTimeout(300);
        await expect(error).toBeHidden();
    });

    // ── No Label Mode ───────────────────────────────────────────────────────

    test('should not render mat-label when showLabel=false', async ({ page }) => {
        const section = exampleSection(page, '16. No Label');
        const formField = section.locator('.preview mat-form-field');
        await formField.scrollIntoViewIfNeeded();
        await expect(formField).toBeVisible();
        const label = section.locator('.preview mat-label');
        await expect(label).toHaveCount(0);
    });

    // ── Accessibility ───────────────────────────────────────────────────────

    test('should have correct ARIA attributes for autocomplete', async ({ page }) => {
        const section = exampleSection(page, '1. Outline Appearance');
        const input = section.locator('.preview input[matinput]').first();

        await expect(input).toHaveAttribute('role', 'combobox');
        await expect(input).toHaveAttribute('aria-autocomplete', 'list');
        await expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    });
});
