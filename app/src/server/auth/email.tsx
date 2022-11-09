import nodemailer from 'nodemailer';
import type { EmailConfig } from 'next-auth/providers';
import {
  render,
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlPreview,
  MjmlBody,
  MjmlWrapper,
  MjmlSection,
  MjmlColumn,
  MjmlButton,
  MjmlFont,
  MjmlStyle,
  MjmlText,
  MjmlImage,
} from 'mjml-react';
import Routes from '@lib/routes';

export const sendVerificationRequest: EmailConfig['sendVerificationRequest'] =
  async ({ identifier: email, url, provider: { server, from } }) => {
    const { host } = new URL(url);
    const transport = nodemailer.createTransport(server);
    const generateEmailArgs = { url, host, email };
    await transport.sendMail({
      to: email,
      from,
      subject: `Sign in to ${host}`,
      text: generateTextEmail(generateEmailArgs),
      html: generateHtmlEmail(generateEmailArgs),
    });
  };

type GenerateEmailArgs = {
  url: string;
  host: string;
  email: string;
};

export const generateTextEmail = ({ url, host }: GenerateEmailArgs) =>
  `Sign in to ${host}\n${url}`;

export const generateHtmlEmail = ({ url, host, email }: GenerateEmailArgs) => {
  const title = `Sign in to ${host}`;
  return render(
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        <MjmlPreview>{title}</MjmlPreview>
        <MjmlFont
          name="Inter"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700"
        />
        <MjmlStyle>
          {`
            .box-shadow {
              box-shadow: 0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            .link-nostyle { color: inherit; text-decoration: none }
          `}
        </MjmlStyle>
      </MjmlHead>
      <MjmlBody backgroundColor={theme.colors.background}>
        <MjmlWrapper padding="12px">
          <MjmlSection
            backgroundColor={theme.colors.white}
            borderRadius="8px"
            css-class="box-shadow"
            paddingTop="36px"
          >
            <MjmlColumn>
              <MjmlImage
                width="140px"
                height="64px"
                src={`${baseUrl(host)}/beet-bill-logo-email.png`}
                paddingBottom={42}
              />
              <MjmlText
                fontSize={theme.fontSizes.lg}
                fontFamily={theme.font}
                align="center"
                fontWeight={700}
                paddingBottom={10}
                cssClass="link-nostyle"
              >
                Hello{' '}
                <a className="link-nostyle" href={`mailto://${email}`}>
                  {email}
                </a>
                !
              </MjmlText>
              <MjmlText
                fontSize={theme.fontSizes.md}
                fontFamily={theme.font}
                align="center"
                fontWeight={400}
                paddingBottom={24}
                cssClass="link-nostyle"
              >
                Click the button below to sign in to Beet Bill.
              </MjmlText>
              <MjmlButton
                backgroundColor={theme.colors.primary}
                href={url}
                paddingBottom={42}
                fontFamily={theme.font}
                fontSize={theme.fontSizes.md}
                borderRadius={8}
              >
                Sign in
              </MjmlButton>
              <MjmlText
                fontSize={theme.fontSizes.sm}
                fontFamily={theme.font}
                align="center"
                paddingBottom={36}
              >
                All the best,
                <br />
                Beet Bill team.
              </MjmlText>
            </MjmlColumn>
          </MjmlSection>
          <MjmlSection paddingTop="40px">
            <MjmlColumn width="25%">
              <PolicyLink href={`${baseUrl(host)}${Routes.termsAndConditions}`}>
                Terms of use
              </PolicyLink>
            </MjmlColumn>
            <MjmlColumn width="25%">
              <PolicyLink href={`${baseUrl(host)}${Routes.privacyPolicy}`}>
                Privacy policy
              </PolicyLink>
            </MjmlColumn>
          </MjmlSection>
        </MjmlWrapper>
      </MjmlBody>
    </Mjml>,
    { validationLevel: 'strict', minify: false }
  ).html;
};

const baseUrl = (host: string) => {
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
};

const theme = {
  colors: {
    primary: '#6d28d9',
    background: '#f5f3ff',
    white: '#FFFFFF',
  },
  font: 'Inter, sans-serif',
  fontSizes: {
    sm: '14px',
    md: '16px',
    lg: '36px',
    xl: '42px',
  },
};

type PolicyLinkProps = {
  href: string;
};

const PolicyLink = ({
  href,
  children,
}: React.PropsWithChildren<PolicyLinkProps>) => (
  <MjmlText
    fontSize={theme.fontSizes.sm}
    fontFamily={theme.font}
    align="center"
    color={theme.colors.primary}
  >
    <a href={href} className="link-nostyle">
      {children}
    </a>
  </MjmlText>
);
