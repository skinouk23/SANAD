import {
  ActivityGoalCard,
  ActivityGoalModal,
  ActivityInsightsCard,
  ActivitySessionCard,
  ActivitySessionsHistory,
  ActivityStartCard,
  ActivityTotalsCard,
  ActivityTrackingHeader,
  ActivityWeekChart,
} from './ActivityTrackingSections';
import { useActivityTrackingScreen } from './useActivityTrackingScreen';

export function ActivityTrackingScreen() {
  const screen = useActivityTrackingScreen();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 pb-20 dark:from-indigo-950 dark:via-slate-950 dark:to-slate-900">
      <ActivityTrackingHeader />

      <div className="mx-auto -mt-8 max-w-4xl px-4">
        {screen.activeSession ? (
          <ActivitySessionCard
            activeSession={screen.activeSession}
            formatDuration={screen.formatDuration}
            formatTime={screen.formatTime}
            isPaused={screen.isPaused}
            onEnd={screen.endSession}
            onTogglePause={screen.togglePause}
          />
        ) : null}

        {screen.activeSession || screen.totalSteps > 0 ? (
          <ActivityInsightsCard
            calorieBurnRate={screen.calorieBurnRate}
            currentSpeed={screen.currentSpeed}
            heartRate={screen.heartRate}
            hydrationNeeded={screen.hydrationNeeded}
            intensity={screen.intensity}
            recovery={screen.recovery}
            totalCalories={screen.totalCalories}
            totalDuration={screen.totalDuration}
            userWeight={screen.userProfile.weight}
          />
        ) : null}

        {!screen.activeSession ? <ActivityStartCard onStart={screen.startSession} /> : null}

        <ActivityTotalsCard
          goal={screen.goal}
          percentage={screen.percentage}
          totalCalories={screen.totalCalories}
          totalDistance={screen.totalDistance}
          totalDuration={screen.totalDuration}
          totalSteps={screen.totalSteps}
        />

        <ActivitySessionsHistory formatTime={screen.formatTime} sessions={screen.sessions} />

        <ActivityWeekChart goal={screen.goal} weekData={screen.weekData} />

        <ActivityGoalCard goal={screen.goal} onEdit={() => screen.setShowGoalModal(true)} />
      </div>

      <ActivityGoalModal
        newGoal={screen.newGoal}
        onCancel={() => {
          screen.setShowGoalModal(false);
          screen.setNewGoal(screen.goal);
        }}
        onChange={screen.setNewGoal}
        onSave={screen.updateGoal}
        open={screen.showGoalModal}
      />
    </div>
  );
}
