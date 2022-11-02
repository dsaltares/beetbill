import { generateHtmlEmail } from './email';

describe('generateHtmlEmail', () => {
  it('generates a valid mjml template', () => {
    const url = 'https://invoicing.saltares.com/auth/magic-link';
    const host = 'invoicing.saltares.com';
    const email = 'ada@lovelace.com';

    const html = generateHtmlEmail({ url, host, email });

    expect(typeof html).toBe('string');
    expect(html).toContain(url);
    expect(html).toContain(email);
  });
});
