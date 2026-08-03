import NarratorModuleSelectorView from "@/components/studio/create/narrator/narrator-module-selector/NarratorModuleSelector.view";
import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function NarratorModulesSectionView({
  sectionEyebrow = "Narrator Editor",
  sectionTitle = "Narrator Modules",
  sectionDescription = "",
  moduleSelector = {},
} = {}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6">
        <NarratorModuleSelectorView {...(moduleSelector || {})} />
      </div>
    </div>
  );
}
