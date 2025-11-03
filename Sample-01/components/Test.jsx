import React from 'react';
import { Button } from 'reactstrap';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useUser } from '@auth0/nextjs-auth0';

const fetcher = async url => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch token');
  const data = await res.json();
  return data;
};

const TestInner = () => {
  const { data: authToken, mutate } = useSWR('/auth/access-token', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false
  });

  console.log('authToken: ', authToken);
  const refreshSessionApp = useSWRMutation('/api/app-refresh', fetcher);
  const refreshSessionPages = useSWRMutation('/api/pages-refresh', fetcher);

  return (
    <div className="d-flex flex-row mt-5" style={{ gap: '10px' }}>
      <Button
        color="primary"
        onClick={async _ => {
          try {
            await refreshSessionPages.trigger();
            mutate();
          } catch (error) {
            console.error(error);
          }
        }}>
        Pages - Refresh token
      </Button>
      <Button
        color="primary"
        onClick={async _ => {
          try {
            await refreshSessionApp.trigger();
            mutate();
          } catch (error) {
            console.error(error);
          }
        }}>
        App - Refresh token
      </Button>
      <Button
        color="primary"
        onClick={e => {
          try {
            mutate();
          } catch (error) {
            console.error(error);
          }
        }}>
        Get token
      </Button>
    </div>
  );
};

const Test = () => {
  const { user } = useUser();
  if (!user) {
    return <div>Please login to see the test</div>;
  }
  return <TestInner />;
};

export default Test;
