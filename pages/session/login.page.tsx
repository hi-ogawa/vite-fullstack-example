import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { trpcRQ } from "../../src/trpc/react-query";

export function Page() {
  const form = useForm({ defaultValues: { name: "" } });
  const formIsValid = form.formState.isValid;

  const loginMutation = useMutation({
    ...trpcRQ.login.mutationOptions(),
    onSuccess: () => {
      window.location.href = "/session/me";
    },
  });

  return (
    <div className="flex flex-col gap-2 w-md">
      <h2 className="text-lg">Session example</h2>
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
    </div>
  );
}
