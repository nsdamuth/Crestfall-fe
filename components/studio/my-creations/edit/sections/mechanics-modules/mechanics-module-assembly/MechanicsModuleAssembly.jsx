"use client";

import {
  MechanicsDocumentOrchestrationControls,
  MechanicsDocumentOrchestrationSurfaces,
} from "../mechanics-document-orchestration/MechanicsDocumentOrchestration";
import MechanicsCommandResolution from "../mechanics-command-resolution/MechanicsCommandResolution";
import {
  normalizeMechanicsCommandResolution,
} from "../mechanics-command-resolution/mechanicsCommandResolutionNormalization.js";
import MechanicsTrackersSection from "../mechanics-trackers/MechanicsTrackersSection";
import {
  normalizeMechanicsCommandStateReadoutBuilder,
} from "../mechanicsCommandStateReadoutBuilder.js";
import {
  MechanicsCommandArgumentsSection,
  MechanicsCommandIdentitySection,
  MechanicsCommandInvocationSection,
  MechanicsCommandTriggersSection,
} from "../mechanics-command-core/MechanicsCommandCore.jsx";
import {
  normalizeCommandInvocation,
} from "../mechanics-command-core/mechanicsCommandCoreNormalization.js";
import MechanicsCommandOutcomes from "../mechanics-command-outcomes/MechanicsCommandOutcomes";
import {
  normalizeCommandOutcomes,
} from "../mechanics-command-outcomes/mechanicsCommandOutcomesNormalization.js";
import MechanicsCommandRequirements from "../mechanics-command-requirements/MechanicsCommandRequirements";
import {
  normalizeMechanicsCommandRequirements,
} from "../mechanics-command-requirements/mechanicsCommandRequirementsNormalization.js";
import MechanicsCommandEffects, {
  MechanicsCommandEffectCard,
} from "../mechanics-command-effects/MechanicsCommandEffects";
import {
  getMechanicsEffectNumericArgumentOptions,
  getMechanicsEffectTargetArgumentOptions,
  normalizeMechanicsCommandEffect,
  normalizeMechanicsCommandEffects,
} from "../mechanics-command-effects/mechanicsCommandEffectsNormalization.js";
import MechanicsCommandDomainActions from "../mechanics-command-domain-actions/MechanicsCommandDomainActions";
import {
  normalizeMechanicsCommandDomainAction,
} from "../mechanics-command-domain-actions/mechanicsCommandDomainActionsNormalization.js";
import MechanicsDefaults from "../mechanics-defaults/MechanicsDefaults";
import MechanicsStatusBlocks from "../mechanics-status-blocks/MechanicsStatusBlocks";
import StoryStatusSurfaces from "../mechanics-story-status-surfaces/StoryStatusSurfaces";
import MechanicsGuards from "../mechanics-guards/MechanicsGuards";
import MechanicsCompositionBuilder from "../mechanics-composition-builder/MechanicsCompositionBuilder";
import {
  normalizeMechanicsCommandCompositionBuilder,
} from "../mechanicsCommandCompositionBuilder.js";
import MechanicsModuleAssemblyView, {
  MechanicsCommandsAssemblyView,
} from "./MechanicsModuleAssembly.view.jsx";
import {
  addMechanicsAssemblyCommand,
  asMechanicsObject,
  getMechanicsCommandFoldSummary,
  normalizeMechanicsAssemblyCommand,
  patchMechanicsAssemblyCommand,
  removeMechanicsAssemblyCommand,
} from "./mechanicsModuleAssemblyOperations.js";
import {
  useMechanicsModuleAssemblyViewModel,
} from "./useMechanicsModuleAssemblyViewModel.js";

