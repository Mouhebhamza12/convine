import LegalPage from '../components/LegalPage';

const SECTIONS = [
    {
        h: 'Your account',
        p: [
            'After you purchase Convive, we create an account for you and share the login once. Keep your password private. You are responsible for activity on your account. Let us know if you think it has been compromised.',
        ],
    },
    {
        h: 'Using Convive',
        p: [
            'Use Convive for your own event. Please do not upload unlawful content, infringe anyone’s rights, or attempt to break, overload, or misuse the service.',
        ],
    },
    {
        h: 'Your content',
        p: [
            'Your event details, wording, and photos are yours. You give us permission to host and display them so we can run your invitation and show it to the guests you invite.',
            'You are responsible for having the rights to anything you upload.',
        ],
    },
    {
        h: 'Payment',
        p: [
            'Convive is a paid product. Your invitation becomes available once payment is complete. What is included is shown before you buy.',
        ],
    },
    {
        h: 'Availability',
        p: [
            'We work to keep Convive available and may improve it over time. Occasionally we may need to take it down briefly for maintenance.',
        ],
    },
    {
        h: 'As-is service',
        p: [
            'Convive is provided “as is.” To the extent the law allows, we are not liable for indirect or incidental losses arising from your use of the service.',
        ],
    },
    {
        h: 'Ending',
        p: [
            'You can stop using Convive at any time. We may suspend or close an account that breaks these terms.',
        ],
    },
    {
        h: 'Contact',
        p: [
            'Questions about these terms? Reach us through the contact link below.',
        ],
    },
];

export default function TermsPage() {
    return (
        <LegalPage
            title="Terms of Service"
            updated="20 June 2026"
            lead="These terms cover your use of Convive. By using the service, you agree to them."
            sections={SECTIONS}
        />
    );
}
