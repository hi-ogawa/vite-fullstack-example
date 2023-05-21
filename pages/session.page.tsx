import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { trpcRQ } from "../src/trpc/react-query";

export function Page() {
  const meQuery = useQuery(trpcRQ.me.queryOptions());

  return (
    <div className="flex flex-col gap-2 w-md">
      <h2 className="text-lg">Session example</h2>
      {meQuery.isFetching && (
        <div className="flex justify-center p-3">
          <div className="antd-spin w-8 h-8"></div>
        </div>
      )}
      {!meQuery.isFetching && meQuery.isSuccess && meQuery.data && (
        <ProfileComponent
          name={meQuery.data.name}
          onLogout={() => {
            meQuery.refetch();
          }}
        />
      )}
      {!meQuery.isFetching && meQuery.isSuccess && !meQuery.data && (
        <LoginForm
          onLogin={() => {
            meQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

function ProfileComponent(props: { name: string; onLogout: () => void }) {
  const logoutMutation = useMutation({
    ...trpcRQ.logout.mutationOptions(),
    onSuccess: () => {
      props.onLogout();
    },
  });

  return (
    <div className="flex items-center gap-3">
      <div>Hello, {props.name}</div>
      <button
        className="antd-btn antd-btn-default px-2"
        onClick={() => logoutMutation.mutate()}
      >
        Logout
      </button>
    </div>
  );
}

function LoginForm(props: { onLogin: () => void }) {
  const form = useForm({ defaultValues: { name: "" } });
  const formIsValid = form.formState.isValid;

  const loginMutation = useMutation({
    ...trpcRQ.login.mutationOptions(),
    onSuccess: () => {
      props.onLogin();
    },
  });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit((data) => {
        loginMutation.mutate(data);
      })}
    >
      <label className="flex flex-col gap-1">
        <span>Name</span>
        <input
          className="antd-input px-1"
          {...form.register("name", { required: true })}
        />
      </label>
      <button
        className="antd-btn antd-btn-primary px-1"
        disabled={!formIsValid}
      >
        Login
      </button>
    </form>
  );
}
