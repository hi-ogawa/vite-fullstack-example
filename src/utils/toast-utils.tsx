import { Toaster } from "react-hot-toast";

export function ToastWrapper(props: React.PropsWithChildren) {
  return (
    <>
      <Toaster
        toastOptions={{
          className: "!bg-colorBgElevated !text-colorText",
        }}
      />
      {props.children}
    </>
  );
}
