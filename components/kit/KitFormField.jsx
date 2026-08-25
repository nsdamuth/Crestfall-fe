"use client";

import KitFormFieldView from "./form-field/KitFormField.view";
import { useKitFormFieldViewModel } from "./form-field/useKitFormFieldViewModel";

export default function KitFormField(props) {
  const viewProps = useKitFormFieldViewModel(props);

  return <KitFormFieldView {...viewProps} />;
}
