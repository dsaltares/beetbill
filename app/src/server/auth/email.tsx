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
              <MjmlText
                fontSize={theme.fontSizes.lg}
                fontFamily={theme.font}
                align="center"
                fontWeight={700}
                paddingBottom="30px"
                cssClass="link-nostyle"
              >
                Hi{' '}
                <a className="link-nostyle" href={`mailto://${email}`}>
                  {email}
                </a>
                !
              </MjmlText>
              <MjmlButton
                backgroundColor={theme.colors.primary}
                href={url}
                paddingBottom="80px"
                fontFamily={theme.font}
                fontSize={theme.fontSizes.md}
              >
                Click here to sign in
              </MjmlButton>
              <MjmlText
                fontSize={theme.fontSizes.sm}
                fontFamily={theme.font}
                align="center"
              >
                All the best,
                <br />
                Invoicing team.
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
    lg: '22px',
    xl: '28px',
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