function MechanicsCommandCard({
  command,
  commandIndex,
  commands,
  onPatchCommand,
  onRemoveCommand,
}) {
  const safeCommand = normalizeMechanicsAssemblyCommand(command, commandIndex);
  const effects = normalizeMechanicsCommandEffects(safeCommand.effects);
  const invocation = normalizeCommandInvocation(safeCommand.invocation);
  const requirements = normalizeMechanicsCommandRequirements(safeCommand.requirements);
  const attemptEffects = normalizeMechanicsCommandEffects(safeCommand.attemptEffects);
  const resolution = normalizeMechanicsCommandResolution(safeCommand.resolution);
  const outcomes = normalizeCommandOutcomes(safeCommand.outcomes, {
    normalizeEffect: normalizeMechanicsCommandEffect,
  });
  const domainAction = normalizeMechanicsCommandDomainAction(safeCommand.domainAction);
  const composition = normalizeMechanicsCommandCompositionBuilder(
    safeCommand.composition
  );
  const targetArgumentOptions = getMechanicsEffectTargetArgumentOptions(invocation);
  const itemNumberArgumentOptions = getMechanicsEffectNumericArgumentOptions(invocation);

  return (
    <article className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <MechanicsCommandIdentitySection
        command={safeCommand}
        commandIndex={commandIndex}
        commands={commands}
        onPatchCommand={onPatchCommand}
        onRemoveCommand={() => onRemoveCommand(commandIndex)}
        normalizeStateReadout={normalizeMechanicsCommandStateReadoutBuilder}
      />

      <div className="mt-5 rounded-xl border border-[var(--gold-ornament)]/20 bg-black/20 p-4">
        <MechanicsCommandInvocationSection
          command={safeCommand}
          commandIndex={commandIndex}
          commands={commands}
          onPatchCommand={onPatchCommand}
          normalizeStateReadout={normalizeMechanicsCommandStateReadoutBuilder}
        />
        <div className="mt-4">
          <MechanicsCommandRequirements
            requirements={requirements}
            commandIndex={commandIndex}
            onPatchCommand={onPatchCommand}
          />
        </div>
        <div className="mt-4">
          <MechanicsCommandDomainActions
            domainAction={domainAction}
            invocation={invocation}
            onChange={(nextDomainAction) =>
              onPatchCommand(commandIndex, { domainAction: nextDomainAction })
            }
          />
        </div>
        <div className="mt-4">
          <MechanicsCommandEffects
            variant="ATTEMPT"
            effects={attemptEffects}
            onChange={(nextEffects) =>
              onPatchCommand(commandIndex, {
                attemptEffects: normalizeMechanicsCommandEffects(nextEffects),
              })
            }
            argumentOptions={targetArgumentOptions}
            numericArgumentOptions={itemNumberArgumentOptions}
          />
        </div>
        <div className="mt-4">
          <MechanicsCommandResolution
            resolution={resolution}
            argumentOptions={targetArgumentOptions}
            onChange={(nextResolution) =>
              onPatchCommand(commandIndex, {
                resolution: normalizeMechanicsCommandResolution(nextResolution),
              })
            }
          />
        </div>
        <div className="mt-4">
          <MechanicsCommandOutcomes
            outcomes={outcomes}
            commandIndex={commandIndex}
            onPatchCommand={onPatchCommand}
            normalizeEffect={normalizeMechanicsCommandEffect}
            EffectCardComponent={MechanicsCommandEffectCard}
            argumentOptions={targetArgumentOptions}
            numericArgumentOptions={itemNumberArgumentOptions}
          />
        </div>
        <div className="mt-4">
          <MechanicsCompositionBuilder
            composition={composition}
            invocationArguments={invocation.arguments}
            onChange={(nextComposition) =>
              onPatchCommand(commandIndex, {
                composition: normalizeMechanicsCommandCompositionBuilder(
                  nextComposition
                ),
              })
            }
          />
        </div>
        <MechanicsCommandArgumentsSection
          command={safeCommand}
          commandIndex={commandIndex}
          commands={commands}
          onPatchCommand={onPatchCommand}
          normalizeStateReadout={normalizeMechanicsCommandStateReadoutBuilder}
        />
      </div>

      <MechanicsCommandTriggersSection
        command={safeCommand}
        commandIndex={commandIndex}
        commands={commands}
        onPatchCommand={onPatchCommand}
        normalizeStateReadout={normalizeMechanicsCommandStateReadoutBuilder}
      />

      <div className="mt-5">
        <MechanicsCommandEffects
          variant="BASE"
          effects={effects}
          onChange={(nextEffects) =>
            onPatchCommand(commandIndex, {
              effects: normalizeMechanicsCommandEffects(nextEffects),
            })
          }
          argumentOptions={targetArgumentOptions}
          numericArgumentOptions={itemNumberArgumentOptions}
        />
      </div>
    </article>
  );
}

