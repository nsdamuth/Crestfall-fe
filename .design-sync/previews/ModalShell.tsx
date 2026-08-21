import ModalShell from "@/components/ui/ModalShell";
import { modalShellFixtures } from "@/components/ui/modal-shell/ModalShell.fixtures";

const byId = Object.fromEntries(modalShellFixtures.map((f) => [f.id, f.props]));

export function Default() {
  return <ModalShell {...byId.default} />;
}

export function NoCloseCallback() {
  return <ModalShell {...byId["no-close"]} />;
}

export function Scrolling() {
  return <ModalShell {...byId.scrolling} onClose={() => {}} />;
}
