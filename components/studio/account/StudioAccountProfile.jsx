"use client";

import DefaultPlayerCharacterPickerModal from "@/components/studio/account/DefaultPlayerCharacterPickerModal";
import StudioAccountMetrics from "@/components/studio/account/StudioAccountMetrics";
import ProfileMediaManager from "@/components/studio/profile/ProfileMediaManager";

import StudioAccountProfileView from "./studio-account-profile/StudioAccountProfile.view";
import { useStudioAccountProfileViewModel } from "./studio-account-profile/useStudioAccountProfileViewModel";

export default function StudioAccountProfile() {
  const viewProps = useStudioAccountProfileViewModel();

  const profileMediaContent = viewProps.hasPublicProfile ? (
    <ProfileMediaManager profile={viewProps.profileMediaProfile} />
  ) : null;

  const accountMetricsContent = (
    <StudioAccountMetrics className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4" />
  );

  return (
    <>
      <StudioAccountProfileView
        {...viewProps}
        profileMediaContent={profileMediaContent}
        accountMetricsContent={accountMetricsContent}
      />

      {viewProps.isDefaultPlayerCharacterPickerOpen ? (
        <DefaultPlayerCharacterPickerModal
          selectedId={viewProps.defaultPlayerCharacterPickerSelectedId}
          onClose={viewProps.onCloseDefaultPlayerCharacterPicker}
          onSelect={viewProps.onSelectDefaultPlayerCharacter}
        />
      ) : null}
    </>
  );
}
