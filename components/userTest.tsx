// app/users/UserDisplayTest.tsx
'use client';

import { useState, useTransition } from 'react';
import { CreateUserTest } from '@/lib/db/actions/userActions';
import { Button } from '@/components/ui/button';
import { listUsers, deleteUsers } from '@/lib/db/actions/userActions';

export function UserDisplayTest({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isCreatePending, startCreateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const handleCreateUser = async () => {
    await CreateUserTest();

    startCreateTransition(async () => {
      const updatedUsers = await listUsers();
      setUsers(updatedUsers);
    });
  };

  const handleUserDelete = async () => {
    await deleteUsers();

    startDeleteTransition(async () => {
        const updatedUsers = await listUsers();
        setUsers(updatedUsers);
    });
  };

  return (
    <div className='h-full'>
      <Button onClick={handleCreateUser} disabled={isCreatePending}>
        {isCreatePending ? 'Creating...' : 'Create random User'}
      </Button>
      <Button onClick={handleUserDelete} disabled={isDeletePending}>
        {isDeletePending ? 'Deleting...' : 'Delete All Users'}
      </Button>
      <div className='flex flex-col'>
        {users.map((user) => (
            <div key={user.id}>
            {user.id} - {user.name} - {user.email}
            </div>
        ))}
      </div>
    </div>
  );
}
