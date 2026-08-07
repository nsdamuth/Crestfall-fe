"use client";

import EyebrowView from "./eyebrow/Eyebrow.view";
import { useEyebrowViewModel } from "./eyebrow/useEyebrowViewModel";

export default function Eyebrow(props) {
  const viewProps = useEyebrowViewModel(props);

  return <EyebrowView {...viewProps} />;
}
