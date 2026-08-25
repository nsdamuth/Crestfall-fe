"use client";

import DefaultPlayerCharacterPickerModal from "@/components/studio/account/DefaultPlayerCharacterPickerModal";

import AccountV2LiveView from "./account-live/AccountV2Live.view";
import { useAccountV2LiveViewModel } from "./account-live/useAccountV2LiveViewModel";

export default function AccountV2Live() {
  const viewProps = useAccountV2LiveViewModel();

  return (
    <>
      <AccountV2LiveView {...viewProps} />

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
