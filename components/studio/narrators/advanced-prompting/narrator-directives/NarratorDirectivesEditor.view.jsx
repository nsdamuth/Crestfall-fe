"use client";

import AdvancedPromptingEditorView from "@/components/studio/characters/advanced-prompting/advanced-prompting/AdvancedPromptingEditor.view";

const NARRATOR_DIRECTIVES_AUTHORITY_NOTICE =
  "Low-authority presentation preferences only. Certification makes this guidance eligible for consideration; it does not establish facts, authorize actions, mutate state, grant knowledge, control the Player Character or Characters, or advance Story/Scenario state. Story Presentation and explicit Narrator Configuration still take precedence.";

export default function NarratorDirectivesEditorView(props) {
  return (
    <AdvancedPromptingEditorView
      {...props}
      subjectLabel="narrator"
      title="Narrator Directives"
      description="Add nuanced narration preferences only when the standard Narrator configuration and Story Presentation controls are not enough. These directives shape how already-authorized reality is presented; they never decide what is true or what happens."
      inactiveDescription="Standard Narrator configuration, modules, and Story Presentation remain the primary narration controls. Narrator Directives add nothing unless enabled."
      authorityNotice={NARRATOR_DIRECTIVES_AUTHORITY_NOTICE}
    />
  );
}
