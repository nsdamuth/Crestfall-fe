"use client";

import KnowledgeRuleModalView from "./knowledge-rule/KnowledgeRuleModal.view";
import { useKnowledgeRuleModalViewModel } from "./knowledge-rule/useKnowledgeRuleModalViewModel";

export default function KnowledgeRuleModal(props) {
  const viewProps = useKnowledgeRuleModalViewModel(props);

  return <KnowledgeRuleModalView {...viewProps} />;
}
