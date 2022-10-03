import BlankLayout from '@components/BlankLayout';
import Card from '@components/Card';

const Verify = () => (
  <BlankLayout>
    <Card>
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl font-bold text-center">Got it! Email sent</h1>
        <p className="text-base">
          Check your email for a button that will log you in.
        </p>
      </div>
    </Card>
  </BlankLayout>
);

export default Verify;
