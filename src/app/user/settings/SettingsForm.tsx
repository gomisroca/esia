'use client';

import Button from '@/app/_components/ui/Button';

function SettingsForm({ name, email }: Readonly<{ name: string; email: string }>) {
  return (
    <form>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-lg font-bold">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={name}
          className="rounded-md bg-neutral-800/10 p-2 text-neutral-800 dark:bg-neutral-200/10 dark:text-neutral-200"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-lg font-bold">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue={email}
          className="rounded-md bg-neutral-800/10 p-2 text-neutral-800 dark:bg-neutral-200/10 dark:text-neutral-200"
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}

export default SettingsForm;
