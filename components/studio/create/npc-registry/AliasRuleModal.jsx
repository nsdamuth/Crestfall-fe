"use client";

import AliasRuleModalView from "./alias-rule/AliasRuleModal.view";
import { useAliasRuleModalViewModel } from "./alias-rule/useAliasRuleModalViewModel";

export default function AliasRuleModal(props) {
  const viewProps = useAliasRuleModalViewModel(props);

  return <AliasRuleModalView {...viewProps} />;
}
