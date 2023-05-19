import { Toaster } from "react-hot-toast";

export function ToastWrapper(props: React.PropsWithChildren) {
  return (
    <>
      <Toaster />
      {props.children}
    </>
  );
}
