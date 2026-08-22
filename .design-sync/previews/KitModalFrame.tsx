import KitModalFrame from "@/components/kit/KitModalFrame";
import { kitModalFrameFixtures } from "@/components/kit/modal-frame/KitModalFrame.fixtures";

const byId = Object.fromEntries(kitModalFrameFixtures.map((f) => [f.id, f.props]));

export function Default() {
  return <KitModalFrame {...byId.default} onClose={() => {}} />;
}

export function Scrolling() {
  return <KitModalFrame {...byId.scrolling} onClose={() => {}} />;
}

export function Sheet() {
  return <KitModalFrame {...byId.sheet} onClose={() => {}} />;
}

export function NoClose() {
  return <KitModalFrame {...byId.noClose} />;
}

export function Viewer() {
  return <KitModalFrame {...byId.viewer} onClose={() => {}} />;
}
