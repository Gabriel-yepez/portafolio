import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const BRAND_COLOR = '#6366f1';

export type ContactNotificationEmailProps = {
  name: string;
  email: string;
  message: string;
  submissionId: number;
};

export const ContactNotificationEmail = ({
  name,
  email,
  message,
  submissionId,
}: ContactNotificationEmailProps) => (
  <Html lang="es">
    <Head />
    <Preview>Nuevo mensaje de contacto de {name}</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Section style={styles.header}>
          <Text style={styles.headerLabel}>Portafolio · Formulario de contacto</Text>
          <Heading style={styles.heading}>Nuevo mensaje de contacto</Heading>
        </Section>

        <Section style={styles.card}>
          <Section style={styles.field}>
            <Text style={styles.fieldLabel}>Nombre</Text>
            <Text style={styles.fieldValue}>{name}</Text>
          </Section>

          <Section style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>
              <Link href={`mailto:${email}`} style={styles.link}>
                {email}
              </Link>
            </Text>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.field}>
            <Text style={styles.fieldLabel}>Mensaje</Text>
            <Text style={styles.messageBody}>{message}</Text>
          </Section>
        </Section>

        <Text style={styles.footer}>
          Envío #{submissionId} · Puedes responder directamente a este correo, se
          enviará a {email}.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ContactNotificationEmail;

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: '#f4f4f7',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: '32px 16px',
  },
  container: {
    maxWidth: '480px',
    margin: '0 auto',
  },
  header: {
    padding: '0 8px 16px',
  },
  headerLabel: {
    color: BRAND_COLOR,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    margin: '0 0 8px',
  },
  heading: {
    color: '#111827',
    fontSize: '22px',
    fontWeight: 700,
    margin: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '24px',
  },
  field: {
    marginBottom: '4px',
  },
  fieldLabel: {
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    margin: '0 0 4px',
  },
  fieldValue: {
    color: '#111827',
    fontSize: '15px',
    margin: '0 0 12px',
  },
  link: {
    color: BRAND_COLOR,
    textDecoration: 'none',
  },
  hr: {
    borderColor: '#e5e7eb',
    margin: '16px 0',
  },
  messageBody: {
    color: '#374151',
    fontSize: '15px',
    lineHeight: '24px',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  footer: {
    color: '#9ca3af',
    fontSize: '12px',
    lineHeight: '18px',
    padding: '16px 8px 0',
    textAlign: 'center',
  },
};