function MechanicsCommandsAssembly({ commands, updateCommands, foldSignal }) {
  function patchCommand(commandIndex, patch) {
    updateCommands(patchMechanicsAssemblyCommand(commands, commandIndex, patch));
  }

  function removeCommand(commandIndex) {
    updateCommands(removeMechanicsAssemblyCommand(commands, commandIndex));
  }

  return (
    <MechanicsCommandsAssemblyView
      commands={commands}
      foldSignal={foldSignal}
      onAddCommand={() => updateCommands(addMechanicsAssemblyCommand(commands))}
      onRemoveCommand={removeCommand}
      getCommandKey={(command, commandIndex) =>
        normalizeMechanicsAssemblyCommand(command, commandIndex).id || commandIndex
      }
      getCommandTitle={(command, commandIndex) => {
        const safeCommand = normalizeMechanicsAssemblyCommand(command, commandIndex);
        return safeCommand.label || safeCommand.id || `Command ${commandIndex + 1}`;
      }}
      getCommandSummary={getMechanicsCommandFoldSummary}
      renderCommand={(command, commandIndex) => (
        <MechanicsCommandCard
          command={asMechanicsObject(command)}
          commandIndex={commandIndex}
          commands={commands}
          onPatchCommand={patchCommand}
          onRemoveCommand={removeCommand}
        />
      )}
    />
  );
}

export default function MechanicsModuleAssembly(props) {
  const assembly = useMechanicsModuleAssemblyViewModel(props);
  const { projection, foldSignal } = assembly;

  return (
    <MechanicsModuleAssemblyView
      {...assembly.viewProps}
      documentControls={
        <MechanicsDocumentOrchestrationControls
          {...assembly.documentOrchestration.controlsProps}
        />
      }
      documentSurfaces={
        <MechanicsDocumentOrchestrationSurfaces
          {...assembly.documentOrchestration.surfacesProps}
        />
      }
      trackersContent={
        <MechanicsTrackersSection
          trackers={projection.trackers}
          onChange={assembly.updateTrackers}
          foldSignal={foldSignal}
        />
      }
      commandsContent={
        <MechanicsCommandsAssembly
          commands={projection.commands}
          updateCommands={assembly.updateCommands}
          foldSignal={foldSignal}
        />
      }
      defaultsContent={
        <MechanicsDefaults
          defaults={projection.defaults}
          onChange={assembly.updateDefaults}
        />
      }
      statusBlocksContent={
        <MechanicsStatusBlocks
          statusBlocks={projection.statusBlocks}
          onChange={assembly.updateStatusBlocks}
          foldSignal={foldSignal}
        />
      }
      storyStatusSurfacesContent={
        <StoryStatusSurfaces
          statusSurfaces={projection.storyStatusSurfaces}
          onChange={assembly.updateStoryStatusSurfaces}
          foldSignal={foldSignal}
          mechanicsSourceOptions={
            projection.storyStatusSurfaceMechanicsSourceOptions
          }
        />
      }
      guardsContent={
        <MechanicsGuards
          guards={projection.guards}
          onChange={assembly.updateGuards}
          foldSignal={foldSignal}
        />
      }
    />
  );
}
