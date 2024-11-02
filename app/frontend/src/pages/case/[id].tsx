import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { getCase, getEntities } from '@/lib/api';
import Layout from '@/components/Layout';

export default function CaseDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data: case_, isLoading: caseLoading } = useQuery(
    ['case', id],
    () => getCase(Number(id)),
    {
      enabled: !!id,
    }
  );

  const { data: entities, isLoading: entitiesLoading } = useQuery(
    ['entities', id],
    () => getEntities(Number(id)),
    {
      enabled: !!id,
    }
  );

  if (caseLoading || entitiesLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{case_?.title}</h1>
              <p className="mt-2 text-sm text-gray-500">{case_?.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">Evidence</h2>
              <ul className="mt-3 space-y-3">
                {case_?.evidence?.map((evidence) => (
                  <li
                    key={evidence.id}
                    className="overflow-hidden rounded-lg bg-white px-6 py-4 shadow"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {evidence.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {evidence.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">People</h2>
                <ul className="mt-3 space-y-3">
                  {entities?.people.map((person) => (
                    <li
                      key={person.id}
                      className="overflow-hidden rounded-lg bg-white px-6 py-4 shadow"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {person.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">{person.role}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Organizations</h2>
                <ul className="mt-3 space-y-3">
                  {entities?.organizations.map((org) => (
                    <li
                      key={org.id}
                      className="overflow-hidden rounded-lg bg-white px-6 py-4 shadow"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {org.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">{org.type}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 