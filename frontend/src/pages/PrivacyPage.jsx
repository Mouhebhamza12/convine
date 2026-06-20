import LegalPage from '../components/LegalPage';

const SECTIONS = [
    {
        h: 'Information we collect',
        p: [
            'When you buy Convive, we create an account for you with a login email and a password. You then add your event details, the couple’s names, the date, the venue, a personal message, and any photos you choose to upload.',
            'You also add your guest list. For each guest we store a name and, once they respond, their RSVP status.',
            'Like most websites, we keep basic technical logs, such as IP address and browser type, to keep the service running and secure.',
        ],
    },
    {
        h: 'How we use it',
        p: [
            'We use your information to run your invitation: to build your page, deliver it to the guests you invite, record their RSVPs, and support your account. That is all.',
        ],
    },
    {
        h: 'Your guests’ information',
        p: [
            'Guest names and RSVP responses belong to your event. We use them only to show and manage your invitation, and never for marketing.',
        ],
    },
    {
        h: 'Sharing',
        p: [
            'We do not sell your data. We share it only with the providers that host and operate Convive, and only as needed to run the service for you.',
        ],
    },
    {
        h: 'Cookies',
        p: [
            'We use a single session cookie to keep you signed in. We do not use advertising or third-party tracking cookies.',
        ],
    },
    {
        h: 'Keeping your data',
        p: [
            'We keep your invitation and guest data while your account is active. If you would like it removed, ask us and we will delete it.',
        ],
    },
    {
        h: 'Security',
        p: [
            'Passwords are stored only as secure hashes, traffic is encrypted, and access to each invitation is protected. No system is perfectly secure, but we take reasonable care to protect your information.',
        ],
    },
    {
        h: 'Your choices',
        p: [
            'You can ask to see, correct, or delete your information at any time. Reach us through the contact link below.',
        ],
    },
    {
        h: 'Changes to this policy',
        p: [
            'If we update this policy, we will change the date at the top of this page.',
        ],
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            updated="20 June 2026"
            lead="Convive helps couples send digital wedding invitations and collect RSVPs. This policy explains what we collect, why, and what we do with it, in plain language."
            sections={SECTIONS}
        />
    );
}
