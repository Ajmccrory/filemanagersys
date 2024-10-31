import { CaseList } from '@/components/cases/CaseList';
import { NewCaseForm } from '@/components/cases/NewCaseForm';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Case</h2>
        <NewCaseForm />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Cases</h2>
        <CaseList />
      </div>
    </div>
  );
}